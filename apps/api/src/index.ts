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

let settings: any = null;

async function initAPI() {
    // #region Create Files & Directories if they don't exist
    if (!fs.existsSync(path.resolve(process.cwd(), "data/settings.json"))) {
        await fs.promises.writeFile(
            path.resolve(process.cwd(), "data/settings.json"),
            await fs.promises.readFile(
                path.resolve(process.cwd(), "data/settings.default.json")
            )
        );
    }

    if (!fs.existsSync(path.resolve(process.cwd(), "data/instances.json"))) {
        await fs.promises.writeFile(
            path.resolve(process.cwd(), "data/instances.json"),
            "[]"
        );
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

    // #region Create App
    const app = express();
    app.use(cors());
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });
    // #endregion

    // #region Serve client and API
    app.use(express.static(path.resolve(process.cwd(), "../client")));

    app.get("/", (req, res) => {
        res.sendFile(path.resolve(process.cwd(), "../client/index.html"));
    });
    // #endregion

    // #region Socket.io
    io.on("connection", (socket) => {
        console.log(`New Client: ${socket.id}`);

        HandleAllSockets(socket);

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    io.setMaxListeners(20);
    // #endregion

    // #region Start Server
    server.listen(settings.port, () => {
        console.log(`Server listening on port ${settings.port}`);
        openInBrowser();
    });
    // #endregion

    // #region Start Version Check
    StartVersionCheck();
    // #endregion
}

initAPI();

function openInBrowser() {
    if (process.env.NODE_ENV === "development") {
        exec(`start http://localhost:${settings.port}`);
    }
}
