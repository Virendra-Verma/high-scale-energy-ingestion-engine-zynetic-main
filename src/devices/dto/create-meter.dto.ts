import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMeterDto {
  @IsString()
  meterId: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  capacityKw?: number;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateMeterDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  capacityKw?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  metadata?: Record<string, any>;
}
