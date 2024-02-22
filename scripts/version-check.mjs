import { compareVersions } from "compare-versions";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let firstRun = true;

async function main() {
	let latest;

	if (firstRun) {
		await delay(30e3); // Wait 30 seconds before checking for updates (to allow the server to start up)
		firstRun = false;
	}

	try {
		const { data } = await axios.get(
			`https://raw.githubusercontent.com/SnailyCAD-Manager/versions/main/manager?_=${Date.now()}`,
		);
		latest = data;

		const packageJson = JSON.parse(
			await fs.readFile(
				path.resolve(__dirname, "../package.json"),
				"utf-8",
			),
		);

		const result = compareVersions(latest, packageJson.version);

		if (result === 1) {
			console.log("New version available!");
			const { port } = JSON.parse(
				await fs.readFile(
					path.resolve(__dirname, "../apps/api/data/settings.json"),
					"utf-8",
				),
			);

			await axios.post(`http://localhost:${port}/api/update`, {
				toggle: true,
			});
		} else {
			console.log("You are on the latest version.");
		}

		console.log(
			`Version check completed at ${new Date().toLocaleString()}. Latest version: ${latest} | Current version: ${packageJson.version}`,
		);

		// await delay(1000 * 60 * 60); // Check for updates every 1 hour
		await delay(1000 * 60); // Check for updates every 1 minute
		return main();
	} catch (e) {
		console.error("Failed to check for updates:", e);

		await delay(1000 * 60 * 60); // Retry after 1 hour
		return main();
	}
}

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

main();
