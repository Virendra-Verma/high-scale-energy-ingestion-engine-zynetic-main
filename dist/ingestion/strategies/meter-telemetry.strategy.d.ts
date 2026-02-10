import { DataSource } from 'typeorm';
import { TelemetryStrategy } from './telemetry-strategy.interface';
import { MeterTelemetryPayload } from '../../common/interfaces/telemetry.interface';
export declare class MeterTelemetryStrategy implements TelemetryStrategy<MeterTelemetryPayload> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    persistLive(payload: MeterTelemetryPayload): Promise<void>;
    validate(rawPayload: unknown): MeterTelemetryPayload;
    getStreamType(): string;
}
