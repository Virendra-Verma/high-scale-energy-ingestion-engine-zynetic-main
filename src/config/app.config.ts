export interface AppConfig {
  port: number;
  nodeEnv: string;
  batchSize: number;
  flushIntervalMs: number;
  viewRefreshIntervalMinutes: number;
}

export const getAppConfig = (): AppConfig => ({
  port: parseInt(process.env.APP_PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  batchSize: parseInt(process.env.BATCH_SIZE ?? '1000', 10),
  flushIntervalMs: parseInt(process.env.FLUSH_INTERVAL_MS ?? '5000', 10),
  viewRefreshIntervalMinutes: parseInt(
    process.env.VIEW_REFRESH_INTERVAL_MINUTES ?? '5',
    10,
  ),
});
