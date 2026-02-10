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
exports.MeterTelemetryStrategy = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const dto_1 = require("../dto");
const class_transformer_1 = require("class-transformer");
let MeterTelemetryStrategy = class MeterTelemetryStrategy {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async persistLive(payload) {
        await this.dataSource.query(`
      INSERT INTO meter_live_state (meter_id, kwh_consumed_ac, voltage, timestamp, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (meter_id) DO UPDATE SET
        kwh_consumed_ac = EXCLUDED.kwh_consumed_ac,
        voltage = EXCLUDED.voltage,
        timestamp = EXCLUDED.timestamp,
        updated_at = NOW()
      WHERE meter_live_state.timestamp < EXCLUDED.timestamp
      `, [payload.meterId, payload.kwhConsumedAc, payload.voltage, payload.timestamp]);
    }
    validate(rawPayload) {
        const dto = (0, class_transformer_1.plainToInstance)(dto_1.MeterTelemetryDto, rawPayload);
        if (!dto.meterId || dto.kwhConsumedAc === undefined || dto.voltage === undefined || !dto.timestamp) {
            throw new common_1.BadRequestException('Invalid meter telemetry payload');
        }
        return {
            meterId: dto.meterId,
            kwhConsumedAc: Number(dto.kwhConsumedAc),
            voltage: Number(dto.voltage),
            timestamp: new Date(dto.timestamp),
        };
    }
    getStreamType() {
        return 'meter';
    }
};
exports.MeterTelemetryStrategy = MeterTelemetryStrategy;
exports.MeterTelemetryStrategy = MeterTelemetryStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], MeterTelemetryStrategy);
//# sourceMappingURL=meter-telemetry.strategy.js.map