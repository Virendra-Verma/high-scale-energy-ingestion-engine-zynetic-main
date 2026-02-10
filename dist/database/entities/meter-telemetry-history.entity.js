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
exports.MeterTelemetryHistory = void 0;
const typeorm_1 = require("typeorm");
let MeterTelemetryHistory = class MeterTelemetryHistory {
};
exports.MeterTelemetryHistory = MeterTelemetryHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], MeterTelemetryHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'meter_id', length: 64 }),
    __metadata("design:type", String)
], MeterTelemetryHistory.prototype, "meterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'kwh_consumed_ac', type: 'decimal', precision: 12, scale: 4 }),
    __metadata("design:type", Number)
], MeterTelemetryHistory.prototype, "kwhConsumedAc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2 }),
    __metadata("design:type", Number)
], MeterTelemetryHistory.prototype, "voltage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], MeterTelemetryHistory.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ingested_at', type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], MeterTelemetryHistory.prototype, "ingestedAt", void 0);
exports.MeterTelemetryHistory = MeterTelemetryHistory = __decorate([
    (0, typeorm_1.Entity)('meter_telemetry_history'),
    (0, typeorm_1.Index)('idx_meter_history_timerange', ['timestamp', 'meterId'])
], MeterTelemetryHistory);
//# sourceMappingURL=meter-telemetry-history.entity.js.map