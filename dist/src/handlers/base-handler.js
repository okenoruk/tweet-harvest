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
exports.BaseHandler = void 0;
const fs = __importStar(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const file_1 = require("../utils/file");
const exponential_backoff_1 = require("../features/exponential-backoff");
const constants_1 = require("../utils/constants");
/**
 * Base class for Twitter data handlers
 */
class BaseHandler {
    /**
     * Constructor for BaseHandler
     * @param page Playwright page object
     * @param filePath Path to save the CSV file
     * @param dataFolder Folder to save the data
     * @param targetCount Target number of items to collect
     * @param timeoutLimit Number of timeouts before stopping
     * @param delaySeconds Delay between items in seconds
     * @param delayEvery100Seconds Delay after every 100 items in seconds
     */
    constructor(page, filePath, dataFolder, targetCount, timeoutLimit, delaySeconds, delayEvery100Seconds) {
        // Tracking variables
        this.timeoutCount = 0;
        this.additionalItemsCount = 0;
        this.rateLimitCount = 0;
        this.headerWritten = false;
        // Data storage
        this.allData = [];
        this.seenIds = new Set();
        // Response buffer
        this.responseQueue = [];
        this.page = page;
        this.filePath = filePath;
        this.dataFolder = dataFolder;
        this.targetCount = targetCount;
        this.timeoutLimit = timeoutLimit;
        this.delaySeconds = delaySeconds;
        this.delayEvery100Seconds = delayEvery100Seconds;
        // Ensure the data folder exists
        (0, file_1.ensureDirectoryExists)(dataFolder);
        // Start listening for responses immediately
        this.page.on('response', (response) => {
            if (response.url().includes(this.getUrlPattern())) {
                this.responseQueue.push(response);
            }
        });
    }
    /**
     * Clean text for CSV output
     * @param text Text to clean
     */
    cleanText(text) {
        if (!text)
            return "";
        return text.toString().replace(/[\r\n,]+/g, " ").trim();
    }
    /**
     * Handle a rate limit error
     * @param response Response object
     */
    handleRateLimit(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseText = yield response.text();
            if (responseText.toLowerCase().includes("rate limit")) {
                console.error(`Error parsing response json: ${response.url()}`);
                console.error(`Most likely, you have already exceeded the Twitter rate limit. Read more on https://twitter.com/elonmusk/status/1675187969420828672?s=46.`);
                // Wait for rate limit window passed before retrying
                yield this.page.waitForTimeout((0, exponential_backoff_1.calculateForRateLimit)(this.rateLimitCount++));
                // Click retry
                yield this.page.click("text=Retry");
                return true;
            }
            return false;
        });
    }
    /**
     * Write items to CSV
     * @param items Items to write
     */
    writeItemsToCsv(items) {
        return __awaiter(this, void 0, void 0, function* () {
            if (items.length === 0)
                return;
            // Write header if not already written and file is empty
            if (!this.headerWritten) {
                const fileExists = fs.existsSync(this.filePath);
                const isFileEmpty = fileExists ? fs.statSync(this.filePath).size === 0 : true;
                if (isFileEmpty) {
                    const headerRow = (0, file_1.createCsvHeaderRow)(this.getFields());
                    (0, file_1.appendCsv)(this.filePath, headerRow);
                }
                this.headerWritten = true;
            }
            // Process items for CSV
            const rows = items.reduce((prev, current) => {
                const processedItem = this.processItemForCsv(current);
                if (processedItem) {
                    const row = Object.values((0, file_1.convertValuesToStrings)(processedItem)).join(",");
                    return [...prev, row];
                }
                return prev;
            }, []);
            // Write to CSV
            if (rows.length > 0) {
                const csv = rows.join("\n") + "\n";
                const fullPathFilename = (0, file_1.appendCsv)(this.filePath, csv);
                console.info(chalk_1.default.blue(`Your ${this.getItemName()} saved to: ${fullPathFilename}`));
                console.info(chalk_1.default.yellow(`Total ${this.getItemName()} saved: ${this.allData.length}`));
            }
        });
    }
    /**
     * Handle delays between requests
     * @param itemsCount Number of items processed in this batch
     */
    handleDelays(itemsCount) {
        return __awaiter(this, void 0, void 0, function* () {
            this.additionalItemsCount += itemsCount;
            if (this.additionalItemsCount > 100) {
                this.additionalItemsCount = 0;
                if (this.delayEvery100Seconds) {
                    console.info(chalk_1.default.gray(`\n--Taking a break, waiting for ${this.delayEvery100Seconds} seconds...`));
                    yield this.page.waitForTimeout(this.delayEvery100Seconds * 1000);
                }
            }
            else if (this.additionalItemsCount > 20) {
                yield this.page.waitForTimeout(this.delaySeconds * 1000);
            }
        });
    }
    /**
     * Scroll the page
     */
    scrollPage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.evaluate(() => window.scrollTo({
                behavior: "smooth",
                top: 10000 * 9000,
            }));
        });
    }
    /**
     * Main method to collect data
     */
    collect() {
        return __awaiter(this, void 0, void 0, function* () {
            let currentWaitTimeout = 5000;
            const MAX_WAIT_TIMEOUT = 60000;
            while (this.allData.length < this.targetCount && this.timeoutCount < this.timeoutLimit) {
                // Check the buffer first
                let response = this.responseQueue.shift();
                if (!response) {
                    // Wait for the next response or timeout
                    try {
                        // Promise.race will either return a new response or undefined (on timeout)
                        const raceResult = yield Promise.race([
                            this.page.waitForResponse((response) => response.url().includes(this.getUrlPattern())),
                            this.page.waitForTimeout(currentWaitTimeout),
                        ]);
                        if (raceResult) {
                            response = raceResult;
                        }
                        else {
                            // Check the queue again after timeout just in case the listener caught it
                            response = this.responseQueue.shift();
                        }
                    }
                    catch (error) {
                        if (error instanceof Error && error.name === 'TimeoutError') {
                            this.timeoutCount++;
                            console.error(chalk_1.default.red(`Timeout waiting for ${this.getItemName()} response (${currentWaitTimeout}ms)`));
                            // Take screenshot on timeout
                            const screenshotPath = path_1.default.resolve(this.dataFolder, `Timeout-${this.getItemName().replace(/ /g, "_")}-${constants_1.FORMATTED_TIMESTAMP}.png`);
                            yield this.page.screenshot({ path: screenshotPath });
                            console.info(chalk_1.default.yellow(`Screenshot saved to: ${screenshotPath}`));
                            yield this.scrollPage();
                            // currentWaitTimeout = Math.min(currentWaitTimeout + 5000, MAX_WAIT_TIMEOUT);
                            break;
                        }
                        throw error;
                    }
                }
                if (response) {
                    this.timeoutCount = 0;
                    currentWaitTimeout = 5000; // Reset timeout on success
                    try {
                        const responseJson = yield response.json();
                        // Reset the rate limit exception count
                        this.rateLimitCount = 0;
                        // Process the response data
                        const items = this.processResponseData(responseJson);
                        if (!items || items.length === 0) {
                            console.error(`No more ${this.getItemName()} found`);
                            continue;
                        }
                        // TODO: For debugging purpose, delete later
                        const jsonData = JSON.stringify(items, null, 2);
                        var fs = require('fs');
                        fs.writeFile("api_results.json", jsonData, function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                        // Filter out duplicate items
                        const uniqueItems = items.filter((item) => {
                            const id = this.getUniqueId(item);
                            if (id) {
                                if (this.seenIds.has(id))
                                    return false;
                                this.seenIds.add(id);
                            }
                            return true;
                        });
                        if (uniqueItems.length > 0) {
                            // Add items to allData
                            this.allData.push(...uniqueItems);
                            // Write items to CSV
                            yield this.writeItemsToCsv(uniqueItems);
                        }
                        // Handle delays
                        yield this.handleDelays(items.length);
                    }
                    catch (error) {
                        // Check if it's a rate limit error
                        if (yield this.handleRateLimit(response)) {
                            return yield this.collect(); // Recursive call after handling rate limit
                        }
                        console.error(`Error processing response: ${error}`);
                        break;
                    }
                }
                else {
                    this.timeoutCount++;
                    console.info(chalk_1.default.gray(`Scrolling more... (Waiting for ${currentWaitTimeout / 1000}s)`));
                    // Increase timeout for next iteration, capped at 1 minute
                    currentWaitTimeout = Math.min(currentWaitTimeout + 5000, MAX_WAIT_TIMEOUT);
                    if (this.timeoutCount > this.timeoutLimit || currentWaitTimeout > MAX_WAIT_TIMEOUT) {
                        if (currentWaitTimeout > MAX_WAIT_TIMEOUT) {
                            console.info(chalk_1.default.red(`Timeout waiting for ${this.getItemName()} response (${currentWaitTimeout}ms)`));
                        }
                        console.info(chalk_1.default.yellow(`No more ${this.getItemName()} found, please check your search criteria and csv file result`));
                        break;
                    }
                    yield this.scrollPage();
                }
                // Scroll after each iteration
                yield this.scrollPage();
            }
            return this.allData;
        });
    }
}
exports.BaseHandler = BaseHandler;
