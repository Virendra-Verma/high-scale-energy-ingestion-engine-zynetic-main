import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IngestionService } from '../services/ingestion.service';
import {
  IngestTelemetryDto,
  BatchIngestTelemetryDto,
  IngestionResponseDto,
} from '../dto';

@Controller('v1/telemetry')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  /**
   * Ingest a single telemetry record
   * POST /v1/telemetry/ingest
   */
  @Post('ingest')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async ingest(@Body() dto: IngestTelemetryDto): Promise<IngestionResponseDto> {
    await this.ingestionService.ingest(dto.streamType, dto.payload);

    return {
      success: true,
      processed: 1,
      failed: 0,
      timestamp: new Date(),
    };
  }

  /**
   * Ingest a batch of telemetry records
   * POST /v1/telemetry/ingest/batch
   */
  @Post('ingest/batch')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async ingestBatch(@Body() dto: BatchIngestTelemetryDto): Promise<IngestionResponseDto> {
    const result = await this.ingestionService.ingestBatch(dto.records);

    return {
      success: result.success,
      processed: result.processed,
      failed: result.failed,
      timestamp: result.timestamp,
      errors: result.errors,
    };
  }

  /**
   * Get ingestion buffer stats
   * GET /v1/telemetry/stats
   */
  @Get('stats')
  getStats() {
    return this.ingestionService.getStats();
  }
}
