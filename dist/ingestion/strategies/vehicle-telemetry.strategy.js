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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleTelemetryStrategy = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const dto_1 = require("../dto");
const class_transformer_1 = require("class-transformer");
let VehicleTelemetryStrategy = class VehicleTelemetryStrategy {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async persistLive(payload) {
        await this.dataSource.query(`
      INSERT INTO vehicle_live_state (vehicle_id, soc, kwh_delivered_dc, battery_temp, timestamp, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (vehicle_id) DO UPDATE SET
        soc = EXCLUDED.soc,
        kwh_delivered_dc = EXCLUDED.kwh_delivered_dc,
        battery_temp = EXCLUDED.battery_temp,
        timestamp = EXCLUDED.timestamp,
        updated_at = NOW()
      WHERE vehicle_live_state.timestamp < EXCLUDED.timestamp
      `, [
            payload.vehicleId,
            payload.soc,
            payload.kwhDeliveredDc,
            payload.batteryTemp,
            payload.timestamp,
        ]);
    }
    validate(rawPayload) {
        const dto = (0, class_transformer_1.plainToInstance)(dto_1.VehicleTelemetryDto, rawPayload);
        if (!dto.vehicleId ||
            dto.soc === undefined ||
            dto.kwhDeliveredDc === undefined ||
            dto.batteryTemp === undefined ||
            !dto.timestamp) {
            throw new common_1.BadRequestException('Invalid vehicle telemetry payload');
        }
        return {
            vehicleId: dto.vehicleId,
            soc: Number(dto.soc),
            kwhDeliveredDc: Number(dto.kwhDeliveredDc),
            batteryTemp: Number(dto.batteryTemp),
            timestamp: new Date(dto.timestamp),
        };
    }
    getStreamType() {
        return 'vehicle';
    }
};
exports.VehicleTelemetryStrategy = VehicleTelemetryStrategy;
exports.VehicleTelemetryStrategy = VehicleTelemetryStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], VehicleTelemetryStrategy);
//# sourceMappingURL=vehicle-telemetry.strategy.js.map