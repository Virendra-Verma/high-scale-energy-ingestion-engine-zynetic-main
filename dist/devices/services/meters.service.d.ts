import { Repository } from 'typeorm';
import { Meter, MeterLiveState } from '../../database/entities';
import { CreateMeterDto, UpdateMeterDto } from '../dto';
export declare class MetersService {
    private readonly meterRepo;
    private readonly liveStateRepo;
    constructor(meterRepo: Repository<Meter>, liveStateRepo: Repository<MeterLiveState>);
    create(dto: CreateMeterDto): Promise<Meter>;
    findAll(): Promise<Meter[]>;
    findOne(meterId: string): Promise<Meter>;
    update(meterId: string, dto: UpdateMeterDto): Promise<Meter>;
    getLiveState(meterId: string): Promise<MeterLiveState | null>;
}
