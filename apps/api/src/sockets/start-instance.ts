import type { Socket } from "socket.io";
import path from "path";
import { spawn } from "child_process";
import commands, { CommandTree } from "../util/commands";
import ansi_to_html from "ansi-to-html";

const ansi = new ansi_to_html();

type StartData = {
    id: string;
    build: boolean;
};

type LogData = {
    id: string;
    log: string;
    type: "stdout" | "stderr";
};

export default function HandleStartInstance(socket: Socket) {
    socket.on("start-instance", async (data: StartData) => {
        console.log("Instance Start Triggered for ", data.id);

        const instancePath = path.resolve(
            process.cwd(),
            "data/instances",
            data.id
        );

        const startCommand = () => {
            const StartCommands = commands.start as CommandTree;

            const command = data.build
                ? StartCommands.withBuild.command
                : StartCommands.withoutBuild.command;
            const args = data.build
                ? StartCommands.withBuild.args
                : StartCommands.withoutBuild.args;

            return {
                command,
                args,
            };
        };

        const instanceProcess = spawn(
            startCommand().command as string,
            startCommand().args as string[],
            {
                cwd: instancePath,
            }
        );

        instanceProcess.stdout.on("data", (data) => {
            socket.emit("instance-log", {
                id: data.id,
                log: ansi.toHtml(data.toString()),
                type: "stdout",
            } as LogData);
        });

        instanceProcess.stderr.on("data", (data) => {
            socket.emit("instance-log", {
                id: data.id,
                log: ansi.toHtml(data.toString()),
                type: "stderr",
            } as LogData);
        });

        instanceProcess.on("close", (code) => {
            socket.emit("instance-log", {
                id: data.id,
                log: `<span style="${
                    code === 0 ? "color: orange" : "color: red"
                }">Instance exited with code ${code}</span>`,
                type: "stdout",
            });
        });

        socket.emit("instance-log", {
            id: data.id,
            log: "Starting instance...",
            type: "stdout",
        });
    });
}
