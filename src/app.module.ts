/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { IngestionModule } from './ingestion/ingestion.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DevicesModule } from './devices/devices.module';
import { SessionsModule } from './sessions/sessions.module';
import { HealthModule } from './health/health.module';

// Helper function ko upar hi define kar dete hain
export const getDatabaseConfig = (): any => ({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123',
  database: 'energy_ingestion',
  entities: [],
  synchronize: false,
  logging: true,
  extra: {
    max: 20,
    min: 5,
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useFactory: (configService: ConfigService) => getDatabaseConfig(),
    }),
    ScheduleModule.forRoot(),
    IngestionModule,
    AnalyticsModule,
    DevicesModule,
    SessionsModule,
    HealthModule,
  ],
})
// eslint-disable-next-line prettier/prettier
export class AppModule {}