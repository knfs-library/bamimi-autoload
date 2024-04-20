import { readdirSync, statSync } from 'fs'; // Importing necessary functions from the 'fs' module for file system operations
import { join, resolve, dirname, extname, basename } from 'path'; // Importing necessary functions from the 'path' module for path manipulation

// Determine the project's root directory
const PROJECT_ROOT = resolve(dirname(import.meta.url), './../../../../../');
// Prefix used for automatically loaded variables
const PREFIX_LOAD_PARAM = '$_';

// Import package.json to read configuration
import packageJson from './package.json';

// Function to automatically load files and directories
function load(filePath, baseObject = null) {
	const files = readdirSync(filePath);

	for (const file of files) {
		const updateFilePath = join(filePath, file);
		const stats = statSync(updateFilePath);
		if (stats.isDirectory()) {
			baseObject[file] = load(updateFilePath, baseObject);
		} else {
			if (!file.endsWith('.js') && !file.endsWith('.json')) {
				throw Error("Only autoload for json file and javascript file");
			}
			const fileName = basename(updateFilePath, extname(updateFilePath));
			baseObject[fileName] = require(updateFilePath);
		}
	};

	return baseObject;
}

// Autoload modules
for (const [file, param] of Object.entries(packageJson.autoload.modules)) {
	const filePath = resolve(PROJECT_ROOT, file);

	if (!statSync(filePath).isDirectory()) {
		console.error("autoload modules should be a folder");
		return;
	}

	if ("" === param) {
		load(filePath, {});
		continue;
	}

	global[PREFIX_LOAD_PARAM + param] = load(filePath, {});
}

// Autoload packages
for (const [packagePath, param] of Object.entries(packageJson.autoload.packages)) {
	global[PREFIX_LOAD_PARAM + param] = await import(packagePath);

}

// Autoload files
for (const [filePath, param] of Object.entries(packageJson.autoload.files)) {
	const resolvedPath = resolve(PROJECT_ROOT, filePath);
	if (!filePath.endsWith('.js') && !filePath.endsWith('.json')) {
		console.error("Only autoload for json file and javascript file");
		return;
	}

	if ("" === param) {
		await import(resolvedPath);
		continue;
	}

	global[PREFIX_LOAD_PARAM + param] = await import(resolvedPath);
}
