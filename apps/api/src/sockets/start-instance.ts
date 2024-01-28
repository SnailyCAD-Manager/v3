import type { Socket } from "socket.io";
import path from "path";
import { spawn } from "child_process";
import commands, { CommandTree } from "../util/commands";
import ansi_to_html from "ansi-to-html";
import type { LogData } from "../../types/types";
import GetPlatformStorageDirectory from "../util/directories";
import fs from "fs";
import readEnv from "../util/readEnv";
import ManageProcess from "../util/manageProcess";
import { io } from "..";

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
            io.emit(
                "error",
                "No instance ID was provided to the server for starting the instance"
            );
            return;
        }

        const { id } = data;

        if (!fs.existsSync(path.resolve(GetPlatformStorageDirectory(), id))) {
            io.emit("error", `The instance with the ID ${id} does not exist`);
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
                    env: readEnv(data.id).parsed,
                }
            );

            ManageProcess.addProcess(id, startProcess.pid as number);

            startProcess.stdout.on("data", (data: Buffer) => {
                FilterLog(data.toString(), id, socket);

                io.emit("instance-log", {
                    id,
                    log: ansi.toHtml(data.toString()),
                    type: "stdout",
                } as LogData);
            });

            startProcess.stderr.on("data", (data) => {
                FilterLog(data.toString(), id, socket);

                io.emit("instance-log", {
                    id,
                    log: ansi.toHtml(data.toString()),
                    type: "stderr",
                } as LogData);
            });

            startProcess.on("close", (code) => {
                ManageProcess.removeProcess(id);
                io.emit("instance-log", {
                    id,
                    log: ansi.toHtml(`CAD Process exited with code ${code}`),
                    type: "console",
                } as LogData);
            });
        } catch (err: any) {
            io.emit("instance-log", {
                id,
                log: ansi.toHtml(err.toString()),
                type: "stderr",
            } as LogData);
            throw new Error(err);
        }
    });
}

function FilterLog(data: string, id: string, socket: Socket) {
    // Common Database Errors
    if (data.includes("Authentication failed against database server")) {
        io.emit("error", `Authentication failed (${id})`);
        io.emit("instance-log", {
            id,
            log: `<span style="background-color: red; padding: 0 10px;">DATABASE AUTHENTICATION FAILED</span>`,
        } as LogData);
        ManageProcess.killProcess(id);
    }
    if (data.includes("Can't reach database server at")) {
        io.emit("error", `Database server unreachable (${id})`);
        io.emit("instance-log", {
            id,
            log: `<span style="background-color: red; padding: 0 10px;">DATABASE SERVER UNREACHABLE</span>`,
        } as LogData);
        ManageProcess.killProcess(id);
    }

    // Common Port Errors
    if (data.includes("EADDRINUSE")) {
        io.emit("error", `Port is already in use (${id})`);
        io.emit("instance-log", {
            id,
            log: `<span style="background-color: red; padding: 0 10px;">PORT IS ALREADY IN USE</span>`,
        } as LogData);
        ManageProcess.killProcess(id);
    }
}
