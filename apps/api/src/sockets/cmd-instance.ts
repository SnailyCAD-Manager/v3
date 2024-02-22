import type { CommandData, LogData } from "@scm/types";
import { spawn } from "child_process";
import path from "path";
import type { Socket } from "socket.io";
import { io } from "../index";
import ManageDatabase from "../util/database";

export default function HandleCommands(socket: Socket) {
	socket.on("server:command", async (data: CommandData) => {
		const instance = await ManageDatabase.instances.getInstance(data.id);

		try {
			const commandProcess = spawn(
				data.command.split(" ")[0],
				data.command.split(" ").slice(1),
				{
					cwd: path.resolve(instance.path),
					shell: true,
					stdio: "pipe",
				},
			);

			commandProcess.stdout.on("data", (stdout) => {
				io.emit("instance-log", {
					id: data.id,
					log: stdout.toString(),
					type: "stdout",
				} as LogData);
			});

			commandProcess.stderr.on("data", (stderr) => {
				io.emit("instance-log", {
					id: data.id,
					log: stderr.toString(),
					type: "stderr",
				} as LogData);
			});

			commandProcess.on("close", (code) => {
				io.emit("instance-log", {
					id: data.id,
					log: `Command exited with code ${code}`,
					type: "console",
				} as LogData);
			});
		} catch (err: any) {
			io.emit("instance-log", {
				id: data.id,
				log: err.toString(),
				type: "stderr",
			} as LogData);
		}
	});
}
