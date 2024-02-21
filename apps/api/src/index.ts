import cors from "cors";
import express from "express";
import fs from "fs";
import http from "http";
import { fileURLToPath } from "node:url";
import path from "path";
import { Server } from "socket.io";
import HandleAllSockets from "./sockets";
import ManageDatabase from "./util/database";
import GetPlatformStorageDirectory from "./util/directories";
import Startup from "./util/internal/startup";
import { StartVersionCheck } from "./util/version";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

let settings: { port: number } | null = null;
let _updateAvailable: boolean = false;

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
    if (!fs.existsSync(path.resolve(__dirname, "../data/settings.json"))) {
        await fs.promises.writeFile(
            path.resolve(__dirname, "../data/settings.json"),
            `{"port": "60120"}`,
            "utf-8"
        );
    }

    if (!fs.existsSync(GetPlatformStorageDirectory())) {
        await fs.promises.mkdir(GetPlatformStorageDirectory());
    }
    // #endregion

    // #region Check for Settings Updates
    const defaultSettings = JSON.parse(
        await fs.promises.readFile(
            path.resolve(__dirname, "../data/settings.default.json"),
            "utf-8"
        )
    );
    const currentSettings = JSON.parse(
        await fs.promises.readFile(
            path.resolve(__dirname, "../data/settings.json"),
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
            path.resolve(__dirname, "../data/settings.json"),
            JSON.stringify(currentSettings, null, 4)
        );
    }
    // #endregion

    // #region Set Settings
    settings = JSON.parse(
        await fs.promises.readFile(
            path.resolve(__dirname, "../data/settings.json"),
            "utf-8"
        )
    );
    // #endregion

    // #region Serve client and API
    app.use(express.static(path.resolve(__dirname, "../../client/dist")));

    app.get("/", (_, res) => {
        res.sendFile(path.resolve(__dirname, "../../client/dist/index.html"));
    });

    app.post("/api/update", async (req, res) => {
        updateAvailable(req.body.toggle);
    });
    // #endregion

    // #region Socket.io
    io.on("connection", (socket) => {
        HandleAllSockets(socket);

        socket.on("disconnect", () => {
            socket.removeAllListeners();
        });
    });

    io.setMaxListeners(20);
    // #endregion

    // #region Start Server
    server.listen(settings?.port, () => {
        console.log(`Server listening on port ${settings?.port}`);
    });
    // #endregion

    // #region Start Version Check
    await StartVersionCheck();
    // #endregion

    // #region Startup Logic
    await Startup();
    // #endregion
}

initAPI();

export function updateAvailable(toggle?: boolean) {
    if (toggle !== undefined) {
        _updateAvailable = toggle;
    }

    return _updateAvailable;
}
