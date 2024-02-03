import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import fs from "fs";
import HandleAllSockets from "./sockets";
import { exec } from "child_process";
import GetPlatformStorageDirectory from "./util/directories";
import { StartVersionCheck } from "./util/version";
import ManageDatabase from "./util/database";
import Startup from "./util/internal/startup";

let settings: { port: number } | null = null;
// #region Create App
const app = express();
app.use(cors());
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
// #endregion

async function initAPI() {
    await ManageDatabase.init(); // Initialize the database.

    // #region Create Files & Directories if they don't exist
    if (!fs.existsSync(path.resolve(process.cwd(), "data/settings.json"))) {
        await fs.promises.writeFile(
            path.resolve(process.cwd(), "data/settings.json"),
            `{"port": "60120"}`,
            "utf-8"
        );
        console.log("Created settings.json");
    }

    if (!fs.existsSync(GetPlatformStorageDirectory())) {
        await fs.promises.mkdir(GetPlatformStorageDirectory());
    }
    // #endregion

    // #region Check for Settings Updates
    const defaultSettings = JSON.parse(
        await fs.promises.readFile(
            path.resolve(process.cwd(), "data/settings.default.json"),
            "utf-8"
        )
    );
    const currentSettings = JSON.parse(
        await fs.promises.readFile(
            path.resolve(process.cwd(), "data/settings.json"),
            "utf-8"
        )
    );

    const isSettingsOutdated = Object.keys(defaultSettings).some(
        (key) => !currentSettings.hasOwnProperty(key)
    );

    if (isSettingsOutdated) {
        Object.keys(defaultSettings).forEach((key) => {
            if (!currentSettings.hasOwnProperty(key)) {
                currentSettings[key] = defaultSettings[key];
            }
        });

        await fs.promises.writeFile(
            path.resolve(process.cwd(), "data/settings.json"),
            JSON.stringify(currentSettings, null, 4)
        );
    }
    // #endregion

    // #region Set Settings
    settings = JSON.parse(
        await fs.promises.readFile(
            path.resolve(process.cwd(), "data/settings.json"),
            "utf-8"
        )
    );
    // #endregion

    // #region Serve client and API
    app.use(express.static(path.resolve(process.cwd(), "../client/dist")));

    app.get("/", (_, res) => {
        res.sendFile(path.resolve(process.cwd(), "../client/dist/index.html"));
    });
    // #endregion

    // #region Socket.io
    io.on("connection", (socket) => {
        console.log(`New Client: ${socket.id}`);

        HandleAllSockets(socket);

        socket.on("disconnect", () => {
            socket.removeAllListeners();
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    io.setMaxListeners(20);
    // #endregion

    // #region Start Server
    server.listen(settings?.port, () => {
        console.log(`Server listening on port ${settings?.port}`);
        openInBrowser();
    });
    // #endregion

    // #region Start Version Check
    await StartVersionCheck();
    // #endregion

    // #region Startup Logic
    console.log("Running startup logic...");
    await Startup();
    // #endregion
}

initAPI();

function openInBrowser() {
    if (process.env.NODE_ENV === "development") {
        exec(`start http://localhost:${settings?.port}`);
    }
}
