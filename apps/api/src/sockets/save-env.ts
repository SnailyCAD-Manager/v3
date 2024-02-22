import type { LogData } from "@scm/types";
import { default as styles } from "ansi-colors";
import ansi_to_html from "ansi-to-html";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import type { Socket } from "socket.io";
import ManageDatabase from "../util/database";

const ansi = new ansi_to_html();

export default function HandleSaveEnv(socket: Socket) {
	socket.on("server:save-env", async (data) => {
		const { id, env } = data;
		const instance = await ManageDatabase.instances.getInstance(id);
		const instancePath = path.resolve(instance.path);
		dotenv.config({
			path: path.resolve(instancePath, ".env"),
		});

		const currentEnv = dotenv.parse(
			fs.readFileSync(path.resolve(instancePath, ".env")),
		);

		const newEnv = {
			...currentEnv,
			...env,
		};

		const envString = Object.entries(newEnv)
			.map(([key, value]) => `${key}="${value}"`)
			.join("\n");

		fs.writeFileSync(path.resolve(instancePath, ".env"), envString);

		socket.emit("instance-log", {
			id,
			log: ansi.toHtml(
				`${styles.green("Successfully saved environment variables.")}`,
			),
			type: "stdout",
		} as LogData);
	});
}
