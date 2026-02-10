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
exports.VehicleLiveState = void 0;
const typeorm_1 = require("typeorm");
let VehicleLiveState = class VehicleLiveState {
};
exports.VehicleLiveState = VehicleLiveState;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'vehicle_id', length: 64 }),
    __metadata("design:type", String)
], VehicleLiveState.prototype, "vehicleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], VehicleLiveState.prototype, "soc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'kwh_delivered_dc', type: 'decimal', precision: 12, scale: 4 }),
    __metadata("design:type", Number)
], VehicleLiveState.prototype, "kwhDeliveredDc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'battery_temp', type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], VehicleLiveState.prototype, "batteryTemp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], VehicleLiveState.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], VehicleLiveState.prototype, "updatedAt", void 0);
exports.VehicleLiveState = VehicleLiveState = __decorate([
    (0, typeorm_1.Entity)('vehicle_live_state')
], VehicleLiveState);
//# sourceMappingURL=vehicle-live-state.entity.js.map