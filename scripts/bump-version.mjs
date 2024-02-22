// Bump Version Script
// Should bump the version in root package.json and in packages/*/package.json and apps/*/package.json

import fs from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { format } from "prettier";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rootPackagePath = resolve(__dirname, "../package.json");
const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, "utf8"));

const [, , version] = process.argv;

if (!version) {
	console.error("Version is required.");
	process.exit(1);
}

rootPackage.version = version;
const rootPackageFormatted = await formatAndWriteFile(rootPackage);
fs.writeFileSync(rootPackagePath, rootPackageFormatted);
console.log("Updated root package.json");

const packages = [
	resolve(__dirname, "../packages"),
	resolve(__dirname, "../apps"),
];

for (const packageDir of packages) {
	const dirs = fs.readdirSync(packageDir, { withFileTypes: true });
	for (const dir of dirs) {
		if (dir.isDirectory()) {
			const packagePath = resolve(packageDir, dir.name, "package.json");
			if (fs.existsSync(packagePath)) {
				const packageJson = JSON.parse(
					fs.readFileSync(packagePath, "utf8"),
				);
				packageJson.version = version;
				const packageFormatted = await formatAndWriteFile(packageJson);
				fs.writeFileSync(packagePath, packageFormatted);

				console.log(`Updated ${packagePath}`);
			}
		}
	}
}

async function formatAndWriteFile(json) {
	return format(JSON.stringify(json, null, 2), {
		parser: "json",
		printWidth: 80,
		tabWidth: 4,
		useTabs: true,
		semi: true,
		singleQuote: false,
		quoteProps: "as-needed",
		jsxSingleQuote: false,
		trailingComma: "all",
		bracketSpacing: true,
		jsxBracketSameLine: false,
		arrowParens: "always",
		requirePragma: false,
		insertPragma: false,
		proseWrap: "preserve",
		htmlWhitespaceSensitivity: "css",
		endOfLine: "lf",
	});
}
