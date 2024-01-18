import type { Socket } from "socket.io";
import path from "path";
import { spawn } from "child_process";
import commands, { CommandTree } from "../util/commands";
import ansi_to_html from "ansi-to-html";
import { LogData } from "../../types/types";
import GetPlatformStorageDirectory from "../util/directories";
import fs from "fs";

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

        if (!fs.existsSync(path.resolve(GetPlatformStorageDirectory(), id))) {
            socket.emit(
                "error",
                `The instance with the ID ${id} does not exist`
            );
            return;
        }

        const startCommand = getStartCommand(data.build);

        try {
            const startProcess = spawn(
                startCommand.command,
                startCommand.args,
                {
                    cwd: path.resolve(GetPlatformStorageDirectory(), data.id),
                    shell: true,
                }
            );

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
                    log: ansi.toHtml(`CAD Process exited with code ${code}`),
                    type: "console",
                } as LogData);
            });
        } catch (err: any) {
            socket.emit("instance-log", {
                id,
                log: ansi.toHtml(err.toString()),
                type: "stderr",
            } as LogData);
            throw new Error(err);
        }
    });
}
