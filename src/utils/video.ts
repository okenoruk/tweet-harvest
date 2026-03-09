import fs from "fs";
import path from "path";
import { Page } from "playwright";

/**
 * Handle video recording for Playwright session
 * @param page Playwright page instance
 * @param outputFilename Desired final filename for the video (without extension)
 */
import { Video } from "playwright";

/**
 * Finalize video recording by renaming the file after browser closure
 * @param originalPath Original path of the video from Playwright
 * @param outputFilename Desired final filename for the video (without extension)
 */
export function finalizeVideo(originalPath: string, outputFilename: string) {
    const extension = ".webm"; // Playwright records in webm
    const newVideoPath = `${outputFilename}${extension}`;

    try {
        if (fs.existsSync(originalPath)) {
            fs.renameSync(originalPath, newVideoPath);
            return newVideoPath;
        } else {
            console.error(`Original video file not found at ${originalPath}`);
            return null;
        }
    } catch (error) {
        console.error(`Failed to rename video from ${originalPath} to ${newVideoPath}:`, error);
        return null;
    }
}
