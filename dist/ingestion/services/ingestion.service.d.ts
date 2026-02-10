import { MeterTelemetryStrategy } from '../strategies/meter-telemetry.strategy';
import { VehicleTelemetryStrategy } from '../strategies/vehicle-telemetry.strategy';
import { BatchProcessorService } from './batch-processor.service';
import { IngestionResult } from '../../common/interfaces/telemetry.interface';
import { IngestTelemetryDto } from '../dto';
export declare class IngestionService {
    private readonly meterStrategy;
    private readonly vehicleStrategy;
    private readonly batchProcessor;
    private readonly logger;
    private readonly strategies;
    constructor(meterStrategy: MeterTelemetryStrategy, vehicleStrategy: VehicleTelemetryStrategy, batchProcessor: BatchProcessorService);
    ingest(streamType: string, payload: unknown): Promise<void>;
    ingestBatch(records: IngestTelemetryDto[]): Promise<IngestionResult>;
    getStats(): {
        meterBufferSize: number;
        vehicleBufferSize: number;
    };
}
