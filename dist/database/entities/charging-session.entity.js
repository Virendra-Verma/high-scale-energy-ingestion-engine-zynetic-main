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
exports.ChargingSession = void 0;
const typeorm_1 = require("typeorm");
const meter_entity_1 = require("./meter.entity");
const vehicle_entity_1 = require("./vehicle.entity");
let ChargingSession = class ChargingSession {
};
exports.ChargingSession = ChargingSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'session_id' }),
    __metadata("design:type", String)
], ChargingSession.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'meter_id', length: 64 }),
    __metadata("design:type", String)
], ChargingSession.prototype, "meterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vehicle_id', length: 64 }),
    __metadata("design:type", String)
], ChargingSession.prototype, "vehicleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'started_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], ChargingSession.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ended_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], ChargingSession.prototype, "endedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], ChargingSession.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], ChargingSession.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => meter_entity_1.Meter),
    (0, typeorm_1.JoinColumn)({ name: 'meter_id' }),
    __metadata("design:type", meter_entity_1.Meter)
], ChargingSession.prototype, "meter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vehicle_entity_1.Vehicle),
    (0, typeorm_1.JoinColumn)({ name: 'vehicle_id' }),
    __metadata("design:type", vehicle_entity_1.Vehicle)
], ChargingSession.prototype, "vehicle", void 0);
exports.ChargingSession = ChargingSession = __decorate([
    (0, typeorm_1.Entity)('charging_sessions'),
    (0, typeorm_1.Index)('idx_charging_sessions_active', ['meterId', 'vehicleId'], { where: 'is_active = TRUE' }),
    (0, typeorm_1.Index)('idx_charging_sessions_timerange', ['startedAt', 'endedAt']),
    (0, typeorm_1.Index)('idx_charging_sessions_vehicle', ['vehicleId', 'startedAt'])
], ChargingSession);
//# sourceMappingURL=charging-session.entity.js.map