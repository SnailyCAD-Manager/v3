#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import commandPasswordReset from "./commands/passwordReset";

program.version("0.0.1").description(chalk.bold("SnailyCAD Manager v3's CLI"));

program
    .command("password-reset")
    .description("Create a temporary password for the default admin user.")
    .action(commandPasswordReset);

program.parse(process.argv);
