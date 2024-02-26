import { fileURLToPath } from "node:url";
import path from "path";
import { spawn } from "child_process";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function CommandStartManager() {
	const managePath = path.resolve(__dirname, "../../../../../");

	spawn("pnpm", ["run", "start"], {
		cwd: managePath,
		stdio: "inherit",
		detached: true,
		windowsHide: true,
	}).unref();
}
