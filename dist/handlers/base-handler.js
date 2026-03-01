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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHandler = void 0;
var chalk_1 = __importDefault(require("chalk"));
var path_1 = __importDefault(require("path"));
var file_1 = require("../utils/file");
var exponential_backoff_1 = require("../features/exponential-backoff");
var constants_1 = require("../utils/constants");
/**
 * Base class for Twitter data handlers
 */
var BaseHandler = /** @class */ (function () {
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
    function BaseHandler(page, filePath, dataFolder, targetCount, timeoutLimit, delaySeconds, delayEvery100Seconds) {
        var _this = this;
        // Tracking variables
        this.timeoutCount = 0;
        this.additionalItemsCount = 0;
        this.rateLimitCount = 0;
        this.headerWritten = false;
        // Data storage
        this.allData = [];
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
        this.page.on('response', function (response) {
            if (response.url().includes(_this.getUrlPattern())) {
                _this.responseQueue.push(response);
            }
        });
    }
    /**
     * Handle a rate limit error
     * @param response Response object
     */
    BaseHandler.prototype.handleRateLimit = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var responseText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, response.text()];
                    case 1:
                        responseText = _a.sent();
                        if (!responseText.toLowerCase().includes("rate limit")) return [3 /*break*/, 4];
                        console.error("Error parsing response json: ".concat(response.url()));
                        console.error("Most likely, you have already exceeded the Twitter rate limit. Read more on https://twitter.com/elonmusk/status/1675187969420828672?s=46.");
                        // Wait for rate limit window passed before retrying
                        return [4 /*yield*/, this.page.waitForTimeout((0, exponential_backoff_1.calculateForRateLimit)(this.rateLimitCount++))];
                    case 2:
                        // Wait for rate limit window passed before retrying
                        _a.sent();
                        // Click retry
                        return [4 /*yield*/, this.page.click("text=Retry")];
                    case 3:
                        // Click retry
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4: return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     * Write items to CSV
     * @param items Items to write
     */
    BaseHandler.prototype.writeItemsToCsv = function (items) {
        return __awaiter(this, void 0, void 0, function () {
            var headerRow, rows, csv, fullPathFilename;
            var _this = this;
            return __generator(this, function (_a) {
                if (items.length === 0)
                    return [2 /*return*/];
                // Write header if not already written
                if (!this.headerWritten) {
                    this.headerWritten = true;
                    headerRow = (0, file_1.createCsvHeaderRow)(this.getFields());
                    (0, file_1.appendCsv)(this.filePath, headerRow);
                }
                rows = items.reduce(function (prev, current) {
                    var processedItem = _this.processItemForCsv(current);
                    if (processedItem) {
                        var row = Object.values((0, file_1.convertValuesToStrings)(processedItem)).join(",");
                        return __spreadArray(__spreadArray([], prev, true), [row], false);
                    }
                    return prev;
                }, []);
                // Write to CSV
                if (rows.length > 0) {
                    csv = rows.join("\n") + "\n";
                    fullPathFilename = (0, file_1.appendCsv)(this.filePath, csv);
                    console.info(chalk_1.default.blue("Your ".concat(this.getItemName(), " saved to: ").concat(fullPathFilename)));
                    console.info(chalk_1.default.yellow("Total ".concat(this.getItemName(), " saved: ").concat(this.allData.length)));
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handle delays between requests
     * @param itemsCount Number of items processed in this batch
     */
    BaseHandler.prototype.handleDelays = function (itemsCount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.additionalItemsCount += itemsCount;
                        if (!(this.additionalItemsCount > 100)) return [3 /*break*/, 3];
                        this.additionalItemsCount = 0;
                        if (!this.delayEvery100Seconds) return [3 /*break*/, 2];
                        console.info(chalk_1.default.gray("\n--Taking a break, waiting for ".concat(this.delayEvery100Seconds, " seconds...")));
                        return [4 /*yield*/, this.page.waitForTimeout(this.delayEvery100Seconds * 1000)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 5];
                    case 3:
                        if (!(this.additionalItemsCount > 20)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.page.waitForTimeout(this.delaySeconds * 1000)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Scroll the page
     */
    BaseHandler.prototype.scrollPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.evaluate(function () {
                            return window.scrollTo({
                                behavior: "smooth",
                                top: 10000 * 9000,
                            });
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Main method to collect data
     */
    BaseHandler.prototype.collect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentWaitTimeout, MAX_WAIT_TIMEOUT, response, raceResult, error_1, screenshotPath, responseJson, items, jsonData, fs, error_2;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        currentWaitTimeout = 5000;
                        MAX_WAIT_TIMEOUT = 60000;
                        _b.label = 1;
                    case 1:
                        if (!(this.allData.length < this.targetCount && this.timeoutCount < this.timeoutLimit)) return [3 /*break*/, 22];
                        response = this.responseQueue.shift();
                        if (!!response) return [3 /*break*/, 8];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 8]);
                        return [4 /*yield*/, Promise.race([
                                this.page.waitForResponse(function (response) { return response.url().includes(_this.getUrlPattern()); }),
                                this.page.waitForTimeout(currentWaitTimeout),
                            ])];
                    case 3:
                        raceResult = _b.sent();
                        if (raceResult) {
                            response = raceResult;
                        }
                        else {
                            // Check the queue again after timeout just in case the listener caught it
                            response = this.responseQueue.shift();
                        }
                        return [3 /*break*/, 8];
                    case 4:
                        error_1 = _b.sent();
                        if (!(error_1 instanceof Error && error_1.name === 'TimeoutError')) return [3 /*break*/, 7];
                        this.timeoutCount++;
                        console.error(chalk_1.default.red("Timeout waiting for ".concat(this.getItemName(), " response (").concat(currentWaitTimeout, "ms)")));
                        screenshotPath = path_1.default.resolve(this.dataFolder, "Timeout-".concat(this.getItemName().replace(/ /g, "_"), "-").concat(constants_1.FORMATTED_TIMESTAMP, ".png"));
                        return [4 /*yield*/, this.page.screenshot({ path: screenshotPath })];
                    case 5:
                        _b.sent();
                        console.info(chalk_1.default.yellow("Screenshot saved to: ".concat(screenshotPath)));
                        return [4 /*yield*/, this.scrollPage()];
                    case 6:
                        _b.sent();
                        // currentWaitTimeout = Math.min(currentWaitTimeout + 5000, MAX_WAIT_TIMEOUT);
                        return [3 /*break*/, 22];
                    case 7: throw error_1;
                    case 8:
                        if (!response) return [3 /*break*/, 18];
                        this.timeoutCount = 0;
                        currentWaitTimeout = 5000; // Reset timeout on success
                        _b.label = 9;
                    case 9:
                        _b.trys.push([9, 13, , 17]);
                        return [4 /*yield*/, response.json()];
                    case 10:
                        responseJson = _b.sent();
                        // Reset the rate limit exception count
                        this.rateLimitCount = 0;
                        items = this.processResponseData(responseJson);
                        if (!items || items.length === 0) {
                            console.error("No more ".concat(this.getItemName(), " found"));
                            return [3 /*break*/, 1];
                        }
                        jsonData = JSON.stringify(items, null, 2);
                        fs = require('fs');
                        fs.writeFile("api_results.json", jsonData, function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                        // Add items to allData
                        (_a = this.allData).push.apply(_a, items);
                        // Write items to CSV
                        return [4 /*yield*/, this.writeItemsToCsv(items)];
                    case 11:
                        // Write items to CSV
                        _b.sent();
                        // Handle delays
                        return [4 /*yield*/, this.handleDelays(items.length)];
                    case 12:
                        // Handle delays
                        _b.sent();
                        return [3 /*break*/, 17];
                    case 13:
                        error_2 = _b.sent();
                        return [4 /*yield*/, this.handleRateLimit(response)];
                    case 14:
                        if (!_b.sent()) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.collect()];
                    case 15: return [2 /*return*/, _b.sent()]; // Recursive call after handling rate limit
                    case 16:
                        console.error("Error processing response: ".concat(error_2));
                        return [3 /*break*/, 22];
                    case 17: return [3 /*break*/, 20];
                    case 18:
                        this.timeoutCount++;
                        console.info(chalk_1.default.gray("Scrolling more... (Waiting for ".concat(currentWaitTimeout / 1000, "s)")));
                        // Increase timeout for next iteration, capped at 1 minute
                        currentWaitTimeout = Math.min(currentWaitTimeout + 5000, MAX_WAIT_TIMEOUT);
                        if (this.timeoutCount > this.timeoutLimit || currentWaitTimeout > MAX_WAIT_TIMEOUT) {
                            if (currentWaitTimeout > MAX_WAIT_TIMEOUT) {
                                console.info(chalk_1.default.red("Timeout waiting for ".concat(this.getItemName(), " response (").concat(currentWaitTimeout, "ms)")));
                            }
                            console.info(chalk_1.default.yellow("No more ".concat(this.getItemName(), " found, please check your search criteria and csv file result")));
                            return [3 /*break*/, 22];
                        }
                        return [4 /*yield*/, this.scrollPage()];
                    case 19:
                        _b.sent();
                        _b.label = 20;
                    case 20: 
                    // Scroll after each iteration
                    return [4 /*yield*/, this.scrollPage()];
                    case 21:
                        // Scroll after each iteration
                        _b.sent();
                        return [3 /*break*/, 1];
                    case 22: return [2 /*return*/, this.allData];
                }
            });
        });
    };
    return BaseHandler;
}());
exports.BaseHandler = BaseHandler;
