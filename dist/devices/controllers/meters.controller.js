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
exports.MetersController = void 0;
const common_1 = require("@nestjs/common");
const meters_service_1 = require("../services/meters.service");
const dto_1 = require("../dto");
let MetersController = class MetersController {
    constructor(metersService) {
        this.metersService = metersService;
    }
    create(dto) {
        return this.metersService.create(dto);
    }
    findAll() {
        return this.metersService.findAll();
    }
    findOne(meterId) {
        return this.metersService.findOne(meterId);
    }
    update(meterId, dto) {
        return this.metersService.update(meterId, dto);
    }
    getLiveState(meterId) {
        return this.metersService.getLiveState(meterId);
    }
};
exports.MetersController = MetersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateMeterDto]),
    __metadata("design:returntype", void 0)
], MetersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MetersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':meterId'),
    __param(0, (0, common_1.Param)('meterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MetersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':meterId'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('meterId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateMeterDto]),
    __metadata("design:returntype", void 0)
], MetersController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':meterId/state'),
    __param(0, (0, common_1.Param)('meterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MetersController.prototype, "getLiveState", null);
exports.MetersController = MetersController = __decorate([
    (0, common_1.Controller)('v1/devices/meters'),
    __metadata("design:paramtypes", [meters_service_1.MetersService])
], MetersController);
//# sourceMappingURL=meters.controller.js.map