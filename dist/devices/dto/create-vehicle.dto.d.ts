export declare class CreateVehicleDto {
    vehicleId: string;
    vin?: string;
    batteryCapacityKwh?: number;
    model?: string;
    metadata?: Record<string, any>;
}
export declare class UpdateVehicleDto {
    vin?: string;
    batteryCapacityKwh?: number;
    model?: string;
    isActive?: boolean;
    metadata?: Record<string, any>;
}
