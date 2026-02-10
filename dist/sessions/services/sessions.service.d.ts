import { Repository, DataSource } from 'typeorm';
import { ChargingSession, Meter, Vehicle } from '../../database/entities';
import { CreateSessionDto } from '../dto';
export declare class SessionsService {
    private readonly sessionRepo;
    private readonly meterRepo;
    private readonly vehicleRepo;
    private readonly dataSource;
    constructor(sessionRepo: Repository<ChargingSession>, meterRepo: Repository<Meter>, vehicleRepo: Repository<Vehicle>, dataSource: DataSource);
    startSession(dto: CreateSessionDto): Promise<ChargingSession>;
    endSession(sessionId: string): Promise<ChargingSession>;
    findActive(): Promise<ChargingSession[]>;
    findOne(sessionId: string): Promise<ChargingSession>;
    findByVehicle(vehicleId: string): Promise<ChargingSession[]>;
    findByMeter(meterId: string): Promise<ChargingSession[]>;
}
