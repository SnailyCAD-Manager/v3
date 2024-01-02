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
        moveEnv: {
            command: "node",
            args: ["scripts/move-env.js", "--client", "--api"],
        },
    },
};

export default commands as CommandTree;
