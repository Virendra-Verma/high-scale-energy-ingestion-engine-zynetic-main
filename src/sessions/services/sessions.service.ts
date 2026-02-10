import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ChargingSession, Meter, Vehicle } from '../../database/entities';
import { CreateSessionDto } from '../dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(ChargingSession)
    private readonly sessionRepo: Repository<ChargingSession>,
    @InjectRepository(Meter)
    private readonly meterRepo: Repository<Meter>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    private readonly dataSource: DataSource,
  ) {}

  async startSession(dto: CreateSessionDto): Promise<ChargingSession> {
    // Verify meter exists
    const meter = await this.meterRepo.findOne({
      where: { meterId: dto.meterId },
    });
    if (!meter) {
      throw new NotFoundException(`Meter ${dto.meterId} not found`);
    }

    // Verify vehicle exists
    const vehicle = await this.vehicleRepo.findOne({
      where: { vehicleId: dto.vehicleId },
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle ${dto.vehicleId} not found`);
    }

    // Check if meter already has an active session
    const activeMeterSession = await this.sessionRepo.findOne({
      where: { meterId: dto.meterId, isActive: true },
    });
    if (activeMeterSession) {
      throw new ConflictException(
        `Meter ${dto.meterId} already has an active session`,
      );
    }

    // Check if vehicle already has an active session
    const activeVehicleSession = await this.sessionRepo.findOne({
      where: { vehicleId: dto.vehicleId, isActive: true },
    });
    if (activeVehicleSession) {
      throw new ConflictException(
        `Vehicle ${dto.vehicleId} already has an active session`,
      );
    }

    const session = this.sessionRepo.create({
      meterId: dto.meterId,
      vehicleId: dto.vehicleId,
      startedAt: new Date(),
      isActive: true,
    });

    return this.sessionRepo.save(session);
  }

  async endSession(sessionId: string): Promise<ChargingSession> {
    const session = await this.sessionRepo.findOne({
      where: { sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    if (!session.isActive) {
      throw new BadRequestException(`Session ${sessionId} is already ended`);
    }

    session.isActive = false;
    session.endedAt = new Date();

    return this.sessionRepo.save(session);
  }

  async findActive(): Promise<ChargingSession[]> {
    return this.sessionRepo.find({
      where: { isActive: true },
      order: { startedAt: 'DESC' },
    });
  }

  async findOne(sessionId: string): Promise<ChargingSession> {
    const session = await this.sessionRepo.findOne({
      where: { sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    return session;
  }

  async findByVehicle(vehicleId: string): Promise<ChargingSession[]> {
    return this.sessionRepo.find({
      where: { vehicleId },
      order: { startedAt: 'DESC' },
    });
  }

  async findByMeter(meterId: string): Promise<ChargingSession[]> {
    return this.sessionRepo.find({
      where: { meterId },
      order: { startedAt: 'DESC' },
    });
  }
}
