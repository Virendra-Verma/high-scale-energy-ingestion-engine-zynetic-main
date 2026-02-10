import { MetersService } from '../services/meters.service';
import { CreateMeterDto, UpdateMeterDto } from '../dto';
export declare class MetersController {
    private readonly metersService;
    constructor(metersService: MetersService);
    create(dto: CreateMeterDto): Promise<import("../../database/entities").Meter>;
    findAll(): Promise<import("../../database/entities").Meter[]>;
    findOne(meterId: string): Promise<import("../../database/entities").Meter>;
    update(meterId: string, dto: UpdateMeterDto): Promise<import("../../database/entities").Meter>;
    getLiveState(meterId: string): Promise<import("../../database/entities").MeterLiveState>;
}
