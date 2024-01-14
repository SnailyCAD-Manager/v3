const invalidTerminalCommands = [
    "rm",
    "rmdir",
    "del",
    "rm -rf",
    "rm -rf /",
    "rm -rf /*",
    "rm -rf .",
    "rm -rf ./*",
    "rm -rf *",
    "rm -rf *.*",
    "rm -rf *",
    "rm -rf *.*",
    "rm -rf /",
    "rm -rf /*",

    "sudo rm -rf /",
    "sudo rm -rf /*",
    "sudo rm -rf .",
    "sudo rm -rf ./*",
    "sudo rm -rf *",
    "sudo rm -rf *.*",
    "sudo rm -rf *",
    "sudo rm -rf *.*",
    "sudo rm -rf /",
    "sudo rm -rf /*",
];

export default invalidTerminalCommands;
