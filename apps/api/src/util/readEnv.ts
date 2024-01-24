import fs from "fs";
import path from "path";
import GetPlatformStorageDirectory from "./directories";
import dotenv from "dotenv";
import { Env } from "../../types/types";
export default function readEnv(id: string) {
    if (
        fs.existsSync(path.resolve(GetPlatformStorageDirectory(), id, ".env"))
    ) {
        dotenv.config({
            path: path.resolve(GetPlatformStorageDirectory(), id, ".env"),
        });
        const raw = fs.readFileSync(
            path.resolve(GetPlatformStorageDirectory(), id, ".env")
        );

        return {
            parsed: dotenv.parse(
                path.resolve(GetPlatformStorageDirectory(), id, ".env")
            ) as Env,
            raw,
        };
    } else {
        throw new Error(".env file does not exist for this instance!");
    }
}
