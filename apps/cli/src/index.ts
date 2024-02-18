#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import commandPasswordReset from "./commands/passwordReset";

program.description(chalk.bold("SnailyCAD Manager v3's CLI"));

program.option("-v, --version", "output the version number");

program
    .command("password-reset")
    .description("Create a temporary password for the default admin user.")
    .addHelpText("after", "\nExample: snailycad-cli password-reset")
    .action(commandPasswordReset);

program.parse(process.argv);
