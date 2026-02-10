export declare const getDatabaseConfig: () => {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    extra: {
        max: number;
        min: number;
    };
    entities: string[];
    synchronize: boolean;
};
