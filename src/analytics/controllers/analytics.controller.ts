import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';
import { PerformanceQueryDto, PerformanceSummaryDto } from '../dto';

@Controller('v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Get 24-hour performance summary for a vehicle
   * GET /v1/analytics/performance/:vehicleId
   *
   * Returns:
   * - Total energy consumed (AC) vs delivered (DC)
   * - Efficiency Ratio (DC/AC)
   * - Average battery temperature
   * - Hourly breakdown
   */
  @Get('performance/:vehicleId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getVehiclePerformance(
    @Param('vehicleId') vehicleId: string,
    @Query() query: PerformanceQueryDto,
  ): Promise<PerformanceSummaryDto> {
    const startTime = query.startTime ? new Date(query.startTime) : undefined;
    const endTime = query.endTime ? new Date(query.endTime) : undefined;

    return this.analyticsService.getVehiclePerformance(
      vehicleId,
      startTime,
      endTime,
    );
  }

  /**
   * Get real-time status for a vehicle
   * GET /v1/analytics/realtime/:vehicleId
   */
  @Get('realtime/:vehicleId')
  async getRealTimeStatus(@Param('vehicleId') vehicleId: string) {
    return this.analyticsService.getRealTimeEfficiency(vehicleId);
  }
}
