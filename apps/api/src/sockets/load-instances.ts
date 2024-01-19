import type { Socket } from "socket.io";
import fs from "fs";
import path from "path";
import { Instance, Env, PackageJson } from "../../types/types";
import { default as findProcess } from "find-process";
import dotenv from "dotenv";
import GetPlatformStorageDirectory from "../util/directories";
import { GetLatestVersion } from "../util/version";

export default function HandleLoadInstances(socket: Socket) {
    async function sendInstances() {
        const instanceStore = JSON.parse(
            fs
                .readFileSync(
                    path.resolve(process.cwd(), "data/instances.json")
                )
                .toString()
        );

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
                    api: await findProcess(
                        "port",
                        parseInt(env.PORT_API as string)
                    ).then((res) => res.length > 0),
                    client: await findProcess(
                        "port",
                        parseInt(env.PORT_CLIENT as string)
                    ).then((res) => res.length > 0),
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
