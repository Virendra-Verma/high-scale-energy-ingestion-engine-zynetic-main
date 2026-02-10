import { DataSource } from 'typeorm';
import { TelemetryStrategy } from './telemetry-strategy.interface';
import { VehicleTelemetryPayload } from '../../common/interfaces/telemetry.interface';
export declare class VehicleTelemetryStrategy implements TelemetryStrategy<VehicleTelemetryPayload> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    persistLive(payload: VehicleTelemetryPayload): Promise<void>;
    validate(rawPayload: unknown): VehicleTelemetryPayload;
    getStreamType(): string;
}
