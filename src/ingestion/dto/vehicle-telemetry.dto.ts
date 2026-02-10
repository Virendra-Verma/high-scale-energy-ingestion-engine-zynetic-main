import {
  IsString,
  IsNumber,
  IsDateString,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class VehicleTelemetryDto {
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  soc: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  kwhDeliveredDc: number;

  @IsNumber()
  @Min(-50)
  @Max(100)
  @Type(() => Number)
  batteryTemp: number;

  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  timestamp: string;
}
