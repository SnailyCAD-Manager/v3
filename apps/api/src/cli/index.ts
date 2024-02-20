#!/usr/bin/env node

import chalk from "chalk";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import commandPasswordReset from "./commands/passwordReset";
import commandSettings from "./commands/settings";
import { commandEnv } from "./commands/updateEnv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = JSON.parse(
    await fs.readFile(
        path.resolve(__dirname, "../../../../package.json"),
        "utf-8"
    )
);

const argv = yargs(hideBin(process.argv));
argv.version(packageJson.version);

argv.scriptName("").usage("Usage: scm <command> [options]").demandCommand(1);

argv.alias("h", "help");
argv.alias("v", "version");

argv.command(
    "password-reset",
    "Reset the admin password",
    (args) => {
        args.option("length", {
            alias: "l",
            coerce: (arg) => Math.max(1, arg),
            type: "number",
            description: "The length of the password",
            default: 10,
        });
    },
    (args) => {
        commandPasswordReset(args.length as number);
    }
);

argv.command(
    "env",
    "Read or set environment variables for the provided\ninstance ID",
    (args) => {
        args.option("instance", {
            alias: "i",
            type: "string",
            description: "The instance ID",
            demandOption: true,
        });
        args.option("set", {
            alias: "s",
            type: "string",
            description: "Set the environment variable",
        });
        args.option("get", {
            alias: "g",
            type: "string",
            description: "Read all environment variables or a specific one",
        });
    },
    async (args) => {
        await commandEnv(args);
    }
);

argv.command(
    "settings",
    "Read or set settings for the provided instance ID",
    (args) => {
        args.option("port", {
            alias: "p",
            type: "number",
            description: "Set the port",
        });
    },
    async (args) => {
        await commandSettings(args);
    }
);

argv.strict().fail((msg, err, yargs) => {
    if (err) throw err;
    console.error(chalk.redBright(msg));
    yargs.showHelp();
});

argv.showHelpOnFail(true, "Use --help for available options")
    .demandCommand(1, "You need at least one command before moving on")
    .help()
    .parse();
