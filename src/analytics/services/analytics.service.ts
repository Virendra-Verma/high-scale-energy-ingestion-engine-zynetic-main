import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  PerformanceSummary,
  HourlyBreakdown,
} from '../../common/interfaces/telemetry.interface';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Get 24-hour performance summary for a vehicle
   * Uses optimized queries with proper indexes to avoid full table scans
   */
  async getVehiclePerformance(
    vehicleId: string,
    startTime?: Date,
    endTime?: Date,
  ): Promise<PerformanceSummary> {
    // Default to last 24 hours
    const end = endTime || new Date();
    const start = startTime || new Date(end.getTime() - 24 * 60 * 60 * 1000);

    // Verify vehicle exists
    const vehicle = await this.dataSource.query(
      `SELECT vehicle_id FROM vehicles WHERE vehicle_id = $1`,
      [vehicleId],
    );

    if (vehicle.length === 0) {
      throw new NotFoundException(`Vehicle ${vehicleId} not found`);
    }

    // Get hourly aggregated data from vehicle telemetry history
    // Uses index on (vehicle_id, timestamp DESC) for efficient query
    const vehicleHourlyData = await this.dataSource.query(
      `
      SELECT
        DATE_TRUNC('hour', timestamp) AS hour_bucket,
        AVG(battery_temp) AS avg_battery_temp,
        MAX(kwh_delivered_dc) - MIN(kwh_delivered_dc) AS kwh_delivered_delta,
        MIN(soc) AS min_soc,
        MAX(soc) AS max_soc,
        COUNT(*) AS reading_count
      FROM vehicle_telemetry_history
      WHERE vehicle_id = $1
        AND timestamp >= $2
        AND timestamp < $3
      GROUP BY DATE_TRUNC('hour', timestamp)
      ORDER BY hour_bucket
      `,
      [vehicleId, start, end],
    );

    // Get associated meter data through charging sessions
    // This correlates meter readings with vehicle during active sessions
    const meterHourlyData = await this.dataSource.query(
      `
      SELECT
        DATE_TRUNC('hour', mth.timestamp) AS hour_bucket,
        SUM(GREATEST(0, mth.kwh_consumed_ac - LAG(mth.kwh_consumed_ac) OVER (
          PARTITION BY mth.meter_id ORDER BY mth.timestamp
        ))) AS kwh_consumed_delta,
        AVG(mth.voltage) AS avg_voltage
      FROM meter_telemetry_history mth
      INNER JOIN charging_sessions cs ON cs.meter_id = mth.meter_id
      WHERE cs.vehicle_id = $1
        AND cs.started_at <= $3
        AND (cs.ended_at IS NULL OR cs.ended_at >= $2)
        AND mth.timestamp >= $2
        AND mth.timestamp < $3
        AND mth.timestamp >= cs.started_at
        AND (cs.ended_at IS NULL OR mth.timestamp <= cs.ended_at)
      GROUP BY DATE_TRUNC('hour', mth.timestamp)
      ORDER BY hour_bucket
      `,
      [vehicleId, start, end],
    );

    // Get session count
    const sessionData = await this.dataSource.query(
      `
      SELECT COUNT(DISTINCT session_id) AS session_count
      FROM charging_sessions
      WHERE vehicle_id = $1
        AND started_at <= $2
        AND (ended_at IS NULL OR ended_at >= $3)
      `,
      [vehicleId, end, start],
    );

    // Merge and calculate metrics
    const meterByHour = new Map<string, any>(
      meterHourlyData.map((row: any) => [
        new Date(row.hour_bucket).toISOString(),
        row,
      ]),
    );

    const hourlyBreakdown: HourlyBreakdown[] = vehicleHourlyData.map((vRow: any) => {
      const hourKey = new Date(vRow.hour_bucket).toISOString();
      const mRow: any = meterByHour.get(hourKey);

      const energyDc = parseFloat(vRow.kwh_delivered_delta) || 0;
      const energyAc = mRow ? parseFloat(mRow.kwh_consumed_delta) || 0 : 0;

      return {
        hour: new Date(vRow.hour_bucket),
        energyAc,
        energyDc,
        avgTemp: vRow.avg_battery_temp ? parseFloat(vRow.avg_battery_temp) : null,
        efficiency: energyAc > 0 ? energyDc / energyAc : null,
      };
    });

    // Calculate totals
    const totals = hourlyBreakdown.reduce(
      (acc, row) => ({
        totalEnergyAc: acc.totalEnergyAc + row.energyAc,
        totalEnergyDc: acc.totalEnergyDc + row.energyDc,
        tempSum: acc.tempSum + (row.avgTemp || 0),
        tempCount: acc.tempCount + (row.avgTemp !== null ? 1 : 0),
        readingCount: acc.readingCount + 1,
      }),
      { totalEnergyAc: 0, totalEnergyDc: 0, tempSum: 0, tempCount: 0, readingCount: 0 },
    );

    return {
      vehicleId,
      period: { start, end },
      metrics: {
        totalEnergyConsumedAc: Math.round(totals.totalEnergyAc * 1000) / 1000,
        totalEnergyDeliveredDc: Math.round(totals.totalEnergyDc * 1000) / 1000,
        efficiencyRatio:
          totals.totalEnergyAc > 0
            ? Math.round((totals.totalEnergyDc / totals.totalEnergyAc) * 1000) / 1000
            : null,
        averageBatteryTemp:
          totals.tempCount > 0
            ? Math.round((totals.tempSum / totals.tempCount) * 10) / 10
            : null,
        chargingSessions: parseInt(sessionData[0]?.session_count) || 0,
        readingCount: totals.readingCount,
      },
      hourlyBreakdown,
    };
  }

  /**
   * Get real-time efficiency calculation for active charging session
   */
  async getRealTimeEfficiency(vehicleId: string): Promise<{
    vehicleId: string;
    currentSoc: number | null;
    currentBatteryTemp: number | null;
    lastUpdated: Date | null;
    isCharging: boolean;
  }> {
    const liveState = await this.dataSource.query(
      `
      SELECT
        vls.soc,
        vls.battery_temp,
        vls.timestamp,
        EXISTS(
          SELECT 1 FROM charging_sessions cs
          WHERE cs.vehicle_id = vls.vehicle_id AND cs.is_active = TRUE
        ) AS is_charging
      FROM vehicle_live_state vls
      WHERE vls.vehicle_id = $1
      `,
      [vehicleId],
    );

    if (liveState.length === 0) {
      return {
        vehicleId,
        currentSoc: null,
        currentBatteryTemp: null,
        lastUpdated: null,
        isCharging: false,
      };
    }

    return {
      vehicleId,
      currentSoc: parseFloat(liveState[0].soc),
      currentBatteryTemp: parseFloat(liveState[0].battery_temp),
      lastUpdated: new Date(liveState[0].timestamp),
      isCharging: liveState[0].is_charging,
    };
  }
}
