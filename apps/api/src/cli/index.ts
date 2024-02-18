#!/usr/bin/env node

import { Command } from "commander";
import commandUpdate from "./commands/update";
import commandPasswordReset from "./commands/passwordReset";

const program = new Command();

program.version("v3.0.0");

program
    .command("update")
    .description("Update SnailyCAD Manager to the latest version.")
    .action(commandUpdate);

program
    .command("password-reset")
    .description('Reset default "admin" password.')
    .action(async () => {
        await commandPasswordReset();
    });

program.parse(process.argv);
