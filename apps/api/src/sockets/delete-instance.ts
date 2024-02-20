import type { DeleteData } from "@scm/types";
import killPort from "kill-port";
import type { Socket } from "socket.io";
import ManageDatabase from "../util/database";
import ManageProcess from "../util/manageProcess";
import readEnv from "../util/readEnv";

export default function HandleDeleteInstance(socket: Socket) {
    socket.on("server:delete-instance", async (data: DeleteData) => {
        const env = await readEnv(data.id);

        try {
            ManageProcess.killProcess(data.id);
        } catch {
            socket.emit(
                "error",
                `Unable to kill process for instance: ${data.id}. This is ok in most cases.`
            );
        }

        try {
            await killPort(parseInt(env.parsed.PORT_API!));
        } catch {
            socket.emit(
                "error",
                `Unable to kill API for instance: ${data.id} for deletion. This is ok in most cases.`
            );
        }

        try {
            await killPort(parseInt(env.parsed.PORT_CLIENT!));
        } catch {
            socket.emit(
                "error",
                `Unable to kill client for instance: ${data.id} for deletion. This is ok in most cases.`
            );
        }

        try {
            await ManageDatabase.instances.deleteInstance(data.id);
        } catch (err) {
            socket.emit(
                "error",
                `Failed to delete instance: ${data.id}. (ERR: ${err})`
            );
            return;
        }
    });
}
