type Command = {
    command: string;
    args: string[];
};

export type CommandTree = {
    [key: string]: Command | CommandTree;
};

const commands: CommandTree = {
    install: {
        clone: {
            command: "git",
            args: [
                "clone",
                "https://github.com/SnailyCAD/snaily-cadv4.git",
                ".",
            ],
        },
        deps: {
            command: "pnpm",
            args: [
                "install",
                "--config.confirmModulesPurge=false",
                "--prod=false",
            ],
        },
        copyEnv: {
            command: "node",
            args: ["scripts/copy-env.mjs", "--client", "--api"],
        },
    },
    start: {
        withBuild: {
            command: "pnpm",
            args: ["run", "build", "&&", "pnpm", "run", "start"],
        },
        withoutBuild: {
            command: "pnpm",
            args: ["run", "start"],
        },
    },
};

export default commands as CommandTree;
