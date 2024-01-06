import type { Socket } from "socket.io";
import path from "path";
import { spawn } from "child_process";
import commands, { CommandTree } from "../util/commands";
import ansi_to_html from "ansi-to-html";
import { LogData } from "../../types/types";

const ansi = new ansi_to_html();

type StartData = {
    id: string;
    build: boolean;
};

export default function HandleStartInstance(socket: Socket) {
    socket.on("server:start-instance", async (data: StartData) => {
        const proc = spawn("echo", ["Hello world!"], {
            cwd: path.resolve(process.cwd(), "data/instances", data.id),
            shell: true,
        });

        proc.stdout.on("data", (data) => {
            socket.emit("instance-log", {
                id: data.id,
                log: ansi.toHtml(data.toString()),
                type: "stdout",
            } as LogData);

            console.log(data.toString());
        });

        proc.stderr.on("data", (data) => {
            socket.emit("instance-log", {
                id: data.id,
                log: ansi.toHtml(data.toString()),
                type: "stderr",
            } as LogData);

            console.log(data.toString());
        });

        proc.on("close", (code) => {
            socket.emit("instance-log", {
                id: data.id,
                log: ansi.toHtml(`Process exited with code ${code}`),
                type: "stdout",
            } as LogData);

            console.log(`Process exited with code ${code}`);
        });
    });
}
