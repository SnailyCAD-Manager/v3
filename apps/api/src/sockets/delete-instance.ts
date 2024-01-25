import type { Socket } from "socket.io";
import { DeleteData } from "../../types/types";
import readEnv from "../util/readEnv";
import killPort from "kill-port";
import fs from "fs";
import path from "path";
import GetPlatformStorageDirectory from "../util/directories";
import ManageProcess from "../util/manageProcess";

export default function HandleDeleteInstance(socket: Socket) {
    socket.on("server:delete-instance", async (data: DeleteData) => {
        const env = readEnv(data.id);

        try {
            ManageProcess.killProcess(data.id);
        } catch {
            socket.emit(
                "error",
                `Failed to kill process for instance: ${data.id} for deletion.`
            );
        }

        try {
            await killPort(parseInt(env.parsed.PORT_API!));
        } catch {
            socket.emit(
                "error",
                `Failed to kill API for instance: ${data.id} for deletion.`
            );
        }
        try {
            await killPort(parseInt(env.parsed.PORT_CLIENT!));
        } catch {
            socket.emit(
                "error",
                `Failed to kill Client for instance: ${data.id} for deletion.`
            );
        }

        try {
            await fs.promises.rm(
                path.resolve(GetPlatformStorageDirectory(), data.id),
                {
                    recursive: true,
                }
            );
        } catch (err) {
            socket.emit(
                "error",
                `Failed to delete instance: ${data.id}. (ERR: ${err})`
            );
            return;
        }
    });
}
