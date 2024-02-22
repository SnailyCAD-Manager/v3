import { defineConfig } from "tsup";

export default defineConfig({
	entryPoints: ["src/**/*.ts"],
	format: ["esm"],
	treeshake: true,
	dts: true,
	clean: true,
	sourcemap: true,
	minify: true,
	splitting: false,
	target: "esnext",
});
