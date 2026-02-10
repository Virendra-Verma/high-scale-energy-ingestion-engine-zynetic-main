// src/config/database.config.ts
export const getDatabaseConfig = () => ({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123', // Yahan direct '123' likhein
  database: 'energy_ingestion',
  extra: {
    max: 20,
    min: 5,
  },
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
});
