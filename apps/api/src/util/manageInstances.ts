import path from "path";
import fs from "fs";
import GetPlatformStorageDirectory from "./directories";
import type { Socket } from "socket.io";

export default class ManageInstances {
    static async deleteInstance(id: string, socket: Socket) {
        try {
            await fs.promises.rm(
                path.resolve(GetPlatformStorageDirectory(), id),
                {
                    recursive: true,
                }
            );

            const instancesJson = await fs.promises.readFile(
                path.resolve(process.cwd(), "data/instances.json"),
                "utf-8"
            );
            const instances = JSON.parse(instancesJson);
            const newInstances = instances.filter(
                (instance: any) => instance.id !== id
            );

            fs.promises.writeFile(
                path.resolve(process.cwd(), "data/instances.json"),
                JSON.stringify(newInstances)
            );

            socket.emit("instance-delete-complete");
        } catch (err) {
            socket.emit(
                "error",
                `Failed to delete instance: ${id}. (ERR: ${err})`
            );
            throw new Error(`Failed to delete instance: ${id}. (ERR: ${err})`);
        }
    }
}
