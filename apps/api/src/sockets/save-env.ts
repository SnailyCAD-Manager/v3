import type { Socket } from "socket.io";
import path from "path";
import fs from "fs";
import { Env, LogData } from "../../types/types";
import ansi_to_html from "ansi-to-html";
import { default as styles } from "ansi-colors";
import GetPlatformStorageDirectory from "../util/directories";

const ansi = new ansi_to_html();

type SaveEnvData = {
    id: string;
    env: Env;
};

export default function HandleSaveEnv(socket: Socket) {
    socket.on("server:save-env", (data) => {
        const { id, env } = data;
        const instancePath = path.resolve(GetPlatformStorageDirectory(), id);

        fs.writeFileSync(
            path.resolve(instancePath, ".env"),
            Object.entries(env)
                .map(([key, value]) => `${key}="${value}"`)
                .join("\n")
        );

        socket.emit("instance-log", {
            id,
            log: ansi.toHtml(
                `${styles.green("Successfully saved environment variables.")}`
            ),
            type: "stdout",
        } as LogData);
    });
}
