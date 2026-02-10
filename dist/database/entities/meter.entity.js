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
exports.Meter = void 0;
const typeorm_1 = require("typeorm");
let Meter = class Meter {
};
exports.Meter = Meter;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'meter_id', length: 64 }),
    __metadata("design:type", String)
], Meter.prototype, "meterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Meter.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'capacity_kw',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Meter.prototype, "capacityKw", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'installed_at', type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], Meter.prototype, "installedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Meter.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], Meter.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Meter.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Meter.prototype, "updatedAt", void 0);
exports.Meter = Meter = __decorate([
    (0, typeorm_1.Entity)('meters')
], Meter);
//# sourceMappingURL=meter.entity.js.map