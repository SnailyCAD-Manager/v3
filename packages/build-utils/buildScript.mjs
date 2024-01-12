import path from "path";
import fs from "fs";
import ora from "ora";
import copy from "copy";

const buildPath = path.resolve(process.cwd(), "../../build");

const clientPath = path.resolve(process.cwd(), "../../apps/client/dist");
const apiPath = path.resolve(process.cwd(), "../../apps/api/dist");
const cliPath = path.resolve(process.cwd(), "../../apps/cli/dist");

async function buildScript() {
    const doesBuildExist = fs.existsSync(buildPath);

    if (doesBuildExist) {
        const spinner = ora("Removing build folder").start();
        try {
            await fs.promises.rm(path.resolve(buildPath, "api"), {
                recursive: true,
            });
            await fs.promises.rm(path.resolve(buildPath, "client"), {
                recursive: true,
            });
            await fs.promises.rm(path.resolve(buildPath, "cli"), {
                recursive: true,
            });
            spinner.succeed();
        } catch (e) {
            spinner.fail("Failed to remove build folder");
            fs.writeFileSync(
                path.resolve(buildPath, "../build-error.txt"),
                e.toString()
            );
        }
    }

    const spinner = ora("Creating build folder").start();
    try {
        await fs.promises.mkdir(buildPath);
        spinner.succeed();
    } catch (e) {
        spinner.fail("Failed to create build folder");
        fs.writeFileSync(
            path.resolve(buildPath, "../build-error.txt"),
            e.toString()
        );
    }

    const clientSpinner = ora("Copying client build").start();
    if (!fs.existsSync(clientPath)) {
        clientSpinner.info("Client build does not exist — skipping");
    } else {
        copy(
            `${clientPath}/**/*`,
            path.resolve(buildPath, "client"),
            {},
            (err, files) => {
                if (err) {
                    clientSpinner.fail("Failed to copy client build");
                    fs.writeFileSync(
                        path.resolve(buildPath, "../build-error.txt"),
                        e.toString()
                    );
                } else {
                    clientSpinner.succeed();
                }
            }
        );
    }

    const apiSpinner = ora("Copying api build").start();
    if (!fs.existsSync(apiPath)) {
        apiSpinner.info("API build does not exist — skipping");
    } else {
        copy(
            `${apiPath}/**/*`,
            path.resolve(buildPath, "api"),
            {},
            (err, files) => {
                if (err) {
                    apiSpinner.fail("Failed to copy api build");
                    fs.writeFileSync(
                        path.resolve(buildPath, "../build-error.txt"),
                        e.toString()
                    );
                } else {
                    apiSpinner.succeed();
                }
            }
        );
    }

    const cliSpinner = ora("Copying cli build").start();
    if (!fs.existsSync(cliPath)) {
        cliSpinner.info("CLI build does not exist — skipping");
    } else {
        copy(
            `${cliPath}/**/*`,
            path.resolve(buildPath, "cli"),
            {},
            (err, files) => {
                if (err) {
                    cliSpinner.fail("Failed to copy cli build");
                    fs.writeFileSync(
                        path.resolve(buildPath, "../build-error.txt"),
                        e.toString()
                    );
                } else {
                    cliSpinner.succeed();
                }
            }
        );
    }
}

await buildScript();
