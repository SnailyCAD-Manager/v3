import type { Socket } from "socket.io";
import { spawn } from "child_process";
import path from "path";
import GetPlatformStorageDirectory from "../util/directories";
import { LogData } from "../../types/types";

type CommandData = {
    id: string;
    command: string;
};

export default function CommandHandler(socket: Socket) {
    socket.on("server:command", (data: CommandData) => {
        try {
            const commandProcess = spawn(data.command, [], {
                cwd: path.resolve(GetPlatformStorageDirectory(), data.id),
            });

            commandProcess.stdout.on("data", (data) => {
                socket.emit("instance-log", {
                    id: data.id,
                    log: data.toString(),
                    type: "stdout",
                } as LogData);
            });

            commandProcess.stderr.on("data", (data) => {
                socket.emit("instance-log", {
                    id: data.id,
                    log: data.toString(),
                    type: "stderr",
                } as LogData);
            });

            commandProcess.on("close", (code) => {
                socket.emit("instance-log", {
                    id: data.id,
                    log: `Command exited with code ${code}`,
                    type: "stdout",
                } as LogData);
            });
        } catch (err: any) {
            socket.emit("instance-log", {
                id: data.id,
                log: err.toString(),
                type: "stderr",
            } as LogData);
        }
    });
}
