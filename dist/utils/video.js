"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizeVideo = finalizeVideo;
const fs_1 = __importDefault(require("fs"));
/**
 * Finalize video recording by renaming the file after browser closure
 * @param originalPath Original path of the video from Playwright
 * @param outputFilename Desired final filename for the video (without extension)
 */
function finalizeVideo(originalPath, outputFilename) {
    return __awaiter(this, void 0, void 0, function* () {
        const extension = ".webm"; // Playwright records in webm
        const newVideoPath = `${outputFilename}${extension}`;
        const maxRetries = 10;
        const retryDelayMs = 1000;
        if (!fs_1.default.existsSync(originalPath)) {
            console.error(`Original video file not found at ${originalPath}`);
            return null;
        }
        // Loop for retries to avoid EBUSY errors on Windows
        for (let i = 0; i < maxRetries; i++) {
            try {
                // Check if file exists in each loop iteration as well
                if (fs_1.default.existsSync(originalPath)) {
                    yield fs_1.default.promises.rename(originalPath, newVideoPath);
                    return newVideoPath;
                }
            }
            catch (error) {
                // Only retry on EBUSY or ENOENT (if it's still being moved/created)
                if (error.code === 'EBUSY' && i < maxRetries - 1) {
                    console.info(`Video file is busy, retrying in ${retryDelayMs}ms... (Attempt ${i + 1}/${maxRetries})`);
                    yield new Promise(resolve => setTimeout(resolve, retryDelayMs));
                    continue;
                }
                console.error(`Failed to rename video from ${originalPath} to ${newVideoPath}:`, error);
                return null;
            }
        }
        return null;
    });
}
