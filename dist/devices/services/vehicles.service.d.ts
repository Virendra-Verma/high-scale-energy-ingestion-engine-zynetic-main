import { Repository } from 'typeorm';
import { Vehicle, VehicleLiveState } from '../../database/entities';
import { CreateVehicleDto, UpdateVehicleDto } from '../dto';
export declare class VehiclesService {
    private readonly vehicleRepo;
    private readonly liveStateRepo;
    constructor(vehicleRepo: Repository<Vehicle>, liveStateRepo: Repository<VehicleLiveState>);
    create(dto: CreateVehicleDto): Promise<Vehicle>;
    findAll(): Promise<Vehicle[]>;
    findOne(vehicleId: string): Promise<Vehicle>;
    update(vehicleId: string, dto: UpdateVehicleDto): Promise<Vehicle>;
    getLiveState(vehicleId: string): Promise<VehicleLiveState | null>;
}
