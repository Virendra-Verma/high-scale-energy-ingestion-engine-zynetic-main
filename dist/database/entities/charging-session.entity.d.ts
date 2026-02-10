import { Meter } from './meter.entity';
import { Vehicle } from './vehicle.entity';
export declare class ChargingSession {
    sessionId: string;
    meterId: string;
    vehicleId: string;
    startedAt: Date;
    endedAt: Date | null;
    isActive: boolean;
    createdAt: Date;
    meter: Meter;
    vehicle: Vehicle;
}
