import type { Socket } from "socket.io";
import fs from "fs";
import path from "path";
import { Instance, Env } from "../../types/types";
import { default as findProcess } from "find-process";

export default function HandleLoadInstances(socket: Socket) {
    function sendInstances() {
        const instances: { name: string; id: string }[] = JSON.parse(
            fs
                .readFileSync(
                    path.resolve(process.cwd(), "data/instances/instances.json")
                )
                .toString()
        );

        const instancesData: Instance[] = [];

        instances.forEach(async (instance) => {
            console.log(instance.name);
            const env = fs
                .readFileSync(
                    path.resolve(
                        process.cwd(),
                        "data/instances",
                        instance.id,
                        ".env"
                    )
                )
                .toString();
            const envParsed: Env = env.split("\n").reduce((acc, line) => {
                const [key, value] = line.split("=");
                return { ...acc, [key]: value };
            }, {} as Env);

            const clientStatus = await findProcess(
                "port",
                parseInt(envParsed.PORT_CLIENT!)
            );
            const apiStatus = await findProcess(
                "port",
                parseInt(envParsed.PORT_API!)
            );

            instancesData.push({
                name: instance.name,
                id: instance.id,
                logs: [],
                env: envParsed,
                status: {
                    api: apiStatus.length > 0,
                    client: clientStatus.length > 0,
                },
            });
        });

        socket.emit("load-instances", instancesData);

        // Do this every 5 seconds
        setTimeout(sendInstances, 5000);
    }

    sendInstances();
}
