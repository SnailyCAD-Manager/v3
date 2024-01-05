import { Socket } from "socket.io";
import HandleCreateInstance from "./create-instance";
import HandleLoadInstances from "./load-instances";

export default function HandleAllSockets(socket: Socket) {
    HandleCreateInstance(socket);
    HandleLoadInstances(socket);
}
