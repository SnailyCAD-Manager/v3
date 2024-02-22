import type { ResetDependenciesData } from "@scm/types";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import type { Socket } from "socket.io";
import { io } from "..";
import ManageDatabase from "../util/database";

export default function HandleResetDependencies(socket: Socket) {
	socket.on(
		"server:reset-dependencies",
		async (data: ResetDependenciesData) => {
			const { id } = data;
			const instance = await ManageDatabase.instances.getInstance(id);
			const instancePath = path.resolve(instance.path);

			try {
				await fs.promises.rm(
					path.resolve(instancePath, "node_modules"),
					{ recursive: true },
				);
				await fs.promises.rm(
					path.resolve(instancePath, "pnpm-lock.yaml"),
				);

				const resetProcess = spawn(
					"pnpm",
					[
						"install",
						"--config.confirmModulesPurge=false",
						"--prod=false",
					],
					{
						cwd: instancePath,
						stdio: "pipe",
						shell: true,
					},
				);

				resetProcess.stdout.on("data", (data: Buffer) => {
					io.emit("instance-log", {
						id,
						log: data.toString(),
						type: "stdout",
					});

					if (data.toString().includes(", done")) {
						socket.emit(
							"client:reset-dependencies",
							"Dependencies reset successfully. Make sure to re-build your instance.",
						);
					}
				});

				resetProcess.stderr.on("data", (data: Buffer) => {
					io.emit("instance-log", {
						id,
						log: data.toString(),
						type: "stderr",
					});

					if (data.toString().includes("ERR")) {
						socket.emit(
							"client:reset-dependencies",
							`Failed to reset dependencies: ${data.toString()}`,
						);
					}

					if (data.toString().includes("ERR")) {
						socket.emit(
							"client:reset-dependencies",
							`Failed to reset dependencies: ${data.toString()}`,
						);
					}
				});
			} catch (e) {
				socket.emit(
					"client:reset-dependencies",
					`Failed to reset dependencies: ${e}`,
				);
			}
		},
	);
}
