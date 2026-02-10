import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MeterTelemetryHistory, VehicleTelemetryHistory } from '../../database/entities';
import { MeterTelemetryPayload, VehicleTelemetryPayload } from '../../common/interfaces/telemetry.interface';
import { getAppConfig } from '../../config/app.config';

@Injectable()
export class BatchProcessorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BatchProcessorService.name);
  private readonly BATCH_SIZE: number;
  private readonly FLUSH_INTERVAL_MS: number;

  private meterBuffer: MeterTelemetryPayload[] = [];
  private vehicleBuffer: VehicleTelemetryPayload[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isShuttingDown = false;

  constructor(
    @InjectRepository(MeterTelemetryHistory)
    private readonly meterHistoryRepo: Repository<MeterTelemetryHistory>,
    @InjectRepository(VehicleTelemetryHistory)
    private readonly vehicleHistoryRepo: Repository<VehicleTelemetryHistory>,
    private readonly dataSource: DataSource,
  ) {
    const config = getAppConfig();
    this.BATCH_SIZE = config.batchSize;
    this.FLUSH_INTERVAL_MS = config.flushIntervalMs;
  }

  onModuleInit() {
    this.startFlushTimer();
    this.logger.log(
      `Batch processor initialized (batch_size=${this.BATCH_SIZE}, flush_interval=${this.FLUSH_INTERVAL_MS}ms)`,
    );
  }

  async onModuleDestroy() {
    this.isShuttingDown = true;
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    // Flush remaining records before shutdown
    await this.flushAll();
    this.logger.log('Batch processor shutdown complete');
  }

  private startFlushTimer() {
    this.flushTimer = setInterval(async () => {
      if (!this.isShuttingDown) {
        await this.flushAll();
      }
    }, this.FLUSH_INTERVAL_MS);
  }

  /**
   * Enqueue a meter telemetry record for batch insertion
   */
  async enqueueMeter(payload: MeterTelemetryPayload): Promise<void> {
    this.meterBuffer.push(payload);
    if (this.meterBuffer.length >= this.BATCH_SIZE) {
      await this.flushMeterBuffer();
    }
  }

  /**
   * Enqueue a vehicle telemetry record for batch insertion
   */
  async enqueueVehicle(payload: VehicleTelemetryPayload): Promise<void> {
    this.vehicleBuffer.push(payload);
    if (this.vehicleBuffer.length >= this.BATCH_SIZE) {
      await this.flushVehicleBuffer();
    }
  }

  /**
   * Flush all pending records
   */
  async flushAll(): Promise<void> {
    await Promise.all([this.flushMeterBuffer(), this.flushVehicleBuffer()]);
  }

  /**
   * Flush meter buffer using optimized bulk insert
   */
  private async flushMeterBuffer(): Promise<void> {
    if (this.meterBuffer.length === 0) return;

    const toInsert = [...this.meterBuffer];
    this.meterBuffer = [];

    try {
      // Use QueryBuilder for maximum performance
      await this.meterHistoryRepo
        .createQueryBuilder()
        .insert()
        .into(MeterTelemetryHistory)
        .values(
          toInsert.map((p) => ({
            meterId: p.meterId,
            kwhConsumedAc: p.kwhConsumedAc,
            voltage: p.voltage,
            timestamp: p.timestamp,
            ingestedAt: new Date(),
          })),
        )
        .execute();

      this.logger.debug(`Flushed ${toInsert.length} meter records to history`);
    } catch (error) {
      this.logger.error(`Failed to flush meter buffer: ${error.message}`);
      // Re-add failed records to buffer for retry
      this.meterBuffer = [...toInsert, ...this.meterBuffer];
      throw error;
    }
  }

  /**
   * Flush vehicle buffer using optimized bulk insert
   */
  private async flushVehicleBuffer(): Promise<void> {
    if (this.vehicleBuffer.length === 0) return;

    const toInsert = [...this.vehicleBuffer];
    this.vehicleBuffer = [];

    try {
      await this.vehicleHistoryRepo
        .createQueryBuilder()
        .insert()
        .into(VehicleTelemetryHistory)
        .values(
          toInsert.map((p) => ({
            vehicleId: p.vehicleId,
            soc: p.soc,
            kwhDeliveredDc: p.kwhDeliveredDc,
            batteryTemp: p.batteryTemp,
            timestamp: p.timestamp,
            ingestedAt: new Date(),
          })),
        )
        .execute();

      this.logger.debug(`Flushed ${toInsert.length} vehicle records to history`);
    } catch (error) {
      this.logger.error(`Failed to flush vehicle buffer: ${error.message}`);
      // Re-add failed records to buffer for retry
      this.vehicleBuffer = [...toInsert, ...this.vehicleBuffer];
      throw error;
    }
  }

  /**
   * Get current buffer sizes for monitoring
   */
  getBufferStats(): { meterBufferSize: number; vehicleBufferSize: number } {
    return {
      meterBufferSize: this.meterBuffer.length,
      vehicleBufferSize: this.vehicleBuffer.length,
    };
  }
}
