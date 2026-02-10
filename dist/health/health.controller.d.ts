import { DataSource } from 'typeorm';
export declare class HealthController {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    check(): Promise<{
        status: string;
        timestamp: string;
        checks: {
            database: string;
        };
    }>;
    readiness(): Promise<{
        status: string;
        timestamp: string;
    }>;
    liveness(): {
        status: string;
        timestamp: string;
    };
    private checkDatabase;
}
