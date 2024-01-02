import type { Socket } from "socket.io";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import commands, { CommandTree } from "../util/commands";

export default function HandleCreateInstance(socket: Socket) {
    const installCommands = commands.install as CommandTree;

    socket.on("create-instance", async (data) => {
        const { name, id } = data;

        function cloneRepo() {
            const cloneProcess = spawn(
                installCommands.clone.command as string,
                installCommands.clone.args as string[],
                {
                    cwd: path.resolve(process.cwd(), "data/instances", id),
                }
            );

            cloneProcess.stdout.on("data", (data) => {
                socket.emit("create-instance-stdout", data.toString());
            });

            cloneProcess.stderr.on("data", (data) => {
                socket.emit("create-instance-stderr", data.toString());
            });

            cloneProcess.on("close", (code) => {
                if (code === 0) {
                    socket.emit(
                        "create-instance-stdout",
                        "Cloned repo successfully"
                    );
                    installDeps();
                } else {
                    socket.emit(
                        "create-instance-stderr",
                        "Failed to clone repo"
                    );
                }
            });
        }

        function installDeps() {
            const depsProcess = spawn(
                installCommands.deps.command as string,
                installCommands.deps.args as string[],
                {
                    cwd: path.resolve(process.cwd(), "data/instances", id),
                }
            );

            depsProcess.stdout.on("data", (data) => {
                socket.emit("create-instance-stdout", data.toString());
            });

            depsProcess.stderr.on("data", (data) => {
                socket.emit("create-instance-stderr", data.toString());
            });

            depsProcess.on("close", (code) => {
                if (code === 0) {
                    socket.emit(
                        "create-instance-stdout",
                        "Installed dependencies successfully"
                    );
                    moveEnv();
                } else {
                    socket.emit(
                        "create-instance-stderr",
                        "Failed to install dependencies"
                    );
                }
            });
        }

        function moveEnv() {
            const moveEnvProcess = spawn(
                installCommands.moveEnv.command as string,
                installCommands.moveEnv.args as string[],
                {
                    cwd: path.resolve(process.cwd(), "data/instances", id),
                }
            );

            moveEnvProcess.stdout.on("data", (data) => {
                socket.emit("create-instance-stdout", data.toString());
            });

            moveEnvProcess.stderr.on("data", (data) => {
                socket.emit("create-instance-stderr", data.toString());
            });

            moveEnvProcess.on("close", (code) => {
                if (code === 0) {
                    socket.emit(
                        "create-instance-stdout",
                        "Moved env files successfully"
                    );
                    socket.emit("create-instance-success");
                } else {
                    socket.emit(
                        "create-instance-stderr",
                        "Failed to move env files"
                    );
                }
            });
        }

        fs.mkdirSync(path.resolve(process.cwd(), "data/instances", id));
        socket.emit("create-instance-stdout", "Created instance directory");
        cloneRepo();
    });
}
