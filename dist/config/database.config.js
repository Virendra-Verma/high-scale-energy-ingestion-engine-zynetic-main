"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const getDatabaseConfig = () => ({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123',
    database: 'energy_ingestion',
    extra: {
        max: 20,
        min: 5,
    },
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
});
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map