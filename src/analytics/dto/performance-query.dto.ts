import { IsOptional, IsDateString } from 'class-validator';

export class PerformanceQueryDto {
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;
}
