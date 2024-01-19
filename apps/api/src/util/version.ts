import axios from "axios";

let latestVersion: string;

export function GetLatestVersion() {
    return latestVersion || "ERROR";
}

export async function StartVersionCheck() {
    const { data } = await axios.get(
        "https://raw.githubusercontent.com/SnailyCAD/snaily-cadv4/main/package.json"
    );
    latestVersion = data.version;
    setTimeout(StartVersionCheck, 1000 * 60 * 60);
}
