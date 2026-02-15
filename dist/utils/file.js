"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCsvHeaderRow = exports.convertValuesToStrings = exports.ensureDirectoryExists = exports.appendCsv = void 0;
var fs = __importStar(require("fs"));
var path_1 = __importDefault(require("path"));
var chalk_1 = __importDefault(require("chalk"));
/**
 * Appends content to a CSV file, creating directories if they don't exist
 * @param pathStr Path to the CSV file
 * @param contents Content to append
 * @param cb Optional callback function
 * @returns Full path to the file
 */
function appendCsv(pathStr, contents, cb) {
    var dirName = path_1.default.dirname(pathStr);
    var fileName = path_1.default.resolve(pathStr);
    fs.mkdirSync(dirName, { recursive: true });
    fs.appendFileSync(fileName, contents, cb);
    return fileName;
}
exports.appendCsv = appendCsv;
/**
 * Ensures a directory exists, creating it if necessary
 * @param folderPath Path to the directory
 * @returns Full path to the directory
 */
function ensureDirectoryExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
        var dir = fs.mkdirSync(folderPath, { recursive: true });
        var dirFullPath = path_1.default.resolve(dir);
        console.info(chalk_1.default.green("Created new directory: ".concat(dirFullPath)));
        return dirFullPath;
    }
    return path_1.default.resolve(folderPath);
}
exports.ensureDirectoryExists = ensureDirectoryExists;
/**
 * Converts all values in an object to strings wrapped in double quotes
 * @param obj Object to convert
 * @returns Object with all values converted to quoted strings
 */
function convertValuesToStrings(obj) {
    var result = {};
    for (var key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
            result[key] = convertValuesToStrings(obj[key]); // Recursively convert nested object values
        }
        else {
            result[key] = "\"".concat(String(obj[key]).replace(/"/g, '""'), "\"");
        }
    }
    return result;
}
exports.convertValuesToStrings = convertValuesToStrings;
/**
 * Creates a CSV header row from field names
 * @param fields Array of field names
 * @returns CSV header row string
 */
function createCsvHeaderRow(fields) {
    return fields.map(function (field) { return "\"".concat(field, "\""); }).join(",") + "\n";
}
exports.createCsvHeaderRow = createCsvHeaderRow;
