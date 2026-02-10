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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../database/entities");
let SessionsService = class SessionsService {
    constructor(sessionRepo, meterRepo, vehicleRepo, dataSource) {
        this.sessionRepo = sessionRepo;
        this.meterRepo = meterRepo;
        this.vehicleRepo = vehicleRepo;
        this.dataSource = dataSource;
    }
    async startSession(dto) {
        const meter = await this.meterRepo.findOne({
            where: { meterId: dto.meterId },
        });
        if (!meter) {
            throw new common_1.NotFoundException(`Meter ${dto.meterId} not found`);
        }
        const vehicle = await this.vehicleRepo.findOne({
            where: { vehicleId: dto.vehicleId },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException(`Vehicle ${dto.vehicleId} not found`);
        }
        const activeMeterSession = await this.sessionRepo.findOne({
            where: { meterId: dto.meterId, isActive: true },
        });
        if (activeMeterSession) {
            throw new common_1.ConflictException(`Meter ${dto.meterId} already has an active session`);
        }
        const activeVehicleSession = await this.sessionRepo.findOne({
            where: { vehicleId: dto.vehicleId, isActive: true },
        });
        if (activeVehicleSession) {
            throw new common_1.ConflictException(`Vehicle ${dto.vehicleId} already has an active session`);
        }
        const session = this.sessionRepo.create({
            meterId: dto.meterId,
            vehicleId: dto.vehicleId,
            startedAt: new Date(),
            isActive: true,
        });
        return this.sessionRepo.save(session);
    }
    async endSession(sessionId) {
        const session = await this.sessionRepo.findOne({
            where: { sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session ${sessionId} not found`);
        }
        if (!session.isActive) {
            throw new common_1.BadRequestException(`Session ${sessionId} is already ended`);
        }
        session.isActive = false;
        session.endedAt = new Date();
        return this.sessionRepo.save(session);
    }
    async findActive() {
        return this.sessionRepo.find({
            where: { isActive: true },
            order: { startedAt: 'DESC' },
        });
    }
    async findOne(sessionId) {
        const session = await this.sessionRepo.findOne({
            where: { sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session ${sessionId} not found`);
        }
        return session;
    }
    async findByVehicle(vehicleId) {
        return this.sessionRepo.find({
            where: { vehicleId },
            order: { startedAt: 'DESC' },
        });
    }
    async findByMeter(meterId) {
        return this.sessionRepo.find({
            where: { meterId },
            order: { startedAt: 'DESC' },
        });
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.ChargingSession)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Meter)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Vehicle)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map