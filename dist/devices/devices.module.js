"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const meters_controller_1 = require("./controllers/meters.controller");
const vehicles_controller_1 = require("./controllers/vehicles.controller");
const meters_service_1 = require("./services/meters.service");
const vehicles_service_1 = require("./services/vehicles.service");
const entities_1 = require("../database/entities");
let DevicesModule = class DevicesModule {
};
exports.DevicesModule = DevicesModule;
exports.DevicesModule = DevicesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.Meter, entities_1.Vehicle, entities_1.MeterLiveState, entities_1.VehicleLiveState]),
        ],
        controllers: [meters_controller_1.MetersController, vehicles_controller_1.VehiclesController],
        providers: [meters_service_1.MetersService, vehicles_service_1.VehiclesService],
        exports: [meters_service_1.MetersService, vehicles_service_1.VehiclesService],
    })
], DevicesModule);
//# sourceMappingURL=devices.module.js.map