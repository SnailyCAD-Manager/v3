import axios from "axios";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import { StreamZipAsync } from "node-stream-zip";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    try {
        const { port } = JSON.parse(
            await fs.promises.readFile(
                path.resolve(__dirname, "../apps/api/data/settings.json"),
                "utf-8"
            )
        );

        await new Promise((resolve, reject) => {
            const isWindows = process.platform === "win32";

            if (isWindows) {
                const kill = spawn("npx", ["kill-port", port], {
                    shell: true,
                    stdio: "inherit",
                });

                kill.on("exit", (code) => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(new Error("Failed to kill port."));
                    }
                });
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
                url: "github.com/SnailyCAD-Manager/manager/releases/latest/download/update.zip",
                method: "GET",
                responseType: "stream",
            });

            download.data.pipe(
                fs.createWriteStream(path.resolve(__dirname, "../update.zip"))
            );

            download.data.on("end", () => {
                resolve();
            });
        });

        const zip = new StreamZipAsync({
            file: path.resolve(__dirname, "../update.zip"),
            storeEntries: true,
        });

        await zip.extract(null, path.resolve(__dirname, "../"));
        await zip.close();

        await fs.promises.unlink(path.resolve(__dirname, "../update.zip"));

        await new Promise((resolve, reject) => {
            const installDependencies = spawn("pnpm", ["install"], {
                shell: true,
                stdio: "inherit",
                cwd: path.resolve(__dirname, "../"),
            });

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
