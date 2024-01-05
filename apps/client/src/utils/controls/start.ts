import { getActiveInstance } from "@/hooks/useInstance";
import socket from "../socket";
import { StartData } from "@/types/socket";

export default function Start() {
    const id = getActiveInstance();
    socket.emit("start-instance", {
        id,
        build: true,
    } as StartData);
}
