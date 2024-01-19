export type Instance = {
    name: string;
    id: string;
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

export type Env = {
    POSTGRES_PASSWORD?: string;
    POSTGRES_USER?: string;
    POSTGRES_DB?: string;
    DB_HOST?: string;
    DB_PORT?: string;
    JWT_SECRET?: string;
    CORS_ORIGIN_URL?: string;
    NEXT_PUBLIC_CLIENT_URL?: string;
    NEXT_PUBLIC_PROD_ORIGIN?: string;
    PORT_API?: string;
    PORT_CLIENT?: string;
    ENCRYPTION_TOKEN?: string;
    DOMAIN?: string;
    SECURE_COOKIES_FOR_IFRAME?: boolean;
    DISCORD_CLIENT_ID?: string;
    DISCORD_CLIENT_SECRET?: string;
    DISCORD_BOT_TOKEN?: string;
    DISCORD_SERVER_ID?: string;
    STEAM_API_KEY?: string;
};

export type LogData = {
    id: string;
    log: string;
    type: "stdout" | "stderr" | "error" | "console";
};

export type PackageJson = {
    version: string;
};
