import { SessionsService } from '../services/sessions.service';
import { CreateSessionDto } from '../dto';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    startSession(dto: CreateSessionDto): Promise<import("../../database/entities").ChargingSession>;
    endSession(sessionId: string): Promise<import("../../database/entities").ChargingSession>;
    findActive(): Promise<import("../../database/entities").ChargingSession[]>;
    findOne(sessionId: string): Promise<import("../../database/entities").ChargingSession>;
}
