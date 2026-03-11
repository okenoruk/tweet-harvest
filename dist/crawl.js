"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawl = void 0;
var chalk_1 = __importDefault(require("chalk"));
var path_1 = __importDefault(require("path"));
var playwright_extra_1 = require("playwright-extra");
var puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
var input_keywords_1 = require("./features/input-keywords");
var listen_network_requests_1 = require("./features/listen-network-requests");
var env_1 = require("./env");
var constants_1 = require("./utils/constants");
var likes_handler_1 = require("./handlers/likes-handler");
var retweets_handler_1 = require("./handlers/retweets-handler");
var tweets_handler_1 = require("./handlers/tweets-handler");
var replies_handler_1 = require("./handlers/replies-handler");
var user_info_handler_1 = require("./handlers/user-info-handler");
var video_1 = require("./utils/video");
// Initialize stealth mode
playwright_extra_1.chromium.use((0, puppeteer_extra_plugin_stealth_1.default)());
/**
 * Main crawl function
 */
function crawl(_a) {
    var ACCESS_TOKEN = _a.ACCESS_TOKEN, SEARCH_KEYWORDS = _a.SEARCH_KEYWORDS, TWEET_THREAD_URL = _a.TWEET_THREAD_URL, SEARCH_FROM_DATE = _a.SEARCH_FROM_DATE, SEARCH_TO_DATE = _a.SEARCH_TO_DATE, _b = _a.TARGET_TWEET_COUNT, TARGET_TWEET_COUNT = _b === void 0 ? 10 : _b, _c = _a.DELAY_EACH_TWEET_SECONDS, DELAY_EACH_TWEET_SECONDS = _c === void 0 ? 3 : _c, _d = _a.DELAY_EACH_LIKES_SECONDS, DELAY_EACH_LIKES_SECONDS = _d === void 0 ? 1 : _d, _e = _a.DELAY_EVERY_100_TWEETS_SECONDS, DELAY_EVERY_100_TWEETS_SECONDS = _e === void 0 ? 5 : _e, DEBUG_MODE = _a.DEBUG_MODE, OUTPUT_FILENAME = _a.OUTPUT_FILENAME, _f = _a.SEARCH_TAB, SEARCH_TAB = _f === void 0 ? "LATEST" : _f, _g = _a.TIMEOUT_LIMIT, TIMEOUT_LIMIT = _g === void 0 ? 20 : _g, SCREEN_NAMES = _a.SCREEN_NAMES;
    return __awaiter(this, void 0, void 0, function () {
        /**
         * Start crawling Twitter
         */
        function startCrawlTwitter(_a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.twitterSearchUrl, twitterSearchUrl = _c === void 0 ? constants_1.TWITTER_SEARCH_ADVANCED_URL[SEARCH_TAB] : _c, screenName = _b.screenName;
            return __awaiter(this, void 0, void 0, function () {
                var handler, urlToGo, isLoggedIn, items, screenshotPath;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            urlToGo = "";
                            if (CRAWL_MODE === constants_1.CrawlMode.DETAIL) {
                                urlToGo = TWEET_THREAD_URL;
                                if (TWEET_THREAD_URL.indexOf('/likes') > -1) {
                                    handler = new likes_handler_1.LikesHandler(page, FILE_NAME, constants_1.DEFAULT_DATA_FOLDER, TARGET_TWEET_COUNT, TIMEOUT_LIMIT, // timeoutLimit
                                    DELAY_EACH_LIKES_SECONDS, 1 // delayEvery100Seconds
                                    );
                                }
                                else if (TWEET_THREAD_URL.indexOf('/retweets') > -1) {
                                    handler = new retweets_handler_1.RetweetsHandler(page, FILE_NAME, constants_1.DEFAULT_DATA_FOLDER, TARGET_TWEET_COUNT, TIMEOUT_LIMIT, // timeoutLimit
                                    DELAY_EACH_LIKES_SECONDS, 1 // delayEvery100Seconds
                                    );
                                }
                                else {
                                    // Plain tweet URL → collect all replies via TweetDetail API
                                    handler = new replies_handler_1.RepliesHandler(page, FILE_NAME, constants_1.DEFAULT_DATA_FOLDER, TARGET_TWEET_COUNT, TIMEOUT_LIMIT, // timeoutLimit
                                    DELAY_EACH_LIKES_SECONDS, 1 // delayEvery100Seconds
                                    );
                                }
                            }
                            else if (CRAWL_MODE === constants_1.CrawlMode.USER_INFO) {
                                urlToGo = "https://x.com/".concat(screenName);
                                handler = new user_info_handler_1.UserInfoHandler(page, FILE_NAME, constants_1.DEFAULT_DATA_FOLDER, TIMEOUT_LIMIT, DELAY_EACH_TWEET_SECONDS, 1);
                            }
                            else {
                                urlToGo = twitterSearchUrl;
                                handler = new tweets_handler_1.TweetsHandler(page, FILE_NAME, constants_1.DEFAULT_DATA_FOLDER, TARGET_TWEET_COUNT, CRAWL_MODE, TIMEOUT_LIMIT, // timeoutLimit
                                DELAY_EACH_TWEET_SECONDS, DELAY_EVERY_100_TWEETS_SECONDS);
                            }
                            // Navigate to the appropriate URL
                            console.info(chalk_1.default.gray("Navigating to ".concat(urlToGo, "...")));
                            return [4 /*yield*/, page.goto(urlToGo, { waitUntil: 'domcontentloaded' })];
                        case 1:
                            _d.sent();
                            isLoggedIn = !page.url().includes("/login");
                            if (!isLoggedIn) {
                                console.error("Invalid twitter auth token. Please check your auth token");
                                return [2 /*return*/, browser.close()];
                            }
                            // Input search keywords if in search mode
                            if (CRAWL_MODE === constants_1.CrawlMode.SEARCH) {
                                (0, input_keywords_1.inputKeywords)(page, {
                                    SEARCH_FROM_DATE: SEARCH_FROM_DATE,
                                    SEARCH_TO_DATE: SEARCH_TO_DATE,
                                    SEARCH_KEYWORDS: SEARCH_KEYWORDS,
                                    MODIFIED_SEARCH_KEYWORDS: SEARCH_KEYWORDS,
                                });
                            }
                            return [4 /*yield*/, handler.collect()];
                        case 2:
                            items = _d.sent();
                            if (!(items.length === 0)) return [3 /*break*/, 4];
                            if (handler instanceof tweets_handler_1.TweetsHandler) {
                                TWEETS_NOT_FOUND_ON_CURRENT_TAB = true;
                                console.info("No tweets found for the search criteria");
                            }
                            screenshotPath = path_1.default.resolve(constants_1.DEFAULT_DATA_FOLDER, "No-".concat(handler.constructor.name, "-").concat(constants_1.FORMATTED_TIMESTAMP, ".png")).replace(/ /g, "_");
                            return [4 /*yield*/, page.screenshot({ path: screenshotPath })];
                        case 3:
                            _d.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            console.info("Collected ".concat(items.length, " items using ").concat(handler.constructor.name));
                            _d.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
        var CRAWL_MODE, SWITCHED_SEARCH_TAB, filename, cleanFilename, FILE_NAME, fs, TWEETS_NOT_FOUND_ON_CURRENT_TAB, CURRENT_PACKAGE_VERSION, browser, context, page, _i, SCREEN_NAMES_1, screenName, error_1, errorFilename_1, video, originalVideoPath, _h, videoPath;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    CRAWL_MODE = SCREEN_NAMES ? constants_1.CrawlMode.USER_INFO : (TWEET_THREAD_URL ? constants_1.CrawlMode.DETAIL : constants_1.CrawlMode.SEARCH);
                    SWITCHED_SEARCH_TAB = SEARCH_TAB === "TOP" ? "LATEST" : "TOP";
                    filename = (OUTPUT_FILENAME || "".concat(SEARCH_KEYWORDS, " ").concat(constants_1.FORMATTED_TIMESTAMP)).trim().replace(".csv", "");
                    cleanFilename = filename.replace(/ /g, "_").replace(/:/g, "-");
                    FILE_NAME = path_1.default.join(constants_1.DEFAULT_DATA_FOLDER, "".concat(cleanFilename, ".csv"));
                    console.info(chalk_1.default.blue("\nOpening twitter search page...\n"));
                    fs = require("fs");
                    if (fs.existsSync(FILE_NAME)) {
                        console.info(chalk_1.default.blue("\nFound existing file ".concat(FILE_NAME, ", renaming to ").concat(FILE_NAME.replace(".csv", ".old.csv"))));
                        fs.renameSync(FILE_NAME, FILE_NAME.replace(".csv", ".old.csv"));
                    }
                    TWEETS_NOT_FOUND_ON_CURRENT_TAB = false;
                    CURRENT_PACKAGE_VERSION = require("../package.json").version;
                    return [4 /*yield*/, playwright_extra_1.chromium.launch({ headless: env_1.HEADLESS_MODE })];
                case 1:
                    browser = _j.sent();
                    return [4 /*yield*/, browser.newContext(__assign({ screen: { width: 1240, height: 1080 }, storageState: {
                                cookies: [
                                    {
                                        name: "auth_token",
                                        value: ACCESS_TOKEN,
                                        domain: "x.com",
                                        path: "/",
                                        expires: -1,
                                        httpOnly: true,
                                        secure: true,
                                        sameSite: "Strict",
                                    },
                                ],
                                origins: [],
                            } }, (DEBUG_MODE ? {
                            recordVideo: {
                                dir: constants_1.DEFAULT_DATA_FOLDER,
                                size: { width: 1240, height: 1080 }
                            }
                        } : {})))];
                case 2:
                    context = _j.sent();
                    return [4 /*yield*/, context.newPage()];
                case 3:
                    page = _j.sent();
                    page.setDefaultTimeout(60 * 1000);
                    // Listen for network requests
                    (0, listen_network_requests_1.listenNetworkRequests)(page, SEARCH_TAB);
                    _j.label = 4;
                case 4:
                    _j.trys.push([4, 14, 16, 26]);
                    if (!(CRAWL_MODE === constants_1.CrawlMode.USER_INFO && SCREEN_NAMES)) return [3 /*break*/, 9];
                    _i = 0, SCREEN_NAMES_1 = SCREEN_NAMES;
                    _j.label = 5;
                case 5:
                    if (!(_i < SCREEN_NAMES_1.length)) return [3 /*break*/, 8];
                    screenName = SCREEN_NAMES_1[_i];
                    return [4 /*yield*/, startCrawlTwitter({ screenName: screenName })];
                case 6:
                    _j.sent();
                    _j.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, startCrawlTwitter()];
                case 10:
                    _j.sent();
                    _j.label = 11;
                case 11:
                    if (!(TWEETS_NOT_FOUND_ON_CURRENT_TAB && (SEARCH_FROM_DATE || SEARCH_TO_DATE))) return [3 /*break*/, 13];
                    console.info("No tweets found on \"".concat(SEARCH_TAB, "\" tab, trying \"").concat(SWITCHED_SEARCH_TAB, "\" tab..."));
                    return [4 /*yield*/, startCrawlTwitter({
                            twitterSearchUrl: constants_1.TWITTER_SEARCH_ADVANCED_URL[SWITCHED_SEARCH_TAB],
                        })];
                case 12:
                    _j.sent();
                    _j.label = 13;
                case 13: return [3 /*break*/, 26];
                case 14:
                    error_1 = _j.sent();
                    console.error(error_1);
                    console.info(chalk_1.default.blue("Keywords: ".concat(SEARCH_KEYWORDS)));
                    console.info(chalk_1.default.yellowBright("Twitter Harvest v", CURRENT_PACKAGE_VERSION));
                    errorFilename_1 = path_1.default.resolve(constants_1.DEFAULT_DATA_FOLDER, "Error-".concat(constants_1.FORMATTED_TIMESTAMP, ".png")).replace(/ /g, "_");
                    return [4 /*yield*/, page.screenshot({ path: errorFilename_1 }).then(function () {
                            console.log(chalk_1.default.red("\nIf you need help, please send this error screenshot to the maintainer, it was saved to \"".concat(errorFilename_1, "\"")));
                        })];
                case 15:
                    _j.sent();
                    return [3 /*break*/, 26];
                case 16:
                    if (!DEBUG_MODE) return [3 /*break*/, 23];
                    video = page.video();
                    if (!video) return [3 /*break*/, 18];
                    return [4 /*yield*/, video.path()];
                case 17:
                    _h = _j.sent();
                    return [3 /*break*/, 19];
                case 18:
                    _h = null;
                    _j.label = 19;
                case 19:
                    originalVideoPath = _h;
                    return [4 /*yield*/, browser.close()];
                case 20:
                    _j.sent();
                    if (!originalVideoPath) return [3 /*break*/, 22];
                    return [4 /*yield*/, (0, video_1.finalizeVideo)(originalVideoPath, path_1.default.join(path_1.default.resolve(constants_1.DEFAULT_DATA_FOLDER), cleanFilename))];
                case 21:
                    videoPath = _j.sent();
                    if (videoPath) {
                        console.info(chalk_1.default.green("Video recording saved to: ".concat(videoPath)));
                    }
                    _j.label = 22;
                case 22: return [3 /*break*/, 25];
                case 23: return [4 /*yield*/, browser.close()];
                case 24:
                    _j.sent();
                    _j.label = 25;
                case 25: return [7 /*endfinally*/];
                case 26: return [2 /*return*/];
            }
        });
    });
}
exports.crawl = crawl;
