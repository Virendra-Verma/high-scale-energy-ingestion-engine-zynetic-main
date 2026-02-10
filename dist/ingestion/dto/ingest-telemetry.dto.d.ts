import { MeterTelemetryDto } from './meter-telemetry.dto';
import { VehicleTelemetryDto } from './vehicle-telemetry.dto';
export declare class IngestTelemetryDto {
    streamType: 'meter' | 'vehicle';
    payload: MeterTelemetryDto | VehicleTelemetryDto;
}
export declare class BatchIngestTelemetryDto {
    records: IngestTelemetryDto[];
}
export declare class IngestionResponseDto {
    success: boolean;
    processed: number;
    failed: number;
    timestamp: Date;
    errors?: string[];
}
