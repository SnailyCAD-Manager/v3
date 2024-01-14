import path from "path";
export default function GetPlatformStorageDirectory() {
    switch (process.platform) {
        case "win32":
            return path.resolve(process.env.APPDATA as string, "scm-instances");
        case "linux":
            return path.resolve(process.env.HOME as string, ".scm-instances");
        default:
            throw new Error("Unsupported platform");
    }
}
