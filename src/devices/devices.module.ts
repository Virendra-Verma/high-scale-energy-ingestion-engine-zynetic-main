import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetersController } from './controllers/meters.controller';
import { VehiclesController } from './controllers/vehicles.controller';
import { MetersService } from './services/meters.service';
import { VehiclesService } from './services/vehicles.service';
import {
  Meter,
  Vehicle,
  MeterLiveState,
  VehicleLiveState,
} from '../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meter, Vehicle, MeterLiveState, VehicleLiveState]),
  ],
  controllers: [MetersController, VehiclesController],
  providers: [MetersService, VehiclesService],
  exports: [MetersService, VehiclesService],
})
export class DevicesModule {}
