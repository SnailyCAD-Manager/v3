import type { Socket } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import GetPlatformStorageDirectory from "../util/directories";
import type { Env, LogData } from "@scm/types";
import ManageProcess from "../util/manageProcess";
import { io } from "..";

type StopData = {
    id: string;
};

let _manualStop = false;

export default function HandleStopInstance(socket: Socket) {
    socket.on("server:stop-instance", async (data: StopData) => {
        //going to be used
        const env = dotenv.config({
            path: path.resolve(GetPlatformStorageDirectory(), data.id, ".env"),
        }).parsed as Env;

        _manualStop = true;
        ManageProcess.killProcess(data.id);

        io.emit("instance-log", {
            id: data.id,
            log: `<span style="color: orange;>Instance ${data.id} stopped</span>`,
            type: "stdout",
        } as LogData);
    });
}

export function ManualStop(newVal?: boolean) {
    if (newVal !== undefined) {
        _manualStop = newVal;
    }

    return _manualStop;
}
