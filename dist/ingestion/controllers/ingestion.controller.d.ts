import { IngestionService } from '../services/ingestion.service';
import { IngestTelemetryDto, BatchIngestTelemetryDto, IngestionResponseDto } from '../dto';
export declare class IngestionController {
    private readonly ingestionService;
    constructor(ingestionService: IngestionService);
    ingest(dto: IngestTelemetryDto): Promise<IngestionResponseDto>;
    ingestBatch(dto: BatchIngestTelemetryDto): Promise<IngestionResponseDto>;
    getStats(): {
        meterBufferSize: number;
        vehicleBufferSize: number;
    };
}
