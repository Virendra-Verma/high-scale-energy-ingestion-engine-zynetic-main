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
exports.MeterLiveState = void 0;
const typeorm_1 = require("typeorm");
let MeterLiveState = class MeterLiveState {
};
exports.MeterLiveState = MeterLiveState;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'meter_id', length: 64 }),
    __metadata("design:type", String)
], MeterLiveState.prototype, "meterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'kwh_consumed_ac', type: 'decimal', precision: 12, scale: 4 }),
    __metadata("design:type", Number)
], MeterLiveState.prototype, "kwhConsumedAc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2 }),
    __metadata("design:type", Number)
], MeterLiveState.prototype, "voltage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], MeterLiveState.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], MeterLiveState.prototype, "updatedAt", void 0);
exports.MeterLiveState = MeterLiveState = __decorate([
    (0, typeorm_1.Entity)('meter_live_state')
], MeterLiveState);
//# sourceMappingURL=meter-live-state.entity.js.map