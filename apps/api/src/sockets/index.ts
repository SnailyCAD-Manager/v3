import { Socket } from "socket.io";
import HandleCreateInstance from "./create-instance";
import HandleLoadInstances from "./load-instances";
import HandleStartInstance from "./start-instance";
import HandleSaveEnv from "./save-env";
import HandleStopInstance from "./stop-instance";
import HandleCommands from "./cmd-instance";
import HandleDeleteInstance from "./delete-instance";
import HandleInstanceSettings from "./instance-settings";

export default function HandleAllSockets(socket: Socket) {
    HandleCreateInstance(socket);
    HandleLoadInstances(socket);
    HandleStartInstance(socket);
    HandleSaveEnv(socket);
    HandleStopInstance(socket);
    HandleCommands(socket);
    HandleDeleteInstance(socket);
    HandleInstanceSettings(socket);

    process.on("uncaughtException", (err) => {
        socket.emit("error", err.toString());
    });
}
