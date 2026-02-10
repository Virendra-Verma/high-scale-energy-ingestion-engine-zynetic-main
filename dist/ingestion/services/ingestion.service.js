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
var IngestionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionService = void 0;
const common_1 = require("@nestjs/common");
const meter_telemetry_strategy_1 = require("../strategies/meter-telemetry.strategy");
const vehicle_telemetry_strategy_1 = require("../strategies/vehicle-telemetry.strategy");
const batch_processor_service_1 = require("./batch-processor.service");
let IngestionService = IngestionService_1 = class IngestionService {
    constructor(meterStrategy, vehicleStrategy, batchProcessor) {
        this.meterStrategy = meterStrategy;
        this.vehicleStrategy = vehicleStrategy;
        this.batchProcessor = batchProcessor;
        this.logger = new common_1.Logger(IngestionService_1.name);
        this.strategies = new Map();
        this.strategies.set('meter', this.meterStrategy);
        this.strategies.set('vehicle', this.vehicleStrategy);
    }
    async ingest(streamType, payload) {
        const strategy = this.strategies.get(streamType);
        if (!strategy) {
            throw new common_1.BadRequestException(`Unknown stream type: ${streamType}`);
        }
        const validated = strategy.validate(payload);
        await strategy.persistLive(validated);
        if (streamType === 'meter') {
            await this.batchProcessor.enqueueMeter(validated);
        }
        else {
            await this.batchProcessor.enqueueVehicle(validated);
        }
    }
    async ingestBatch(records) {
        const errors = [];
        let processed = 0;
        let failed = 0;
        const meterRecords = [];
        const vehicleRecords = [];
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            try {
                const strategy = this.strategies.get(record.streamType);
                if (!strategy) {
                    throw new Error(`Unknown stream type: ${record.streamType}`);
                }
                const validated = strategy.validate(record.payload);
                if (record.streamType === 'meter') {
                    meterRecords.push(validated);
                }
                else {
                    vehicleRecords.push(validated);
                }
                processed++;
            }
            catch (error) {
                failed++;
                errors.push(`Record ${i}: ${error.message}`);
            }
        }
        const liveStatePromises = [];
        for (const record of meterRecords) {
            liveStatePromises.push(this.meterStrategy.persistLive(record));
        }
        for (const record of vehicleRecords) {
            liveStatePromises.push(this.vehicleStrategy.persistLive(record));
        }
        const results = await Promise.allSettled(liveStatePromises);
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                this.logger.warn(`Live state update failed: ${result.reason}`);
            }
        });
        for (const record of meterRecords) {
            await this.batchProcessor.enqueueMeter(record);
        }
        for (const record of vehicleRecords) {
            await this.batchProcessor.enqueueVehicle(record);
        }
        return {
            success: failed === 0,
            processed,
            failed,
            timestamp: new Date(),
            errors: errors.length > 0 ? errors : undefined,
        };
    }
    getStats() {
        return this.batchProcessor.getBufferStats();
    }
};
exports.IngestionService = IngestionService;
exports.IngestionService = IngestionService = IngestionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [meter_telemetry_strategy_1.MeterTelemetryStrategy,
        vehicle_telemetry_strategy_1.VehicleTelemetryStrategy,
        batch_processor_service_1.BatchProcessorService])
], IngestionService);
//# sourceMappingURL=ingestion.service.js.map