import type { Socket } from "socket.io";
import fs from "fs";
import path from "path";
import type { Instance, Env, PackageJson, StorageInstance } from "@scm/types";
import dotenv from "dotenv";
import { GetLatestVersion } from "../util/version";
import ManageProcess from "../util/manageProcess";
import ManageDatabase from "../util/database";

export default function HandleLoadInstances(socket: Socket) {
    async function sendInstances() {
        const instanceStore =
            (await ManageDatabase.instances.getInstances()) as StorageInstance[];

        const instances = [] as Instance[];

        for (const instance of instanceStore) {
            const env = dotenv.config({
                path: path.resolve(instance.path, ".env"),
            }).parsed as Env;

            const status = {
                api: !!ManageProcess.getProcessByInstanceId(instance.id),
                client: !!ManageProcess.getProcessByInstanceId(instance.id),
            };

            const packageJson: PackageJson = JSON.parse(
                fs
                    .readFileSync(path.resolve(instance.path, "package.json"))
                    .toString()
            );

            instances.push({
                name: instance.name,
                id: instance.id,
                logs: [],
                versions: {
                    current: packageJson.version,
                    latest: GetLatestVersion(),
                },
                env: env,
                status,
            });
        }

        const interval = setInterval(() => {
            if (instances.length === instanceStore.length) {
                socket.emit("load-instances", instances);
                clearInterval(interval);
                setTimeout(sendInstances, 500);
            }
        }, 100);
    }

    sendInstances();
}
