import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle, VehicleLiveState } from '../../database/entities';
import { CreateVehicleDto, UpdateVehicleDto } from '../dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    @InjectRepository(VehicleLiveState)
    private readonly liveStateRepo: Repository<VehicleLiveState>,
  ) {}

  async create(dto: CreateVehicleDto): Promise<Vehicle> {
    const existing = await this.vehicleRepo.findOne({
      where: { vehicleId: dto.vehicleId },
    });

    if (existing) {
      throw new ConflictException(`Vehicle ${dto.vehicleId} already exists`);
    }

    const vehicle = this.vehicleRepo.create({
      vehicleId: dto.vehicleId,
      vin: dto.vin,
      batteryCapacityKwh: dto.batteryCapacityKwh,
      model: dto.model,
      metadata: dto.metadata || {},
    });

    return this.vehicleRepo.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(vehicleId: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findOne({
      where: { vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle ${vehicleId} not found`);
    }

    return vehicle;
  }

  async update(vehicleId: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.findOne(vehicleId);

    Object.assign(vehicle, dto);
    return this.vehicleRepo.save(vehicle);
  }

  async getLiveState(vehicleId: string): Promise<VehicleLiveState | null> {
    await this.findOne(vehicleId); // Verify vehicle exists

    return this.liveStateRepo.findOne({
      where: { vehicleId },
    });
  }
}
