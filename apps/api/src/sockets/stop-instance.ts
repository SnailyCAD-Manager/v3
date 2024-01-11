import type { Socket } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import GetPlatformStorageDirectory from "../util/directories";
import killPort from "kill-port";
import { Env, LogData } from "../../types/types";

type StopData = {
    id: string;
};

export default function HandleStopInstance(socket: Socket) {
    socket.on("server:stop-instance", async (data: StopData) => {
        const env = dotenv.config({
            path: path.resolve(GetPlatformStorageDirectory(), data.id, ".env"),
        }).parsed as Env;

        await killPort(parseInt(env.PORT_CLIENT as string));
        await killPort(parseInt(env.PORT_API as string));

        socket.emit("instance-log", {
            id: data.id,
            log: `<span style="color: orange;>Instance ${data.id} stopped</span>`,
            type: "stdout",
        } as LogData);
    });
}
