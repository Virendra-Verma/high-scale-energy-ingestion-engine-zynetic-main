import {
  IsString,
  IsNumber,
  IsDateString,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class MeterTelemetryDto {
  @IsString()
  @IsNotEmpty()
  meterId: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  kwhConsumedAc: number;

  @IsNumber()
  @Min(0)
  @Max(500)
  @Type(() => Number)
  voltage: number;

  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  timestamp: string;
}
