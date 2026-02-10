export declare class CreateMeterDto {
    meterId: string;
    location?: string;
    capacityKw?: number;
    metadata?: Record<string, any>;
}
export declare class UpdateMeterDto {
    location?: string;
    capacityKw?: number;
    isActive?: boolean;
    metadata?: Record<string, any>;
}
