import { MeterTelemetryPayload, VehicleTelemetryPayload } from '../../common/interfaces/telemetry.interface';

export interface TelemetryStrategy<T> {
  /**
   * Persist to hot store (live state) using UPSERT
   * Updates only if timestamp is newer than existing record
   */
  persistLive(payload: T): Promise<void>;

  /**
   * Validate and transform raw payload to typed payload
   */
  validate(rawPayload: unknown): T;

  /**
   * Get the stream type identifier
   */
  getStreamType(): string;
}

export const METER_STRATEGY = 'METER_STRATEGY';
export const VEHICLE_STRATEGY = 'VEHICLE_STRATEGY';
