import type { Socket } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import GetPlatformStorageDirectory from "../util/directories";
import killPort from "kill-port";
import { Env, LogData } from "../../types/types";
import ManageProcess from "../util/manageProcess";

type StopData = {
    id: string;
};

export default function HandleStopInstance(socket: Socket) {
    socket.on("server:stop-instance", async (data: StopData) => {
        const env = dotenv.config({
            path: path.resolve(GetPlatformStorageDirectory(), data.id, ".env"),
        }).parsed as Env;

        ManageProcess.killProcess(data.id);

        socket.emit("instance-log", {
            id: data.id,
            log: `<span style="color: orange;>Instance ${data.id} stopped</span>`,
            type: "stdout",
        } as LogData);
    });
}
