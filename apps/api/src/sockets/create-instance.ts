import type { Socket } from "socket.io";

export default function HandleCreateInstance(socket: Socket) {
    socket.on("create-instance", (data) => {});
}
