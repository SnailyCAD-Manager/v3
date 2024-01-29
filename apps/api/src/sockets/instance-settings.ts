import type { Socket } from "socket.io";
import { StorageInstance } from "../../types/types";
import ManageDatabase from "../util/database";
import { io } from "..";

export default function HandleInstanceSettings(socket: Socket) {
    socket.on("server:update-instance-settings", (data: StorageInstance) => {
        const instanceName = ManageDatabase.instances.getInstance(data.id).name;

        console.log(`Updating instance settings for ${instanceName}`);

        socket.emit("client:instance-settings-updated", data);

        ManageDatabase.instances.updateInstance({
            ...data,
            name: instanceName,
        });
    });

    socket.on("server:fetch-instance-settings", (id: string) => {
        const instance = ManageDatabase.instances.getInstance(id);
        socket.emit("client:fetch-instance-settings", instance);
    });
}

function IsParsedJSON(data: any) {
    try {
        JSON.parse(data);
        return true;
    } catch (e) {
        return false;
    }
}
