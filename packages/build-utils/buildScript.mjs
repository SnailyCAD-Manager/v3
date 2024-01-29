import fs from "fs";
import path from "path";
import ora from "ora";
import ncp from "ncp";
import escapeStringRegexp from "escape-string-regexp";

const rootPath = path.resolve(process.cwd(), "../../");
const buildPath = path.resolve(rootPath, "build");
const gitignorePath = path.resolve(rootPath, ".gitignore");

let gitignorePatterns;
try {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
    gitignorePatterns = gitignoreContent
        .split(/\r?\n/)
        .filter((line) => line.trim() !== "" && !line.trim().startsWith("#"))
        .map(escapeStringRegexp);
} catch (error) {
    console.error("Error reading .gitignore:", error);
    process.exit(1);
}

if (!fs.existsSync(buildPath)) {
    const createBuildPathSpinner = ora("Creating build directory").start();
    await fs.promises.mkdir(buildPath);
    createBuildPathSpinner.succeed("Build directory created");
} else {
    const clearBuildPathSpinner = ora("Clearing build directory").start();
    await fs.promises.rm(buildPath, { recursive: true });
    await fs.promises.mkdir(buildPath);
    clearBuildPathSpinner.succeed("Build directory cleared");
}

const gitignoreRegex = new RegExp(
    `(${gitignorePatterns.join("|")}|yarn\\.lock|\\.git$)`
);

const spinner = ora("Copying files").start();
ncp(
    rootPath,
    buildPath,
    {
        filter: (source) => {
            const relativePath = path.relative(rootPath, source);
            const shouldCopy = !gitignoreRegex.test(relativePath);
            if (!shouldCopy) {
                spinner.text = `Skipping: ${relativePath}`;
            }
            return shouldCopy;
        },
        stopOnErr: true,
        limit: 16,
    },
    (err) => {
        if (err) {
            console.error("Error copying files:", err);
            process.exit(1);
        } else {
            spinner.succeed("Files copied successfully");
            cleanUp();
        }
    }
);

async function cleanUp() {
    const cleanUpSpinner = ora("Cleaning up").start();
    /* 
        !apps/api/data/database.db (file)    - Removed
        !apps/api/data/settings.json (file)  - Removed
        !apps/api/types (directory)          - Removed
        !apps/client/src/types (directory)   - Removed
    */
    await fs.promises.rm(path.resolve(buildPath, "apps/api/data/database.db"), {
        force: true,
    });
    await fs.promises.rm(
        path.resolve(buildPath, "apps/api/data/settings.json"),
        {
            force: true,
        }
    );
    await fs.promises.rm(path.resolve(buildPath, "apps/api/types"), {
        recursive: true,
    });
    await fs.promises.rm(path.resolve(buildPath, "apps/client/src/types"), {
        recursive: true,
    });
    cleanUpSpinner.succeed("Clean up complete");
}
