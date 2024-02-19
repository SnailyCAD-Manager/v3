#!/usr/bin/env node

import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import commandPasswordReset from "./commands/passwordReset";
import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "node:url";

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
    (yargs) => {
        yargs.option("length", {
            alias: "l",
            coerce: (arg) => Math.max(1, arg),
            type: "number",
            description: "The length of the password",
            default: 10,
        });
    },
    (argv) => {
        commandPasswordReset(argv.length as number);
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
