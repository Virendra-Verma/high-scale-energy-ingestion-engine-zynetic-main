import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { MeterTelemetryHistory, VehicleTelemetryHistory } from '../../database/entities';
import { MeterTelemetryPayload, VehicleTelemetryPayload } from '../../common/interfaces/telemetry.interface';
export declare class BatchProcessorService implements OnModuleInit, OnModuleDestroy {
    private readonly meterHistoryRepo;
    private readonly vehicleHistoryRepo;
    private readonly dataSource;
    private readonly logger;
    private readonly BATCH_SIZE;
    private readonly FLUSH_INTERVAL_MS;
    private meterBuffer;
    private vehicleBuffer;
    private flushTimer;
    private isShuttingDown;
    constructor(meterHistoryRepo: Repository<MeterTelemetryHistory>, vehicleHistoryRepo: Repository<VehicleTelemetryHistory>, dataSource: DataSource);
    onModuleInit(): void;
    onModuleDestroy(): Promise<void>;
    private startFlushTimer;
    enqueueMeter(payload: MeterTelemetryPayload): Promise<void>;
    enqueueVehicle(payload: VehicleTelemetryPayload): Promise<void>;
    flushAll(): Promise<void>;
    private flushMeterBuffer;
    private flushVehicleBuffer;
    getBufferStats(): {
        meterBufferSize: number;
        vehicleBufferSize: number;
    };
}
