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
import ManageDatabase from "../util/database";
import { Webhook, MessageBuilder } from "discord-webhook-nodejs";
import { ManualStop } from "./stop-instance";

const ansi = new ansi_to_html();

type StartData = {
    id: string;
    build: boolean;
};

let restartAttempts: { [key: string]: number } = {};

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

                if (code !== 0) {
                    const { settings } =
                        ManageDatabase.instances.getInstance(id);

                    if (settings.autoRestart.enabled) {
                        if (restartAttempts[id] === undefined) {
                            restartAttempts[id] = 0;
                        }

                        if (
                            !settings.autoRestart.maxRestarts ||
                            settings.autoRestart.maxRestarts === 0
                        ) {
                            return;
                        }

                        if (
                            restartAttempts[id] >=
                            settings.autoRestart.maxRestarts
                        ) {
                            io.emit(
                                "error",
                                `Instance ${id} has reached the maximum amount of restarts`
                            );
                            return;
                        }

                        restartAttempts[id]++;

                        socket.emit("server:start-instance", {
                            id,
                            build: data.build,
                        } as StartData);

                        io.emit("instance-log", {
                            id,
                            log: `<span style="background-color: darkorange; color: white; padding: 0 10px">Instance ${id} is restarting... (${restartAttempts[id]}/${settings.autoRestart.maxRestarts})</span>`,
                            type: "stdout",
                        } as LogData);
                    }

                    if (settings.crashDetection.enabled) {
                        if (
                            !settings.crashDetection.webhook ||
                            settings.crashDetection.webhook === ""
                        ) {
                            return;
                        }

                        if (ManualStop()) {
                            ManualStop(false);
                            return;
                        }

                        const webhook = new Webhook(
                            settings.crashDetection.webhook
                        );
                        const embed = new MessageBuilder()
                            .setTitle("SnailyCAD Crash Detection")
                            .setDescription(
                                settings.crashDetection.message ||
                                    "SnailyCAD has crashed"
                            )
                            .setColor("#ff0000")
                            .addField("Instance", id)
                            .addField("Reason", "Crashed")
                            .addField("Crash Code", `${code}`)
                            .setTimestamp()
                            .setFooter("Sent from SnailyCAD Manager");

                        webhook.send(embed);
                    }
                }
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

    // Online Webhook
    if (data.includes("SnailyCADv4 is running with version")) {
        const { settings } = ManageDatabase.instances.getInstance(id);

        if (settings.onStartup.enabled) {
            if (
                !settings.onStartup.webhook ||
                settings.onStartup.webhook === ""
            ) {
                return;
            }

            const webhook = new Webhook(settings.onStartup.webhook);
            const embed = new MessageBuilder()
                .setTitle("SnailyCAD Online")
                .setDescription(
                    settings.onStartup.message || "SnailyCAD is online"
                )
                .setColor("#00ff00")
                .addField("Instance", id)
                .addField("Version", data.split(" ")[5])
                .addField(
                    "Open SnailyCAD",
                    `[Click here](${readEnv(id).parsed.NEXT_PUBLIC_CLIENT_URL})`
                )
                .setTimestamp()
                .setFooter("Sent from SnailyCAD Manager");

            webhook.send(embed);
        }
    }
}
