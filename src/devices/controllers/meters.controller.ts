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
import { MetersService } from '../services/meters.service';
import { CreateMeterDto, UpdateMeterDto } from '../dto';

@Controller('v1/devices/meters')
export class MetersController {
  constructor(private readonly metersService: MetersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() dto: CreateMeterDto) {
    return this.metersService.create(dto);
  }

  @Get()
  findAll() {
    return this.metersService.findAll();
  }

  @Get(':meterId')
  findOne(@Param('meterId') meterId: string) {
    return this.metersService.findOne(meterId);
  }

  @Patch(':meterId')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('meterId') meterId: string, @Body() dto: UpdateMeterDto) {
    return this.metersService.update(meterId, dto);
  }

  @Get(':meterId/state')
  getLiveState(@Param('meterId') meterId: string) {
    return this.metersService.getLiveState(meterId);
  }
}
