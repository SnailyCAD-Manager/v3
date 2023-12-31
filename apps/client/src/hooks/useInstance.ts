import { Instance } from "@/types/instance";
import { create } from "zustand";

type InstanceState = {
    instances: Instance[];
    activeInstance: string;
    activeInstanceData: Instance | null;
    setActiveInstance: (id: string) => void;
    addInstance: (instance: Instance) => void;
    removeInstance: (id: string) => void;
    updateInstance: (instance: Instance) => void;
    addLog: (id: string, log: string) => void;
};

export const useInstance = create<InstanceState>((set) => ({
    instances: [
        {
            id: "dev",
            name: "Development",
            logs: ["log1", "log2", "log3"],
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
            status: {
                api: true,
                client: true,
            },
        },
    ],
    activeInstance: "",
    activeInstanceData: null,
    setActiveInstance: (id) =>
        set((state) => ({
            activeInstance: id,
            activeInstanceData:
                state.instances.find((i) => i.id === id) || null,
        })),
    addInstance: (instance) =>
        set((state) => ({ instances: [...state.instances, instance] })),
    removeInstance: (id) =>
        set((state) => ({
            instances: state.instances.filter((instance) => instance.id !== id),
        })),
    updateInstance: (instance) =>
        set((state) => ({
            instances: state.instances.map((i) =>
                i.id === instance.id ? instance : i
            ),
        })),
    addLog: (id, log) =>
        set((state) => ({
            instances: state.instances.map((i) =>
                i.id === id
                    ? {
                          ...i,
                          logs:
                              i.logs.length >= 150
                                  ? [...i.logs.slice(1), log]
                                  : [...i.logs, log],
                      }
                    : i
            ),
        })),
}));

function getActiveInstance() {
    return useInstance.getState().activeInstance;
}

function getActiveInstanceData() {
    return useInstance.getState().activeInstanceData;
}

export { getActiveInstance, getActiveInstanceData };
