import { DataSource } from 'typeorm';
import { PerformanceSummary } from '../../common/interfaces/telemetry.interface';
export declare class AnalyticsService {
    private readonly dataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    getVehiclePerformance(vehicleId: string, startTime?: Date, endTime?: Date): Promise<PerformanceSummary>;
    getRealTimeEfficiency(vehicleId: string): Promise<{
        vehicleId: string;
        currentSoc: number | null;
        currentBatteryTemp: number | null;
        lastUpdated: Date | null;
        isCharging: boolean;
    }>;
}
