import type { CommandTree, Env } from "@scm/types";
import axios from "axios";
import { spawn } from "child_process";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import type { Socket } from "socket.io";
import commands from "../util/commands";
import ManageDatabase from "../util/database";
import GetPlatformStorageDirectory from "../util/directories";

export default function HandleCreateInstance(socket: Socket) {
	const installCommands = commands.install as CommandTree;

	socket.on("server:create-instance", async (data) => {
		const { name, id } = data;
		const { data: ipData } = await axios.get(
			"https://api.ipify.org?format=json",
		);

		if (data.useExisting) {
			const pathExists = fs.existsSync(data.existingPath);

			if (!pathExists) {
				socket.emit("create-instance-fail", "Path does not exist");

				return;
			}

			const packageJsonExists = fs.existsSync(
				path.resolve(data.existingPath, "package.json"),
			);

			if (!packageJsonExists) {
				socket.emit(
					"create-instance-fail",
					"Path does not contain a package.json",
				);

				return;
			}

			const packageJson = await fs.promises.readFile(
				path.resolve(data.existingPath, "package.json"),
				"utf-8",
			);

			const isSnaily = JSON.parse(packageJson).name === "snailycad";

			if (!isSnaily) {
				socket.emit(
					"create-instance-fail",
					"Path does not contain a SnailyCAD instance",
				);

				return;
			}

			if (!fs.existsSync(path.resolve(data.existingPath, ".env"))) {
				socket.emit(
					"create-instance-fail",
					"Path does not contain a .env file (required for SnailyCAD)",
				);

				return;
			}

			await ManageDatabase.instances.addInstance({
				id,
				name,
				path: data.existingPath,
				settings: {
					autoRestart: {
						enabled: false,
						maxRestarts: 0,
					},
					autoUpdate: {
						enabled: true,
					},
					crashDetection: {
						enabled: false,
					},
					onStartup: {
						enabled: false,
					},
				},
			});

			socket.emit("create-instance-success");

			return;
		}

		function cloneRepo() {
			fs.mkdirSync(path.resolve(GetPlatformStorageDirectory(), id));

			const cloneProcess = spawn(
				installCommands.clone.command as string,
				[...(installCommands.clone.args as string[]), "--progress"],
				{
					cwd: path.resolve(GetPlatformStorageDirectory(), id),
					stdio: "pipe",
				},
			);

			cloneProcess.stdout.on("data", (data) => {
				socket.emit("create-instance-stdout", data.toString());
			});

			cloneProcess.stderr.on("data", (data) => {
				socket.emit("create-instance-stdout", data.toString()); //? Because git clone outputs to stderr in 99% of cases.
			});

			cloneProcess.on("close", (code) => {
				if (code === 0) {
					socket.emit(
						"create-instance-stdout",
						"Cloned repo successfully",
					);

					fs.copyFileSync(
						path.resolve(
							GetPlatformStorageDirectory(),
							id,
							".env.example",
						),
						path.resolve(GetPlatformStorageDirectory(), id, ".env"),
					);

					dotenv.config({
						path: path.resolve(
							GetPlatformStorageDirectory(),
							id,
							".env",
						),
					});
					const env = dotenv.parse(
						fs.readFileSync(
							path.resolve(
								GetPlatformStorageDirectory(),
								id,
								".env",
							),
						),
					) as Env;
					env.CORS_ORIGIN_URL = `http://${
						ipData.ip || "192.168.x.x"
					}:3000`;
					env.NEXT_PUBLIC_CLIENT_URL = `http://${
						ipData.ip || "192.168.x.x"
					}:3000`;
					env.NEXT_PUBLIC_PROD_ORIGIN = `http://${
						ipData.ip || "192.168.x.x"
					}:8080/v1`;

					const envString = Object.entries(env)
						.map(([key, value]) => `${key}="${value}"`)
						.join("\n");
					fs.writeFileSync(
						path.resolve(GetPlatformStorageDirectory(), id, ".env"),
						envString,
					);

					installDeps();
				} else {
					socket.emit("create-instance-fail", "Failed to clone repo");
				}
			});
		}

		function installDeps() {
			const depsProcess = spawn(
				installCommands.deps.command as string,
				installCommands.deps.args as string[],
				{
					cwd: path.resolve(GetPlatformStorageDirectory(), id),
					stdio: "pipe",
				},
			);

			depsProcess.stdout.on("data", (data) => {
				socket.emit("create-instance-stdout", data.toString());
			});

			depsProcess.stderr.on("data", (data) => {
				socket.emit("create-instance-stderr", data.toString());
			});

			depsProcess.on("close", (code) => {
				if (code === 0) {
					socket.emit(
						"create-instance-stdout",
						"Installed dependencies successfully",
					);
					copyEnv();
				} else {
					socket.emit(
						"create-instance-fail",
						"Failed to install dependencies",
					);
				}
			});
		}

		function copyEnv() {
			const moveEnvProcess = spawn(
				installCommands.copyEnv.command as string,
				installCommands.copyEnv.args as string[],
				{
					cwd: path.resolve(GetPlatformStorageDirectory(), id),
					stdio: "pipe",
				},
			);

			moveEnvProcess.stdout.on("data", (data) => {
				socket.emit("create-instance-stdout", data.toString());
			});

			moveEnvProcess.stderr.on("data", (data) => {
				socket.emit("create-instance-stderr", data.toString());
			});

			moveEnvProcess.on("close", async (code) => {
				if (code === 0) {
					socket.emit(
						"create-instance-stdout",
						"Moved env files successfully",
					);
					await ManageDatabase.instances.addInstance({
						id,
						name,
						path: path.resolve(GetPlatformStorageDirectory(), id),
						settings: {
							autoRestart: {
								enabled: false,
								maxRestarts: 0,
							},
							autoUpdate: {
								enabled: true,
							},
							crashDetection: {
								enabled: false,
							},
							onStartup: {
								enabled: false,
							},
						},
					});
					socket.emit("create-instance-success");
				} else {
					socket.emit(
						"create-instance-fail",
						"Failed to move env files",
					);
				}
			});
		}

		if (fs.existsSync(path.resolve(GetPlatformStorageDirectory(), id))) {
			socket.emit("create-instance-fail", "Instance Already Exists");

			return;
		}

		cloneRepo();
	});
}
