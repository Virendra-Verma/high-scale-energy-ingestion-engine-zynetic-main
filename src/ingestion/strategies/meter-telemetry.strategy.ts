import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TelemetryStrategy } from './telemetry-strategy.interface';
import { MeterTelemetryPayload } from '../../common/interfaces/telemetry.interface';
import { MeterTelemetryDto } from '../dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MeterTelemetryStrategy implements TelemetryStrategy<MeterTelemetryPayload> {
  constructor(private readonly dataSource: DataSource) {}

  async persistLive(payload: MeterTelemetryPayload): Promise<void> {
    // Atomic UPSERT with conditional update (only if newer timestamp)
    await this.dataSource.query(
      `
      INSERT INTO meter_live_state (meter_id, kwh_consumed_ac, voltage, timestamp, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (meter_id) DO UPDATE SET
        kwh_consumed_ac = EXCLUDED.kwh_consumed_ac,
        voltage = EXCLUDED.voltage,
        timestamp = EXCLUDED.timestamp,
        updated_at = NOW()
      WHERE meter_live_state.timestamp < EXCLUDED.timestamp
      `,
      [payload.meterId, payload.kwhConsumedAc, payload.voltage, payload.timestamp],
    );
  }

  validate(rawPayload: unknown): MeterTelemetryPayload {
    const dto = plainToInstance(MeterTelemetryDto, rawPayload);

    // Basic validation (async validation done at controller level)
    if (!dto.meterId || dto.kwhConsumedAc === undefined || dto.voltage === undefined || !dto.timestamp) {
      throw new BadRequestException('Invalid meter telemetry payload');
    }

    return {
      meterId: dto.meterId,
      kwhConsumedAc: Number(dto.kwhConsumedAc),
      voltage: Number(dto.voltage),
      timestamp: new Date(dto.timestamp),
    };
  }

  getStreamType(): string {
    return 'meter';
  }
}
