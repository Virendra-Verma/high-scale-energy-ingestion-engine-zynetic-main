import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TelemetryStrategy } from './telemetry-strategy.interface';
import { VehicleTelemetryPayload } from '../../common/interfaces/telemetry.interface';
import { VehicleTelemetryDto } from '../dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class VehicleTelemetryStrategy implements TelemetryStrategy<VehicleTelemetryPayload> {
  constructor(private readonly dataSource: DataSource) {}

  async persistLive(payload: VehicleTelemetryPayload): Promise<void> {
    // Atomic UPSERT with conditional update (only if newer timestamp)
    await this.dataSource.query(
      `
      INSERT INTO vehicle_live_state (vehicle_id, soc, kwh_delivered_dc, battery_temp, timestamp, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (vehicle_id) DO UPDATE SET
        soc = EXCLUDED.soc,
        kwh_delivered_dc = EXCLUDED.kwh_delivered_dc,
        battery_temp = EXCLUDED.battery_temp,
        timestamp = EXCLUDED.timestamp,
        updated_at = NOW()
      WHERE vehicle_live_state.timestamp < EXCLUDED.timestamp
      `,
      [
        payload.vehicleId,
        payload.soc,
        payload.kwhDeliveredDc,
        payload.batteryTemp,
        payload.timestamp,
      ],
    );
  }

  validate(rawPayload: unknown): VehicleTelemetryPayload {
    const dto = plainToInstance(VehicleTelemetryDto, rawPayload);

    if (
      !dto.vehicleId ||
      dto.soc === undefined ||
      dto.kwhDeliveredDc === undefined ||
      dto.batteryTemp === undefined ||
      !dto.timestamp
    ) {
      throw new BadRequestException('Invalid vehicle telemetry payload');
    }

    return {
      vehicleId: dto.vehicleId,
      soc: Number(dto.soc),
      kwhDeliveredDc: Number(dto.kwhDeliveredDc),
      batteryTemp: Number(dto.batteryTemp),
      timestamp: new Date(dto.timestamp),
    };
  }

  getStreamType(): string {
    return 'vehicle';
  }
}
