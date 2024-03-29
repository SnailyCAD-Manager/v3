import escapeStringRegexp from "escape-string-regexp";
import fs from "fs";
import ncp from "ncp";
import ora from "ora";
import path from "path";
import tar from "tar";

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

const remove = ["dist"];

const add = [
    "apps/api/data/database.db",
    "apps/api/data/settings.json",
    "apps/api/types",
    "apps/client/src/types",
    ".vscode",
    "README.md",
    "LICENSE",
    ".gitattributes",
    ".gitignore",
    ".github",
    ".npmrc",
    "SECURITY.md",
];

gitignorePatterns = gitignorePatterns.filter(
    (pattern) => !remove.includes(pattern)
);
gitignorePatterns = gitignorePatterns.concat(add);

const gitignoreRegex = new RegExp(
    `(${gitignorePatterns.join("|")}|yarn\\.lock|\\.git$|pnpm-lock\\.yaml)`
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
    async (err) => {
        if (err) {
            console.error("Error copying files:", err);
            process.exit(1);
        } else {
            spinner.succeed("Files copied successfully");
            await cleanUp();
        }
    }
);

async function cleanUp() {
    /* 
        !apps/api/data/database.db (file)    - Removed
        !apps/api/data/settings.json (file)  - Removed
    */

    const cleanupSpinner = ora("Cleaning up").start();
    await fs.promises.rm(path.resolve(buildPath, "apps/api/data/database.db"));
    await fs.promises.rm(
        path.resolve(buildPath, "apps/api/data/settings.json")
    );
    await fs.promises.rm(path.resolve(buildPath, "apps/api/src/"), {
        recursive: true,
    });
    await fs.promises.rm(path.resolve(buildPath, "apps/client/src/"), {
        recursive: true,
    });
    cleanupSpinner.succeed("Cleaned up");

    await gzipFiles();
}

async function gzipFiles() {
    const gzipSpinner = ora("Gzipping files").start();
    await tar.c(
        {
            gzip: true,
            file: path.resolve(buildPath, "linux.tar.gz"),
            cwd: buildPath,
            filter: (path, stat) => {
                return path !== "linux.tar.gz";
            },
        },
        ["./"]
    );
    gzipSpinner.succeed("Files gzipped successfully");
}
