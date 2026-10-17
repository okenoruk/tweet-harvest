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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendCsv = appendCsv;
exports.ensureDirectoryExists = ensureDirectoryExists;
exports.convertValuesToStrings = convertValuesToStrings;
exports.createCsvHeaderRow = createCsvHeaderRow;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
/**
 * Appends content to a CSV file, creating directories if they don't exist
 * @param pathStr Path to the CSV file
 * @param contents Content to append
 * @param cb Optional callback function
 * @returns Full path to the file
 */
function appendCsv(pathStr, contents, cb) {
    const dirName = path_1.default.dirname(pathStr);
    const fileName = path_1.default.resolve(pathStr);
    fs.mkdirSync(dirName, { recursive: true });
    fs.appendFileSync(fileName, contents, cb);
    return fileName;
}
/**
 * Ensures a directory exists, creating it if necessary
 * @param folderPath Path to the directory
 * @returns Full path to the directory
 */
function ensureDirectoryExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
        const dir = fs.mkdirSync(folderPath, { recursive: true });
        const dirFullPath = path_1.default.resolve(dir || "");
        console.info(chalk_1.default.green(`Created new directory: ${dirFullPath}`));
        return dirFullPath;
    }
    return path_1.default.resolve(folderPath);
}
/**
 * Converts all values in an object to strings wrapped in double quotes
 * @param obj Object to convert
 * @returns Object with all values converted to quoted strings
 */
function convertValuesToStrings(obj) {
    const result = {};
    for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
            result[key] = convertValuesToStrings(obj[key]); // Recursively convert nested object values
        }
        else {
            result[key] = `"${String(obj[key]).replace(/"/g, '""')}"`;
        }
    }
    return result;
}
/**
 * Creates a CSV header row from field names
 * @param fields Array of field names
 * @returns CSV header row string
 */
function createCsvHeaderRow(fields) {
    return fields.map((field) => `"${field}"`).join(",") + "\n";
}
