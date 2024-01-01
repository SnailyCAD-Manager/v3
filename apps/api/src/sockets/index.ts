import { Socket } from "socket.io";
import HandleCreateInstance from "./create-instance";

export default function HandleAllSockets(socket: Socket) {
    HandleCreateInstance(socket);
}
