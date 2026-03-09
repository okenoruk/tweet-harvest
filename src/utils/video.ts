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
export async function finalizeVideo(originalPath: string, outputFilename: string) {
    const extension = ".webm"; // Playwright records in webm
    const newVideoPath = `${outputFilename}${extension}`;
    const maxRetries = 10;
    const retryDelayMs = 1000;

    if (!fs.existsSync(originalPath)) {
        console.error(`Original video file not found at ${originalPath}`);
        return null;
    }

    // Loop for retries to avoid EBUSY errors on Windows
    for (let i = 0; i < maxRetries; i++) {
        try {
            // Check if file exists in each loop iteration as well
            if (fs.existsSync(originalPath)) {
                await fs.promises.rename(originalPath, newVideoPath);
                return newVideoPath;
            }
        } catch (error: any) {
            // Only retry on EBUSY or ENOENT (if it's still being moved/created)
            if (error.code === 'EBUSY' && i < maxRetries - 1) {
                console.info(`Video file is busy, retrying in ${retryDelayMs}ms... (Attempt ${i + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, retryDelayMs));
                continue;
            }

            console.error(`Failed to rename video from ${originalPath} to ${newVideoPath}:`, error);
            return null;
        }
    }

    return null;
}
