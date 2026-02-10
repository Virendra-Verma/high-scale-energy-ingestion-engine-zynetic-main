import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionController } from './controllers/ingestion.controller';
import { IngestionService, BatchProcessorService } from './services';
import { MeterTelemetryStrategy, VehicleTelemetryStrategy } from './strategies';
import {
  MeterTelemetryHistory,
  VehicleTelemetryHistory,
  MeterLiveState,
  VehicleLiveState,
} from '../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeterTelemetryHistory,
      VehicleTelemetryHistory,
      MeterLiveState,
      VehicleLiveState,
    ]),
  ],
  controllers: [IngestionController],
  providers: [
    IngestionService,
    BatchProcessorService,
    MeterTelemetryStrategy,
    VehicleTelemetryStrategy,
  ],
  exports: [IngestionService, BatchProcessorService],
})
export class IngestionModule {}
