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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../database/entities");
let VehiclesService = class VehiclesService {
    constructor(vehicleRepo, liveStateRepo) {
        this.vehicleRepo = vehicleRepo;
        this.liveStateRepo = liveStateRepo;
    }
    async create(dto) {
        const existing = await this.vehicleRepo.findOne({
            where: { vehicleId: dto.vehicleId },
        });
        if (existing) {
            throw new common_1.ConflictException(`Vehicle ${dto.vehicleId} already exists`);
        }
        const vehicle = this.vehicleRepo.create({
            vehicleId: dto.vehicleId,
            vin: dto.vin,
            batteryCapacityKwh: dto.batteryCapacityKwh,
            model: dto.model,
            metadata: dto.metadata || {},
        });
        return this.vehicleRepo.save(vehicle);
    }
    async findAll() {
        return this.vehicleRepo.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(vehicleId) {
        const vehicle = await this.vehicleRepo.findOne({
            where: { vehicleId },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException(`Vehicle ${vehicleId} not found`);
        }
        return vehicle;
    }
    async update(vehicleId, dto) {
        const vehicle = await this.findOne(vehicleId);
        Object.assign(vehicle, dto);
        return this.vehicleRepo.save(vehicle);
    }
    async getLiveState(vehicleId) {
        await this.findOne(vehicleId);
        return this.liveStateRepo.findOne({
            where: { vehicleId },
        });
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Vehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.VehicleLiveState)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map