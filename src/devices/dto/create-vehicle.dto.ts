import { IsString, IsOptional, IsNumber, IsBoolean, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVehicleDto {
  @IsString()
  vehicleId: string;

  @IsOptional()
  @IsString()
  @MaxLength(17)
  vin?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  batteryCapacityKwh?: number;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  @MaxLength(17)
  vin?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  batteryCapacityKwh?: number;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  metadata?: Record<string, any>;
}
