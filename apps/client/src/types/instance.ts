import { Env } from "./env";

export type Instance = {
    id: string;
    name: string;
    logs: string[];
    env: Env;
    versions: {
        current: string;
        latest: string;
    };
    status: {
        api: boolean;
        client: boolean;
    };
};

export type StorageInstance = {
    name: string;
    id: string;
    settings: {
        onStartup: {
            enabled: boolean;
            webhook?: string;
            message?: string;
        };
        crashDetection: {
            enabled: boolean;
            webhook?: string;
            message?: string;
        };
        autoRestart: {
            enabled: boolean;
            maxRestarts?: number;
        };
        autoUpdate: {
            enabled: boolean;
        };
    };
};
