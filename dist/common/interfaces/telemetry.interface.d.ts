export interface BaseTelemetryPayload {
    timestamp: Date;
}
export interface MeterTelemetryPayload extends BaseTelemetryPayload {
    meterId: string;
    kwhConsumedAc: number;
    voltage: number;
}
export interface VehicleTelemetryPayload extends BaseTelemetryPayload {
    vehicleId: string;
    soc: number;
    kwhDeliveredDc: number;
    batteryTemp: number;
}
export type TelemetryPayload = MeterTelemetryPayload | VehicleTelemetryPayload;
export interface IngestionResult {
    success: boolean;
    processed: number;
    failed: number;
    timestamp: Date;
    errors?: string[];
}
export interface PerformanceMetrics {
    totalEnergyConsumedAc: number;
    totalEnergyDeliveredDc: number;
    efficiencyRatio: number | null;
    averageBatteryTemp: number | null;
    chargingSessions: number;
    readingCount: number;
}
export interface HourlyBreakdown {
    hour: Date;
    energyAc: number;
    energyDc: number;
    avgTemp: number | null;
    efficiency: number | null;
}
export interface PerformanceSummary {
    vehicleId: string;
    period: {
        start: Date;
        end: Date;
    };
    metrics: PerformanceMetrics;
    hourlyBreakdown: HourlyBreakdown[];
}
