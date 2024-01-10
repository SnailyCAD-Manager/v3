import type { Socket } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import GetPlatformStorageDirectory from "../util/directories";

type StopData = {
    id: string;
};

export default function HandleStopInstance(socket: Socket) {
    socket.on("server:stop-instance", (data: StopData) => {
        dotenv.config({
            path: path.resolve(GetPlatformStorageDirectory(), data.id),
        });
    });
}
