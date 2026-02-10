import { VehiclesService } from '../services/vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto } from '../dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(dto: CreateVehicleDto): Promise<import("../../database/entities").Vehicle>;
    findAll(): Promise<import("../../database/entities").Vehicle[]>;
    findOne(vehicleId: string): Promise<import("../../database/entities").Vehicle>;
    update(vehicleId: string, dto: UpdateVehicleDto): Promise<import("../../database/entities").Vehicle>;
    getLiveState(vehicleId: string): Promise<import("../../database/entities").VehicleLiveState>;
}
