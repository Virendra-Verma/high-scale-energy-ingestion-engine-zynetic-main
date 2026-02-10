import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { MeterTelemetryStrategy } from '../strategies/meter-telemetry.strategy';
import { VehicleTelemetryStrategy } from '../strategies/vehicle-telemetry.strategy';
import { BatchProcessorService } from './batch-processor.service';
import { TelemetryStrategy } from '../strategies/telemetry-strategy.interface';
import {
  IngestionResult,
  MeterTelemetryPayload,
  VehicleTelemetryPayload,
} from '../../common/interfaces/telemetry.interface';
import { IngestTelemetryDto } from '../dto';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);
  private readonly strategies: Map<string, TelemetryStrategy<any>>;

  constructor(
    private readonly meterStrategy: MeterTelemetryStrategy,
    private readonly vehicleStrategy: VehicleTelemetryStrategy,
    private readonly batchProcessor: BatchProcessorService,
  ) {
    this.strategies = new Map<string, TelemetryStrategy<any>>();
    this.strategies.set('meter', this.meterStrategy);
    this.strategies.set('vehicle', this.vehicleStrategy);
  }

  /**
   * Ingest a single telemetry record
   * Performs dual-write: UPSERT to live state + batch INSERT to history
   */
  async ingest(streamType: string, payload: unknown): Promise<void> {
    const strategy = this.strategies.get(streamType);
    if (!strategy) {
      throw new BadRequestException(`Unknown stream type: ${streamType}`);
    }

    const validated = strategy.validate(payload);

    // Dual-write pattern
    await strategy.persistLive(validated);

    // Enqueue for batch insert to history
    if (streamType === 'meter') {
      await this.batchProcessor.enqueueMeter(validated as MeterTelemetryPayload);
    } else {
      await this.batchProcessor.enqueueVehicle(validated as VehicleTelemetryPayload);
    }
  }

  /**
   * Ingest a batch of telemetry records
   * Processes records in parallel for maximum throughput
   */
  async ingestBatch(records: IngestTelemetryDto[]): Promise<IngestionResult> {
    const errors: string[] = [];
    let processed = 0;
    let failed = 0;

    // Group records by stream type for efficient processing
    const meterRecords: MeterTelemetryPayload[] = [];
    const vehicleRecords: VehicleTelemetryPayload[] = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      try {
        const strategy = this.strategies.get(record.streamType);
        if (!strategy) {
          throw new Error(`Unknown stream type: ${record.streamType}`);
        }

        const validated = strategy.validate(record.payload);

        if (record.streamType === 'meter') {
          meterRecords.push(validated as MeterTelemetryPayload);
        } else {
          vehicleRecords.push(validated as VehicleTelemetryPayload);
        }
        processed++;
      } catch (error) {
        failed++;
        errors.push(`Record ${i}: ${error.message}`);
      }
    }

    // Process live state updates in parallel
    const liveStatePromises: Promise<void>[] = [];

    for (const record of meterRecords) {
      liveStatePromises.push(this.meterStrategy.persistLive(record));
    }
    for (const record of vehicleRecords) {
      liveStatePromises.push(this.vehicleStrategy.persistLive(record));
    }

    // Wait for all live state updates
    const results = await Promise.allSettled(liveStatePromises);
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        this.logger.warn(`Live state update failed: ${result.reason}`);
      }
    });

    // Enqueue all records for batch history insert
    for (const record of meterRecords) {
      await this.batchProcessor.enqueueMeter(record);
    }
    for (const record of vehicleRecords) {
      await this.batchProcessor.enqueueVehicle(record);
    }

    return {
      success: failed === 0,
      processed,
      failed,
      timestamp: new Date(),
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Get current ingestion stats
   */
  getStats() {
    return this.batchProcessor.getBufferStats();
  }
}
