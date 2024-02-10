import type { Socket } from "socket.io";
import type { StorageInstance } from "@scm/types";
import ManageDatabase from "../util/database";

export default function HandleInstanceSettings(socket: Socket) {
    socket.on(
        "server:update-instance-settings",
        async (data: StorageInstance) => {
            const instanceName = (
                await ManageDatabase.instances.getInstance(data.id)
            ).name;

            console.log(`Updating instance settings for ${instanceName}`);

            socket.emit("client:instance-settings-updated", data);

            ManageDatabase.instances.updateInstance({
                ...data,
                name: instanceName,
            });
        }
    );

    socket.on("server:fetch-instance-settings", async (id: string) => {
        const instance = await ManageDatabase.instances.getInstance(id);
        socket.emit("client:fetch-instance-settings", instance);
    });
}
