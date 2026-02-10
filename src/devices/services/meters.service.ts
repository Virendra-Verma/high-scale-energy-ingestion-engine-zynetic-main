import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meter, MeterLiveState } from '../../database/entities';
import { CreateMeterDto, UpdateMeterDto } from '../dto';

@Injectable()
export class MetersService {
  constructor(
    @InjectRepository(Meter)
    private readonly meterRepo: Repository<Meter>,
    @InjectRepository(MeterLiveState)
    private readonly liveStateRepo: Repository<MeterLiveState>,
  ) {}

  async create(dto: CreateMeterDto): Promise<Meter> {
    const existing = await this.meterRepo.findOne({
      where: { meterId: dto.meterId },
    });

    if (existing) {
      throw new ConflictException(`Meter ${dto.meterId} already exists`);
    }

    const meter = this.meterRepo.create({
      meterId: dto.meterId,
      location: dto.location,
      capacityKw: dto.capacityKw,
      metadata: dto.metadata || {},
    });

    return this.meterRepo.save(meter);
  }

  async findAll(): Promise<Meter[]> {
    return this.meterRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(meterId: string): Promise<Meter> {
    const meter = await this.meterRepo.findOne({
      where: { meterId },
    });

    if (!meter) {
      throw new NotFoundException(`Meter ${meterId} not found`);
    }

    return meter;
  }

  async update(meterId: string, dto: UpdateMeterDto): Promise<Meter> {
    const meter = await this.findOne(meterId);

    Object.assign(meter, dto);
    return this.meterRepo.save(meter);
  }

  async getLiveState(meterId: string): Promise<MeterLiveState | null> {
    await this.findOne(meterId); // Verify meter exists

    return this.liveStateRepo.findOne({
      where: { meterId },
    });
  }
}
