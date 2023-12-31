import { Env } from "./env";

export type Instance = {
    id: string;
    name: string;
    logs: string[];
    env: Env;
    status: {
        api: boolean;
        client: boolean;
    };
};
