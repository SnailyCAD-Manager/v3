import type { Socket } from "socket.io";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function HandleUpdateManager(socket: Socket) {
    socket.on("server:update-manager", () => {
        spawn("node", ["scripts/update.mjs"], {
            cwd: path.resolve(__dirname, "../../../../"),
            detached: true,
            stdio: "ignore",
            shell: true,
        }).unref();
    });
}
