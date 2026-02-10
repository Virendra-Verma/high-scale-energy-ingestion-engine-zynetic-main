export class PerformanceMetricsDto {
  totalEnergyConsumedAc: number;
  totalEnergyDeliveredDc: number;
  efficiencyRatio: number | null;
  averageBatteryTemp: number | null;
  chargingSessions: number;
  readingCount: number;
}

export class HourlyBreakdownDto {
  hour: Date;
  energyAc: number;
  energyDc: number;
  avgTemp: number | null;
  efficiency: number | null;
}

export class PerformanceSummaryDto {
  vehicleId: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: PerformanceMetricsDto;
  hourlyBreakdown: HourlyBreakdownDto[];
}
