const fs = require('fs'); // Import the 'fs' module for file system operations
const path = require('path'); // Import the 'path' module for path manipulation

const PROJECT_ROOT = path.resolve(__dirname, './../../../../../'); // Determine the project's root directory
const PREFIX_LOAD_PARAM = '$_'; // Prefix used for automatically loaded variables

const packageJson = require(path.join(PROJECT_ROOT, "./package.json")); // Read the package.json file

/**
 * The load function to automatically load files and directories
 * @param {string} filePath - The path to the directory or file to load
 * @param {object} baseObject - The base object to store autoloaded data
 * @returns {object} - An object containing the autoloaded data
 */
function load(filePath, baseObject = null) {
	const files = fs.readdirSync(filePath);

	for (const file of files) {
		const updateFilePath = path.join(filePath, file);
		const stats = fs.statSync(updateFilePath);
		if (stats.isDirectory()) {
			baseObject[file] = load(updateFilePath, baseObject);
		} else {
			if (!file.endsWith('.js') && !file.endsWith('.json')) {
				throw Error("Only autoload for json file and javascript file");
			}
			const fileName = path.basename(updateFilePath, path.extname(updateFilePath));
			baseObject[fileName] = require(updateFilePath);
		}
	}

	return baseObject;
}

/**
 * Autoload modules
 */
for (const [file, param] of Object.entries(packageJson.autoload.modules)) {
	const filePath = path.resolve(PROJECT_ROOT, file);

	if (!fs.statSync(filePath).isDirectory()) {
		console.error("autoload modules should be a folder");
		return;
	}

	if ("" === param) {
		load(filePath, {});
		continue;
	}

	global[PREFIX_LOAD_PARAM + param] = load(filePath, {});
}

/**
 * Autoload packages
 */
for (const [package, param] of Object.entries(packageJson.autoload.packages)) {
	global[PREFIX_LOAD_PARAM + param] = require(package);
}

/**
 * Autoload files
 */
for (const [file, param] of Object.entries(packageJson.autoload.files)) {
	const filePath = path.resolve(PROJECT_ROOT, file);
	if (!file.endsWith('.js') && !file.endsWith('.json')) {
		console.error("Only autoload for json file and javascript file");
		return;
	}

	if ("" === param) {
		require(filePath);
		continue;
	}

	global[PREFIX_LOAD_PARAM + param] = require(filePath);
}
