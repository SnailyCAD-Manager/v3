import chalk from "chalk";
import ManageDatabase from "../../util/database";
export default async function commandPasswordReset() {
    const password = generateString(10);
    console.log(chalk.bold("Temporary admin password: ") + password);
    await ManageDatabase.users.resetPassword("admin", password);
}

function generateString(length: number) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}
