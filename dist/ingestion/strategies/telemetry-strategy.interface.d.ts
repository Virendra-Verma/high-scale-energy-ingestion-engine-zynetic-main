export interface TelemetryStrategy<T> {
    persistLive(payload: T): Promise<void>;
    validate(rawPayload: unknown): T;
    getStreamType(): string;
}
export declare const METER_STRATEGY = "METER_STRATEGY";
export declare const VEHICLE_STRATEGY = "VEHICLE_STRATEGY";
