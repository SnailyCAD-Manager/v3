import { defineConfig } from "tsup";

export default defineConfig({
    entryPoints: ["src/**/*.ts"],
    format: ["cjs", "esm"],
    treeshake: true,
    dts: true,
    clean: true,
    sourcemap: true,
    minify: true,
    splitting: false,
    target: "node14",
});
