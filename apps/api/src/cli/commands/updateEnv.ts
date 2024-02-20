import chalk from "chalk";
import dotenv from "dotenv";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import ora from "ora";
import path from "path";
import { ManageDatabase } from "../../exports";

export async function commandEnv(args: any) {
    const envPath = path.join(
        (await ManageDatabase.instances.getInstance(args.instance)).path,
        ".env"
    );
    const envExists = existsSync(envPath);
    if (!envExists) {
        console.log("No env file found");
        return;
    }

    if ("s" in args && "g" in args) {
        console.log(
            chalk.redBright("You can't set and get at the same time, duh.")
        );
        return;
    }

    if ("s" in args) {
        if (!args.s.includes("=")) {
            console.log(
                chalk.redBright(
                    "The set argument must be in the format of KEY=VALUE"
                )
            );
            return;
        }

        const [key, value] = args.s.split("=");
        const env = dotenv.config({ path: envPath }).parsed;
        env![key] = value;
        const newEnv = Object.entries(env!)
            .map(([key, value]) => `${key}=${value}`)
            .join("\n");

        const spinner = ora("Updating .env file").start();
        await fs.writeFile(envPath, newEnv);
        spinner.succeed("Updated .env file");
    }

    if ("g" in args) {
        const env = dotenv.config({ path: envPath }).parsed;
        if (args.g) {
            if (!env![args.g]) {
                console.log(chalk.redBright("Key not found"));
                return;
            }

            if (env![args.g]) {
                console.log(chalk.gray(`${args.g}=${env![args.g]}`));
                return;
            }
        }

        if (!args.g) {
            console.log(
                chalk.gray(
                    Object.entries(env!)
                        .map(([key, value]) => `${key}=${value}`)
                        .join("\n")
                )
            );
            return;
        }
    }
}
