"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.getDatabaseConfig = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const ingestion_module_1 = require("./ingestion/ingestion.module");
const analytics_module_1 = require("./analytics/analytics.module");
const devices_module_1 = require("./devices/devices.module");
const sessions_module_1 = require("./sessions/sessions.module");
const health_module_1 = require("./health/health.module");
const getDatabaseConfig = () => ({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123',
    database: 'energy_ingestion',
    entities: [],
    synchronize: false,
    logging: true,
    extra: {
        max: 20,
        min: 5,
    },
});
exports.getDatabaseConfig = getDatabaseConfig;
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => (0, exports.getDatabaseConfig)(),
            }),
            schedule_1.ScheduleModule.forRoot(),
            ingestion_module_1.IngestionModule,
            analytics_module_1.AnalyticsModule,
            devices_module_1.DevicesModule,
            sessions_module_1.SessionsModule,
            health_module_1.HealthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map