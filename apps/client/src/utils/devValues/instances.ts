import type { Instance } from "@/types/instance";

function generateDevInstances(): Instance[] {
    const instances: Instance[] = [];
    for (let i = 0; i < 10; i++) {
        instances.push({
            id: `instance-${i}`,
            name: `Instance ${i}`,
            status: {
                client: true,
                api: true,
            },
            logs: [],
            env: {
                CORS_ORIGIN_URL: "http://localhost:3000",
                DB_HOST: "localhost",
                DB_PORT: "5432",
                DISCORD_BOT_TOKEN: "token",
                DISCORD_CLIENT_ID: "id",
                DISCORD_CLIENT_SECRET: "secret",
                DISCORD_SERVER_ID: "id",
                DOMAIN: "localhost",
                ENCRYPTION_TOKEN: "token",
                JWT_SECRET: "secret",
                NEXT_PUBLIC_CLIENT_URL: "http://localhost:3000",
                NEXT_PUBLIC_PROD_ORIGIN: "http://localhost:3000",
                PORT_API: "4000",
                PORT_CLIENT: "3000",
                POSTGRES_DB: "db",
                POSTGRES_PASSWORD: "password",
                POSTGRES_USER: "user",
                SECURE_COOKIES_FOR_IFRAME: false,
                STEAM_API_KEY: "key",
            },
        });
    }
    return instances;
}

export const devInstances = generateDevInstances();
