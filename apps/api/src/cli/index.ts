#!/usr/bin/env node

import { Command, Option } from "commander";
import commandUpdate from "./commands/update";
import commandPasswordReset from "./commands/passwordReset";
import commandUpdateEnv from "./commands/updateEnv";

const program = new Command();
const options = program.opts();

program
    .option("-v, --version", "output the version number")
    .option("-h, --help", "display help for command")
    .option("-u, --update", "update the app")
    .option("-p, --password-reset", "reset the password")
    .parse(process.argv);

program
    .command("env")
    .option("-r, --read", "Get a readout for all environment variables")
    .option("-s, --set <key> <value>", "Set an environment variable")
    .parse(process.argv)
    .action((options) => {
        if (options.read) {
            commandUpdateEnv();
        }
    });

if (options.update) {
    commandUpdate();
}

if (options.passwordReset) {
    commandPasswordReset();
}

if (options.version) {
    console.log(options.version);
}

if (options.help) {
    program.help();
}

if (!process.argv.slice(2).length) {
    program.help();
}
