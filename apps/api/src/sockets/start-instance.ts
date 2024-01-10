import type { Socket } from "socket.io";
import path from "path";
import { spawn } from "child_process";
import commands, { CommandTree } from "../util/commands";
import ansi_to_html from "ansi-to-html";
import { LogData } from "../../types/types";
import GetPlatformStorageDirectory from "../util/directories";

const ansi = new ansi_to_html();

type StartData = {
    id: string;
    build: boolean;
};

function getStartCommand(build: boolean) {
    const startCommands = commands.start as CommandTree;

    if (build) {
        return {
            command: startCommands.withBuild.command as string,
            args: startCommands.withBuild.args as string[],
        };
    }

    return {
        command: startCommands.withoutBuild.command as string,
        args: startCommands.withoutBuild.args as string[],
    };
}

export default function HandleStartInstance(socket: Socket) {
    socket.on("server:start-instance", async (data: StartData) => {
        if (!data.id) {
            socket.emit(
                "error",
                "No instance ID was provided to the server for starting the instance"
            );
            return;
        }

        const { id } = data;

        const startCommand = getStartCommand(data.build);

        const startProcess = spawn("pnpm", ["run", "start"], {
            cwd: path.resolve(GetPlatformStorageDirectory(), data.id),
        });

        startProcess.stdout.on("data", (data) => {
            socket.emit("instance-log", {
                id,
                log: ansi.toHtml(data.toString()),
                type: "stdout",
            } as LogData);
        });

        startProcess.stderr.on("data", (data) => {
            socket.emit("instance-log", {
                id,
                log: ansi.toHtml(data.toString()),
                type: "stderr",
            } as LogData);
        });

        startProcess.on("close", (code) => {
            socket.emit("instance-log", {
                id,
                log: ansi.toHtml(`child process exited with code ${code}`),
                type: "stdout",
            } as LogData);
        });
    });
}
