import { fileURLToPath } from "node:url";
import path from "path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import chalk from "chalk";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function commandSettings(args: any) {
    const settingsPath = path.resolve(__dirname, "../../data/settings.json");

    const settingsExists = existsSync(settingsPath);

    if (!settingsExists) {
        console.log("No settings found");
        return;
    }

    if (!("p" in args)) {
        const settings = JSON.parse(await fs.readFile(settingsPath, "utf-8"));
        console.log(settings);

        return;
    }

    if ("p" in args) {
        if (args.p !== undefined) {
            if (isNaN(args.p)) {
                console.log("Port must be a number");
                return;
            }

            const settings = JSON.parse(
                await fs.readFile(settingsPath, "utf-8")
            );
            settings["port"] = args.p || args.port;
            await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));

            console.log(`Port set to ${chalk.greenBright(args.p)}`);

            return;
        }

        const settings = JSON.parse(await fs.readFile(settingsPath, "utf-8"));
        console.log(
            `The current port is ${chalk.greenBright(settings.port)}. You can change it by passing the -p flag followed by the new port number.\nFor example: ${chalk.blueBright(
                "scm settings -p 60120"
            )}`
        );
    }
}
