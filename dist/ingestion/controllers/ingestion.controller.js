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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionController = void 0;
const common_1 = require("@nestjs/common");
const ingestion_service_1 = require("../services/ingestion.service");
const dto_1 = require("../dto");
let IngestionController = class IngestionController {
    constructor(ingestionService) {
        this.ingestionService = ingestionService;
    }
    async ingest(dto) {
        await this.ingestionService.ingest(dto.streamType, dto.payload);
        return {
            success: true,
            processed: 1,
            failed: 0,
            timestamp: new Date(),
        };
    }
    async ingestBatch(dto) {
        const result = await this.ingestionService.ingestBatch(dto.records);
        return {
            success: result.success,
            processed: result.processed,
            failed: result.failed,
            timestamp: result.timestamp,
            errors: result.errors,
        };
    }
    getStats() {
        return this.ingestionService.getStats();
    }
};
exports.IngestionController = IngestionController;
__decorate([
    (0, common_1.Post)('ingest'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.IngestTelemetryDto]),
    __metadata("design:returntype", Promise)
], IngestionController.prototype, "ingest", null);
__decorate([
    (0, common_1.Post)('ingest/batch'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BatchIngestTelemetryDto]),
    __metadata("design:returntype", Promise)
], IngestionController.prototype, "ingestBatch", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IngestionController.prototype, "getStats", null);
exports.IngestionController = IngestionController = __decorate([
    (0, common_1.Controller)('v1/telemetry'),
    __metadata("design:paramtypes", [ingestion_service_1.IngestionService])
], IngestionController);
//# sourceMappingURL=ingestion.controller.js.map