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
// Initialize stealth mode
playwright_extra_1.chromium.use((0, puppeteer_extra_plugin_stealth_1.default)());
/**
 * Main crawl function
 */
function crawl(_a) {
    var ACCESS_TOKEN = _a.ACCESS_TOKEN, SEARCH_KEYWORDS = _a.SEARCH_KEYWORDS, TWEET_THREAD_URL = _a.TWEET_THREAD_URL, SEARCH_FROM_DATE = _a.SEARCH_FROM_DATE, SEARCH_TO_DATE = _a.SEARCH_TO_DATE, _b = _a.TARGET_TWEET_COUNT, TARGET_TWEET_COUNT = _b === void 0 ? 10 : _b, _c = _a.DELAY_EACH_TWEET_SECONDS, DELAY_EACH_TWEET_SECONDS = _c === void 0 ? 3 : _c, _d = _a.DELAY_EACH_LIKES_SECONDS, DELAY_EACH_LIKES_SECONDS = _d === void 0 ? 1 : _d, _e = _a.DELAY_EVERY_100_TWEETS_SECONDS, DELAY_EVERY_100_TWEETS_SECONDS = _e === void 0 ? 5 : _e, DEBUG_MODE = _a.DEBUG_MODE, OUTPUT_FILENAME = _a.OUTPUT_FILENAME, _f = _a.SEARCH_TAB, SEARCH_TAB = _f === void 0 ? "LATEST" : _f;
    return __awaiter(this, void 0, void 0, function () {
        /**
         * Start crawling Twitter
         */
        function startCrawlTwitter(_a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.twitterSearchUrl, twitterSearchUrl = _c === void 0 ? constants_1.TWITTER_SEARCH_ADVANCED_URL[SEARCH_TAB] : _c;
            return __awaiter(this, void 0, void 0, function () {
                var isLoggedIn, likesHandler, likes, retweetsHandler, retweets, tweetsHandler, tweets;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!(CRAWL_MODE === constants_1.CrawlMode.DETAIL)) return [3 /*break*/, 2];
                            return [4 /*yield*/, page.goto(TWEET_THREAD_URL)];
                        case 1:
                            _d.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, page.goto(twitterSearchUrl)];
                        case 3:
                            _d.sent();
                            _d.label = 4;
                        case 4:
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
                            if (!(TWEET_THREAD_URL && TWEET_THREAD_URL.indexOf('/likes') > -1)) return [3 /*break*/, 6];
                            likesHandler = new likes_handler_1.LikesHandler(page, FILE_NAME, constants_1.DEFAULT_DATA_FOLDER, TARGET_TWEET_COUNT, 2, // timeoutLimit
                            DELAY_EACH_LIKES_SECONDS, 1 // delayEvery100Seconds
                            );
                            return [4 /*yield*/, likesHandler.collect()];
                        case 5:
                            likes = _d.sent();
                            console.info("Collected ".concat(likes.length, " user profiles from likes"));
                            return [3 /*break*/, 10];
                        case 6:
                            if (!(TWEET_THREAD_URL && TWEET_THREAD_URL.indexOf('/retweets') > -1)) return [3 /*break*/, 8];
                            retweetsHandler = new retweets_handler_1.RetweetsHandler(page, FILE_NAME, constants_1.DEFAULT_DATA_FOLDER, TARGET_TWEET_COUNT, 2, // timeoutLimit
                            DELAY_EACH_LIKES_SECONDS, 1 // delayEvery100Seconds
                            );
                            return [4 /*yield*/, retweetsHandler.collect()];
                        case 7:
                            retweets = _d.sent();
                            console.info("Collected ".concat(retweets.length, " user profiles from retweets"));
                            return [3 /*break*/, 10];
                        case 8:
                            tweetsHandler = new tweets_handler_1.TweetsHandler(page, FILE_NAME, constants_1.DEFAULT_DATA_FOLDER, TARGET_TWEET_COUNT, CRAWL_MODE, 4, // timeoutLimit
                            DELAY_EACH_TWEET_SECONDS, DELAY_EVERY_100_TWEETS_SECONDS);
                            return [4 /*yield*/, tweetsHandler.collect()];
                        case 9:
                            tweets = _d.sent();
                            if (tweets.length === 0) {
                                TWEETS_NOT_FOUND_ON_CURRENT_TAB = true;
                                console.info("No tweets found for the search criteria");
                            }
                            else {
                                console.info("Collected ".concat(tweets.length, " tweets"));
                            }
                            _d.label = 10;
                        case 10: return [2 /*return*/];
                    }
                });
            });
        }
        var CRAWL_MODE, SWITCHED_SEARCH_TAB, filename, FILE_NAME, fs, TWEETS_NOT_FOUND_ON_CURRENT_TAB, CURRENT_PACKAGE_VERSION, browser, context, page, error_1, errorFilename_1;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    CRAWL_MODE = TWEET_THREAD_URL ? constants_1.CrawlMode.DETAIL : constants_1.CrawlMode.SEARCH;
                    SWITCHED_SEARCH_TAB = SEARCH_TAB === "TOP" ? "LATEST" : "TOP";
                    filename = (OUTPUT_FILENAME || "".concat(SEARCH_KEYWORDS, " ").concat(constants_1.FORMATTED_TIMESTAMP)).trim().replace(".csv", "");
                    FILE_NAME = "".concat(constants_1.DEFAULT_DATA_FOLDER, "/").concat(filename, ".csv").replace(/ /g, "_").replace(/:/g, "-");
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
                    browser = _g.sent();
                    return [4 /*yield*/, browser.newContext({
                            screen: { width: 1240, height: 1080 },
                            storageState: {
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
                            },
                        })];
                case 2:
                    context = _g.sent();
                    return [4 /*yield*/, context.newPage()];
                case 3:
                    page = _g.sent();
                    page.setDefaultTimeout(60 * 1000);
                    // Listen for network requests
                    (0, listen_network_requests_1.listenNetworkRequests)(page);
                    _g.label = 4;
                case 4:
                    _g.trys.push([4, 8, 10, 13]);
                    // Start crawling
                    return [4 /*yield*/, startCrawlTwitter()];
                case 5:
                    // Start crawling
                    _g.sent();
                    if (!(TWEETS_NOT_FOUND_ON_CURRENT_TAB && (SEARCH_FROM_DATE || SEARCH_TO_DATE))) return [3 /*break*/, 7];
                    console.info("No tweets found on \"".concat(SEARCH_TAB, "\" tab, trying \"").concat(SWITCHED_SEARCH_TAB, "\" tab..."));
                    return [4 /*yield*/, startCrawlTwitter({
                            twitterSearchUrl: constants_1.TWITTER_SEARCH_ADVANCED_URL[SWITCHED_SEARCH_TAB],
                        })];
                case 6:
                    _g.sent();
                    _g.label = 7;
                case 7: return [3 /*break*/, 13];
                case 8:
                    error_1 = _g.sent();
                    console.error(error_1);
                    console.info(chalk_1.default.blue("Keywords: ".concat(SEARCH_KEYWORDS)));
                    console.info(chalk_1.default.yellowBright("Twitter Harvest v", CURRENT_PACKAGE_VERSION));
                    errorFilename_1 = path_1.default.resolve(constants_1.DEFAULT_DATA_FOLDER, "/Error-".concat(constants_1.FORMATTED_TIMESTAMP, ".png")).replace(/ /g, "_");
                    return [4 /*yield*/, page.screenshot({ path: errorFilename_1 }).then(function () {
                            console.log(chalk_1.default.red("\nIf you need help, please send this error screenshot to the maintainer, it was saved to \"".concat(errorFilename_1, "\"")));
                        })];
                case 9:
                    _g.sent();
                    return [3 /*break*/, 13];
                case 10:
                    if (!!DEBUG_MODE) return [3 /*break*/, 12];
                    return [4 /*yield*/, browser.close()];
                case 11:
                    _g.sent();
                    _g.label = 12;
                case 12: return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.crawl = crawl;
