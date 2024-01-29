import type { Socket } from "socket.io";
import { StorageInstance } from "../../types/types";
import ManageDatabase from "../util/database";
import { io } from "..";

export default function HandleInstanceSettings(socket: Socket) {
    socket.on("server:update-instance-settings", (data: StorageInstance) => {
        ManageDatabase.instances.updateInstance(data);
        io.emit("client:update-instance-settings", data);
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
