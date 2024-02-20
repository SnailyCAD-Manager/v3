import chalk from "chalk";
import ora from "ora";
import { ManageDatabase } from "../../exports";

export default async function commandPasswordReset(length: number) {
    const spinner = ora("Resetting admin password").start();
    const password = generateString(length);
    await ManageDatabase.users.resetPassword("admin", password);
    spinner.succeed(
        `Admin password reset to ${chalk.bold.greenBright(password)}`
    );
}

function generateString(length: number) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return result;
}
