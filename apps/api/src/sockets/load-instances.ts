import type { Socket } from "socket.io";
import fs from "fs";
import path from "path";
import { Instance, Env, PackageJson, StorageInstance } from "@scm/types";
import { default as findProcess } from "find-process";
import dotenv from "dotenv";
import GetPlatformStorageDirectory from "../util/directories";
import { GetLatestVersion } from "../util/version";
import ManageProcess from "../util/manageProcess";
import ManageDatabase from "../util/database";

export default function HandleLoadInstances(socket: Socket) {
    async function sendInstances() {
        const instanceStore =
            ManageDatabase.instances.getInstances() as unknown as StorageInstance[];

        const instances = [] as Instance[];

        instanceStore.forEach(
            async (instance: { name: string; id: string }) => {
                const env = dotenv.config({
                    path: path.resolve(
                        GetPlatformStorageDirectory(),
                        instance.id,
                        ".env"
                    ),
                }).parsed as Env;

                const status = {
                    api: ManageProcess.getProcessByInstanceId(instance.id)
                        ? true
                        : false,
                    client: ManageProcess.getProcessByInstanceId(instance.id)
                        ? true
                        : false,
                };

                const packageJson: PackageJson = JSON.parse(
                    fs
                        .readFileSync(
                            path.resolve(
                                GetPlatformStorageDirectory(),
                                instance.id,
                                "package.json"
                            )
                        )
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
        );

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
