import { AnalyticsService } from '../services/analytics.service';
import { PerformanceQueryDto, PerformanceSummaryDto } from '../dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getVehiclePerformance(vehicleId: string, query: PerformanceQueryDto): Promise<PerformanceSummaryDto>;
    getRealTimeStatus(vehicleId: string): Promise<{
        vehicleId: string;
        currentSoc: number | null;
        currentBatteryTemp: number | null;
        lastUpdated: Date | null;
        isCharging: boolean;
    }>;
}
