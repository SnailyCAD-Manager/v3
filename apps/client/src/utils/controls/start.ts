import { getActiveInstance } from "@/hooks/useInstance";
import socket from "../socket";
import { notifications } from "@mantine/notifications";

export default function Start() {
    const id = getActiveInstance();
    socket.emit("start", id);
    notifications.show({
        title: "Starting",
        message: `Starting instance ${id}...`,
        color: "green",
    });
}
