import { Socket } from "socket.io";
import HandleCommands from "./cmd-instance";
import HandleCreateInstance from "./create-instance";
import HandleDeleteInstance from "./delete-instance";
import HandleInstanceSettings from "./instance-settings";
import HandleLoadInstances from "./load-instances";
import HandleResetDependencies from "./reset-dependencies";
import HandleSaveEnv from "./save-env";
import HandleStartInstance from "./start-instance";
import HandleStopInstance from "./stop-instance";
import HandleUpdateInstance from "./update-instance";
import HandleUser from "./user";
import HandleUpdateManager from "./manager-update";

export default function HandleAllSockets(socket: Socket) {
    HandleCreateInstance(socket);
    HandleLoadInstances(socket);
    HandleStartInstance(socket);
    HandleSaveEnv(socket);
    HandleStopInstance(socket);
    HandleCommands(socket);
    HandleDeleteInstance(socket);
    HandleInstanceSettings(socket);
    HandleUpdateInstance(socket);
    HandleResetDependencies(socket);
    HandleUser(socket);
    HandleUpdateManager(socket);

    process.on("uncaughtException", (err) => {
        socket.emit("error", err.toString());
    });
}
