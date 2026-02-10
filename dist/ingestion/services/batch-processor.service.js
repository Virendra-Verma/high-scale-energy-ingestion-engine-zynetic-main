"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BatchProcessorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchProcessorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../database/entities");
const app_config_1 = require("../../config/app.config");
let BatchProcessorService = BatchProcessorService_1 = class BatchProcessorService {
    constructor(meterHistoryRepo, vehicleHistoryRepo, dataSource) {
        this.meterHistoryRepo = meterHistoryRepo;
        this.vehicleHistoryRepo = vehicleHistoryRepo;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(BatchProcessorService_1.name);
        this.meterBuffer = [];
        this.vehicleBuffer = [];
        this.flushTimer = null;
        this.isShuttingDown = false;
        const config = (0, app_config_1.getAppConfig)();
        this.BATCH_SIZE = config.batchSize;
        this.FLUSH_INTERVAL_MS = config.flushIntervalMs;
    }
    onModuleInit() {
        this.startFlushTimer();
        this.logger.log(`Batch processor initialized (batch_size=${this.BATCH_SIZE}, flush_interval=${this.FLUSH_INTERVAL_MS}ms)`);
    }
    async onModuleDestroy() {
        this.isShuttingDown = true;
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        await this.flushAll();
        this.logger.log('Batch processor shutdown complete');
    }
    startFlushTimer() {
        this.flushTimer = setInterval(async () => {
            if (!this.isShuttingDown) {
                await this.flushAll();
            }
        }, this.FLUSH_INTERVAL_MS);
    }
    async enqueueMeter(payload) {
        this.meterBuffer.push(payload);
        if (this.meterBuffer.length >= this.BATCH_SIZE) {
            await this.flushMeterBuffer();
        }
    }
    async enqueueVehicle(payload) {
        this.vehicleBuffer.push(payload);
        if (this.vehicleBuffer.length >= this.BATCH_SIZE) {
            await this.flushVehicleBuffer();
        }
    }
    async flushAll() {
        await Promise.all([this.flushMeterBuffer(), this.flushVehicleBuffer()]);
    }
    async flushMeterBuffer() {
        if (this.meterBuffer.length === 0)
            return;
        const toInsert = [...this.meterBuffer];
        this.meterBuffer = [];
        try {
            await this.meterHistoryRepo
                .createQueryBuilder()
                .insert()
                .into(entities_1.MeterTelemetryHistory)
                .values(toInsert.map((p) => ({
                meterId: p.meterId,
                kwhConsumedAc: p.kwhConsumedAc,
                voltage: p.voltage,
                timestamp: p.timestamp,
                ingestedAt: new Date(),
            })))
                .execute();
            this.logger.debug(`Flushed ${toInsert.length} meter records to history`);
        }
        catch (error) {
            this.logger.error(`Failed to flush meter buffer: ${error.message}`);
            this.meterBuffer = [...toInsert, ...this.meterBuffer];
            throw error;
        }
    }
    async flushVehicleBuffer() {
        if (this.vehicleBuffer.length === 0)
            return;
        const toInsert = [...this.vehicleBuffer];
        this.vehicleBuffer = [];
        try {
            await this.vehicleHistoryRepo
                .createQueryBuilder()
                .insert()
                .into(entities_1.VehicleTelemetryHistory)
                .values(toInsert.map((p) => ({
                vehicleId: p.vehicleId,
                soc: p.soc,
                kwhDeliveredDc: p.kwhDeliveredDc,
                batteryTemp: p.batteryTemp,
                timestamp: p.timestamp,
                ingestedAt: new Date(),
            })))
                .execute();
            this.logger.debug(`Flushed ${toInsert.length} vehicle records to history`);
        }
        catch (error) {
            this.logger.error(`Failed to flush vehicle buffer: ${error.message}`);
            this.vehicleBuffer = [...toInsert, ...this.vehicleBuffer];
            throw error;
        }
    }
    getBufferStats() {
        return {
            meterBufferSize: this.meterBuffer.length,
            vehicleBufferSize: this.vehicleBuffer.length,
        };
    }
};
exports.BatchProcessorService = BatchProcessorService;
exports.BatchProcessorService = BatchProcessorService = BatchProcessorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.MeterTelemetryHistory)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.VehicleTelemetryHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], BatchProcessorService);
//# sourceMappingURL=batch-processor.service.js.map