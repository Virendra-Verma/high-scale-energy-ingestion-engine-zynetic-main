import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { VehiclesService } from '../services/vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto } from '../dto';

@Controller('v1/devices/vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(dto);
  }

  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':vehicleId')
  findOne(@Param('vehicleId') vehicleId: string) {
    return this.vehiclesService.findOne(vehicleId);
  }

  @Patch(':vehicleId')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('vehicleId') vehicleId: string, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(vehicleId, dto);
  }

  @Get(':vehicleId/state')
  getLiveState(@Param('vehicleId') vehicleId: string) {
    return this.vehiclesService.getLiveState(vehicleId);
  }
}
