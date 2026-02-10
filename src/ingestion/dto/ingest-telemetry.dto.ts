import {
  IsString,
  IsIn,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MeterTelemetryDto } from './meter-telemetry.dto';
import { VehicleTelemetryDto } from './vehicle-telemetry.dto';

export class IngestTelemetryDto {
  @IsString()
  @IsIn(['meter', 'vehicle'])
  streamType: 'meter' | 'vehicle';

  @IsObject()
  payload: MeterTelemetryDto | VehicleTelemetryDto;
}

export class BatchIngestTelemetryDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IngestTelemetryDto)
  records: IngestTelemetryDto[];
}

export class IngestionResponseDto {
  success: boolean;
  processed: number;
  failed: number;
  timestamp: Date;
  errors?: string[];
}
