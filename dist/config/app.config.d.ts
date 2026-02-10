export interface AppConfig {
    port: number;
    nodeEnv: string;
    batchSize: number;
    flushIntervalMs: number;
    viewRefreshIntervalMinutes: number;
}
export declare const getAppConfig: () => AppConfig;
