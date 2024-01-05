export type LogData = {
    id: string;
    log: string;
    type: "stdout" | "stderr" | "error";
};

export type StartData = {
    id: string;
    build: boolean;
};
