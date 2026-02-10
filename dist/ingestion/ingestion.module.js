"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ingestion_controller_1 = require("./controllers/ingestion.controller");
const services_1 = require("./services");
const strategies_1 = require("./strategies");
const entities_1 = require("../database/entities");
let IngestionModule = class IngestionModule {
};
exports.IngestionModule = IngestionModule;
exports.IngestionModule = IngestionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                entities_1.MeterTelemetryHistory,
                entities_1.VehicleTelemetryHistory,
                entities_1.MeterLiveState,
                entities_1.VehicleLiveState,
            ]),
        ],
        controllers: [ingestion_controller_1.IngestionController],
        providers: [
            services_1.IngestionService,
            services_1.BatchProcessorService,
            strategies_1.MeterTelemetryStrategy,
            strategies_1.VehicleTelemetryStrategy,
        ],
        exports: [services_1.IngestionService, services_1.BatchProcessorService],
    })
], IngestionModule);
//# sourceMappingURL=ingestion.module.js.map