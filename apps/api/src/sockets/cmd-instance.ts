import type { Socket } from "socket.io";
import { spawn } from "child_process";
import path from "path";
import GetPlatformStorageDirectory from "../util/directories";
import { LogData } from "../../types/types";

type CommandData = {
    id: string;
    command: string;
};

export default function HandleCommands(socket: Socket) {
    socket.on("server:command", (data: CommandData) => {
        try {
            const commandProcess = spawn(
                data.command.split(" ")[0],
                data.command.split(" ").slice(1),
                {
                    cwd: path.resolve(GetPlatformStorageDirectory(), data.id),
                    shell: true,
                    stdio: "pipe",
                }
            );

            commandProcess.stdout.on("data", (stdout) => {
                socket.emit("instance-log", {
                    id: data.id,
                    log: stdout.toString(),
                    type: "stdout",
                } as LogData);
            });

            commandProcess.stderr.on("data", (stderr) => {
                socket.emit("instance-log", {
                    id: data.id,
                    log: stderr.toString(),
                    type: "stderr",
                } as LogData);
            });

            commandProcess.on("close", (code) => {
                socket.emit("instance-log", {
                    id: data.id,
                    log: `Command exited with code ${code}`,
                    type: "console",
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
