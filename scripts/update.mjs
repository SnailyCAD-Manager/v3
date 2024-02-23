import axios from "axios";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import StreamZip from "node-stream-zip";
import kill from "kill-port";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
	try {
		const { port } = JSON.parse(
			await fs.promises.readFile(
				path.resolve(__dirname, "../apps/api/data/settings.json"),
				"utf-8",
			),
		);

		await new Promise((resolve, reject) => {
			const isWindows = process.platform === "win32";

			if (isWindows) {
				try {
					kill(port, "tcp");
					resolve();
				} catch (e) {
					console.error("Failed to kill SnailyCAD Manager.");
					reject(e);
				}
			} else {
				const kill = spawn("systemctl", ["stop", "snailycad-manager"], {
					shell: true,
					stdio: "inherit",
				});

				kill.on("exit", (code) => {
					if (code === 0) {
						resolve();
					} else {
						reject(new Error("Failed to kill SnailyCAD Manager."));
					}
				});
			}
		});

		await new Promise(async (resolve, reject) => {
			const download = await axios({
				url: "https://github.com/SnailyCAD-Manager/manager/releases/latest/download/update.zip",
				method: "GET",
				responseType: "stream",
			});

			download.data.pipe(
				fs.createWriteStream(path.resolve(__dirname, "../update.zip")),
			);

			download.data.on("end", () => {
				resolve();
			});
		});

		await new Promise((resolve, reject) => {
			const zip = new StreamZip({
				file: path.resolve(__dirname, "../update.zip"),
				storeEntries: true,
			});

			zip.on("ready", () => {
				zip.extract(null, path.resolve(__dirname, "../"), (err) => {
					if (err) {
						console.error("Failed to extract update.zip:", err);
						process.exit(1);
					}

					zip.close();
					resolve();
				});
			});

			zip.on("error", (err) => {
				console.error("Failed to extract update.zip:", err);
				reject(err);
			});
		});

		await fs.promises.unlink(path.resolve(__dirname, "../update.zip"));

		await new Promise((resolve, reject) => {
			const installDependencies = spawn(
				"pnpm",
				[
					"install",
					"--config.confirmModulesPurge=false",
					"--prod=false",
				],
				{
					shell: true,
					stdio: "inherit",
					windowsHide: true,
					cwd: path.resolve(__dirname, "../"),
				},
			);

			installDependencies.on("exit", (code) => {
				if (code === 0) {
					resolve();
				} else {
					reject(new Error("Failed to install dependencies."));
				}
			});
		});

		spawn("pnpm", ["run", "start"], {
			shell: true,
			stdio: "inherit",
			detached: true,
			cwd: path.resolve(__dirname, "../"),
		});
	} catch (e) {
		console.error("Failed to update:", e.message);
	}
}

main();
