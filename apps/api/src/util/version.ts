import axios from "axios";

let latestVersion: string;

export function GetLatestVersion() {
    return latestVersion || "ERROR";
}

export async function StartVersionCheck() {
    try {
        const { data } = await axios.get(
            "https://api.github.com/repos/SnailyCAD/snaily-cadv4/releases/latest"
        );
        latestVersion = data.tag_name;
    } catch (e) {
        console.log(`Failed to check version: ${e}`);
    }
    setTimeout(StartVersionCheck, 1000 * 60 * 60); //? 1 hour
}
