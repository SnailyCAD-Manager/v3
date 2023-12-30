import { Env } from "./env";

export type Instance = {
    id: string;
    name: string;
    env: Env;
    status: {
        api: boolean;
        client: boolean;
    };
};
