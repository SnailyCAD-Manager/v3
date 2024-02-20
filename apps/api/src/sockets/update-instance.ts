import type { LogData, UpdateData } from "@scm/types";
import type { Socket } from "socket.io";
import ManageProcess from "../util/manageProcess";
import { spawn } from "child_process";
import { io } from "..";
import path from "path";
import { GetLatestVersion } from "../util/version";
import ManageDatabase from "../util/database";

export default function HandleUpdateInstance(socket: Socket) {
    socket.on("server:update-instance", async (data: UpdateData) => {
        const { id, force } = data;
        const instance = await ManageDatabase.instances.getInstance(id);

        ManageProcess.killProcess(id);

        const usedCommand = await updateCommand(force);

        const updateProcess = spawn(
            usedCommand.split(" ")[0],
            usedCommand.split(" ").slice(1),
            {
                cwd: path.resolve(instance.path),
                stdio: "pipe",
                shell: true,
            }
        );

        io.emit("client:update-instance", {
            id,
            inProgress: true,
        });

        updateProcess.stdout.on("data", (data) => {
            io.emit("instance-log", {
                id,
                log: data.toString(),
                type: "stdout",
            } as LogData);

            io.emit("client:update-instance", {
                id,
                inProgress: true,
            });
        });

        updateProcess.stderr.on("data", (data) => {
            io.emit("instance-log", {
                id,
                log: data.toString(),
                type: "stderr",
            } as LogData);

            io.emit("client:update-instance", {
                id,
                inProgress: true,
            });
        });

        updateProcess.on("close", (code) => {
            io.emit("client:update-instance", {
                id,
                inProgress: false,
                error: code !== 0,
            });
        });
    });
}

async function updateCommand(force: boolean) {
    if (force) {
        return "git stash && git pull origin main && pnpm install --config.confirmModulesPurge=false --prod=false && pnpm run build";
    } else {
        return `git stash && git fetch && git checkout tags/${GetLatestVersion()} && pnpm install --config.confirmModulesPurge=false --prod=false && pnpm run build`;
    }
}
