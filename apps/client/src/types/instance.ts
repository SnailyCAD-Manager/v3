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
