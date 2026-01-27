import * as fs from "fs";
import path from "path";
import chalk from "chalk";

/**
 * Appends content to a CSV file, creating directories if they don't exist
 * @param pathStr Path to the CSV file
 * @param contents Content to append
 * @param cb Optional callback function
 * @returns Full path to the file
 */
export function appendCsv(pathStr: string, contents: any, cb?: fs.WriteFileOptions): string {
  const dirName = path.dirname(pathStr);
  const fileName = path.resolve(pathStr);

  fs.mkdirSync(dirName, { recursive: true });
  fs.appendFileSync(fileName, contents, cb);

  return fileName;
}

/**
 * Ensures a directory exists, creating it if necessary
 * @param folderPath Path to the directory
 * @returns Full path to the directory
 */
export function ensureDirectoryExists(folderPath: string): string {
  if (!fs.existsSync(folderPath)) {
    const dir = fs.mkdirSync(folderPath, { recursive: true });
    const dirFullPath = path.resolve(dir);
    console.info(chalk.green(`Created new directory: ${dirFullPath}`));
    return dirFullPath;
  }
  return path.resolve(folderPath);
}

/**
 * Converts all values in an object to strings wrapped in double quotes
 * @param obj Object to convert
 * @returns Object with all values converted to quoted strings
 */
export function convertValuesToStrings(obj: Record<string, any>): Record<string, string> {
  const result: Record<string, any> = {};
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      result[key] = convertValuesToStrings(obj[key]); // Recursively convert nested object values
    } else {
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
export function createCsvHeaderRow(fields: string[]): string {
  return fields.map((field) => `"${field}"`).join(",") + "\n";
}
