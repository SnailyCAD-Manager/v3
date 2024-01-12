import type { Socket } from "socket.io";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import commands, { CommandTree } from "../util/commands";
import GetPlatformStorageDirectory from "../util/directories";

export default function HandleCreateInstance(socket: Socket) {
    const installCommands = commands.install as CommandTree;

    socket.on("server:create-instance", async (data) => {
        const { name, id } = data;

        function cloneRepo() {
            fs.mkdirSync(path.resolve(GetPlatformStorageDirectory(), id));

            const cloneProcess = spawn(
                installCommands.clone.command as string,
                [...(installCommands.clone.args as string[]), "--progress"],
                {
                    cwd: path.resolve(GetPlatformStorageDirectory(), id),
                    shell: true,
                }
            );

            cloneProcess.stdout.on("data", (data) => {
                socket.emit("create-instance-stdout", data.toString());
            });

            cloneProcess.stderr.on("data", (data) => {
                socket.emit("create-instance-stdout", data.toString()); //? Because git clone outputs to stderr in 99% of cases.
            });

            cloneProcess.on("close", (code) => {
                if (code === 0) {
                    socket.emit(
                        "create-instance-stdout",
                        "Cloned repo successfully"
                    );

                    fs.copyFileSync(
                        path.resolve(
                            GetPlatformStorageDirectory(),
                            id,
                            ".env.example"
                        ),
                        path.resolve(GetPlatformStorageDirectory(), id, ".env")
                    );

                    installDeps();
                } else {
                    socket.emit("create-instance-fail", "Failed to clone repo");
                }
            });
        }

        function installDeps() {
            const depsProcess = spawn(
                installCommands.deps.command as string,
                installCommands.deps.args as string[],
                {
                    cwd: path.resolve(GetPlatformStorageDirectory(), id),
                    shell: true,
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
                    copyEnv();
                } else {
                    socket.emit(
                        "create-instance-fail",
                        "Failed to install dependencies"
                    );
                }
            });
        }

        function copyEnv() {
            const moveEnvProcess = spawn(
                installCommands.copyEnv.command as string,
                installCommands.copyEnv.args as string[],
                {
                    cwd: path.resolve(GetPlatformStorageDirectory(), id),
                    shell: true,
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
                    const instances = JSON.parse(
                        fs
                            .readFileSync(
                                path.resolve(
                                    process.cwd(),
                                    "data/instances.json"
                                )
                            )
                            .toString()
                    );
                    instances.push({ name, id });
                    fs.writeFileSync(
                        path.resolve(process.cwd(), "data/instances.json"),
                        JSON.stringify(instances)
                    );
                    socket.emit("create-instance-success");
                } else {
                    socket.emit(
                        "create-instance-fail",
                        "Failed to move env files"
                    );
                }
            });
        }

        // Check to see if the instance directory already exists based on the ID
        if (fs.existsSync(path.resolve(GetPlatformStorageDirectory(), id))) {
            socket.emit("create-instance-fail", "Instance Already Exists");

            return;
        }

        cloneRepo();
    });
}
