type Command = {
    command: string;
    args: string[];
};

type CommandTree = {
    [key: string]: Command | CommandTree;
};

const command: CommandTree = {
    install: {
        clone: {
            command: "git",
            args: [
                "clone",
                "https://github.com/SnailyCAD/snaily-cadv4.git",
                ".",
            ], //? I use . because it'll go into the instance dir on install (src/sockets/creat-instance.ts)
        },
        deps: {
            command: "pnpm",
            args: ["install", "--config.confirmModulesPurge=false"],
        },
        moveEnv: {
            command: "node",
            args: ["scripts/move-env.js", "--client", "--api"],
        },
    },
};
