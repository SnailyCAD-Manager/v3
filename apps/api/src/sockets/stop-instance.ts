import type { LogData } from "@scm/types";
import type { Socket } from "socket.io";
import { io } from "..";
import ManageProcess from "../util/manageProcess";

type StopData = {
	id: string;
};

let _manualStop = false;

export default function HandleStopInstance(socket: Socket) {
	socket.on("server:stop-instance", async (data: StopData) => {
		_manualStop = true;
		ManageProcess.killProcess(data.id);

		io.emit("instance-log", {
			id: data.id,
			log: `<span style="color: orange;>Instance ${data.id} stopped</span>`,
			type: "stdout",
		} as LogData);
	});
}

export function ManualStop(newVal?: boolean) {
	if (newVal !== undefined) {
		_manualStop = newVal;
	}

	return _manualStop;
}
