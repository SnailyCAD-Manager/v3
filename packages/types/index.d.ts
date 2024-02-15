declare module "@scm/types" {
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
        path: string;
        settings: {
            autoStart?: boolean;
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
        SECURE_COOKIES_FOR_IFRAME?: string;
        DISCORD_CLIENT_ID?: string;
        DISCORD_CLIENT_SECRET?: string;
        DISCORD_BOT_TOKEN?: string;
        DISCORD_SERVER_ID?: string;
        STEAM_API_KEY?: string;
    };

    export type ResetDependenciesData = {
        id: string;
    };

    export type LogData = {
        id: string;
        log: string;
        type: "stdout" | "stderr" | "error" | "console";
    };

    export type StartData = {
        id: string;
        build: boolean;
    };

    export type CommandData = {
        id: string;
        command: string;
    };

    export type PackageJson = {
        version: string;
    };

    export type DeleteData = {
        id: string;
    };

    export type UpdateData = {
        id: string;
        force: boolean;
    };

    export type AddUserData = {
        username: string;
        password: string;
        role: "admin" | "user";
    };

    export type User = {
        id: string;
        username: string;
        password: string;
        passwordResetAtNextLogin?: boolean;
        createdAt?: string;
        updatedAt?: string;
        role: "admin" | "user";
    };

    export type UserLoginReturnData = {
        user: User;
        sessionId: string;
    };

    export type UserLoginData = {
        username: string;
        password: string;
    };

    export type UserWithoutPassword = {
        id: string;
        username: string;
        role: "admin" | "user";
    };

    export type UserWithoutId = {
        username: string;
        password: string;
        role: "admin" | "user";
    };

    export type UserWithoutIdAndPassword = {
        username: string;
        role: "admin" | "user";
    };

    export type UserWithoutUsername = {
        id: string;
        password: string;
        role: "admin" | "user";
    };

    export type SaveEnvData = {
        id: string;
        env: Env;
    };
    export type CommandTree = {
        [key: string]:
            | {
                  command: string;
                  args: string[];
              }
            | CommandTree;
    };
}
