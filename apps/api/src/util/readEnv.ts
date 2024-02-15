import fs from "fs";
import path from "path";
import GetPlatformStorageDirectory from "./directories";
import dotenv from "dotenv";
import type { Env } from "@scm/types";
import ManageDatabase from "./database";

export default async function readEnv(id: string) {
    const instance = await ManageDatabase.instances.getInstance(id);

    if (fs.existsSync(path.resolve(instance.path, ".env"))) {
        const env = dotenv.config({
            path: path.resolve(instance.path, ".env"),
        }).parsed as Env;
        const raw = fs.readFileSync(path.resolve(instance.path, ".env"));

        return {
            parsed: env,
            raw,
        };
    } else {
        throw new Error(".env file does not exist for this instance!");
    }
}
