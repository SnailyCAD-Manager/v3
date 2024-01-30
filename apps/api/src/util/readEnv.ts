import fs from "fs";
import path from "path";
import GetPlatformStorageDirectory from "./directories";
import dotenv from "dotenv";
import { Env } from "@scm/types";
export default function readEnv(id: string) {
    if (
        fs.existsSync(path.resolve(GetPlatformStorageDirectory(), id, ".env"))
    ) {
        const env = dotenv.config({
            path: path.resolve(GetPlatformStorageDirectory(), id, ".env"),
        }).parsed as Env;
        const raw = fs.readFileSync(
            path.resolve(GetPlatformStorageDirectory(), id, ".env")
        );

        return {
            parsed: env,
            raw,
        };
    } else {
        throw new Error(".env file does not exist for this instance!");
    }
}
