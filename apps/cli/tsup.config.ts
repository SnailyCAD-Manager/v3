import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    splitting: false,
    sourcemap: true,
    clean: true,
    // DO NOT GENERATE TYPES FOR DEPENDENCIES
    external: [
        "ora",
        "chalk",
        "path",
        "fs",
        "child_process",
        "https",
        "os",
        "util",
    ],
});
