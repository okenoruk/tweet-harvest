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
exports.crawl = void 0;
var fs = __importStar(require("fs"));
var dayjs_1 = __importDefault(require("dayjs"));
var lodash_1 = require("lodash");
var chalk_1 = __importDefault(require("chalk"));
var path_1 = __importDefault(require("path"));
var playwright_extra_1 = require("playwright-extra");
var puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
var input_keywords_1 = require("./features/input-keywords");
var listen_network_requests_1 = require("./features/listen-network-requests");
var exponential_backoff_1 = require("./features/exponential-backoff");
var env_1 = require("./env");
var constants_1 = require("./constants");
playwright_extra_1.chromium.use((0, puppeteer_extra_plugin_stealth_1.default)());
var NOW = (0, dayjs_1.default)().format("DD-MM-YYYY HH-mm-ss");
var headerWritten = false;
function appendCsv(pathStr, contents, cb) {
    var dirName = path_1.default.dirname(pathStr);
    var fileName = path_1.default.resolve(pathStr);
    fs.mkdirSync(dirName, { recursive: true });
    fs.appendFileSync(fileName, contents, cb);
    return fileName;
}
var filteredFields = [
    "created_at",
    "id_str",
    "full_text",
    "quote_count",
    "reply_count",
    "retweet_count",
    "favorite_count",
    "bookmark_count",
    "lang",
    "user_id_str",
    "conversation_id_str",
    "username",
    "tweet_url",
    "image_url",
    "location",
];
var filteredFavFields = [
    "id",
    "created_at",
    "description",
    "followers_count",
    "friends_count",
    "name",
    "profile_image_url_https",
    "screen_name",
    "statuses_count"
];
function convertValuesToStrings(obj) {
    var result = {};
    for (var key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
            result[key] = convertValuesToStrings(obj[key]); // Recursively convert nested object values
        }
        else {
            result[key] = "\"".concat(String(obj[key]), "\"");
        }
    }
    return result;
}
function crawl(_a) {
    var ACCESS_TOKEN = _a.ACCESS_TOKEN, SEARCH_KEYWORDS = _a.SEARCH_KEYWORDS, TWEET_THREAD_URL = _a.TWEET_THREAD_URL, SEARCH_FROM_DATE = _a.SEARCH_FROM_DATE, SEARCH_TO_DATE = _a.SEARCH_TO_DATE, _b = _a.TARGET_TWEET_COUNT, TARGET_TWEET_COUNT = _b === void 0 ? 10 : _b, 
    // default delay each tweet activity: 3 seconds
    _c = _a.DELAY_EACH_TWEET_SECONDS, 
    // default delay each tweet activity: 3 seconds
    DELAY_EACH_TWEET_SECONDS = _c === void 0 ? 3 : _c, _d = _a.DELAY_EACH_LIKES_SECONDS, DELAY_EACH_LIKES_SECONDS = _d === void 0 ? 1 : _d, _e = _a.DELAY_EVERY_100_TWEETS_SECONDS, DELAY_EVERY_100_TWEETS_SECONDS = _e === void 0 ? 5 : _e, DEBUG_MODE = _a.DEBUG_MODE, OUTPUT_FILENAME = _a.OUTPUT_FILENAME, _f = _a.SEARCH_TAB, SEARCH_TAB = _f === void 0 ? "LATEST" : _f;
    return __awaiter(this, void 0, void 0, function () {
        function startCrawlTwitter(_a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.twitterSearchUrl, twitterSearchUrl = _c === void 0 ? constants_1.TWITTER_SEARCH_ADVANCED_URL[SEARCH_TAB] : _c;
            return __awaiter(this, void 0, void 0, function () {
                function scrollAndSave() {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                    return __awaiter(this, void 0, void 0, function () {
                        var _loop_1, state_1, _loop_2, state_2, _loop_3, state_3;
                        return __generator(this, function (_k) {
                            switch (_k.label) {
                                case 0:
                                    if (!(TWEET_THREAD_URL && TWEET_THREAD_URL.indexOf('/likes') > -1)) return [3 /*break*/, 4];
                                    TIMEOUT_LIMIT = 2;
                                    _loop_1 = function () {
                                        var response, favorites_1, responseJson, error_2, _l, headerRow, comingFavs, dir, dirFullPath, rows, csv, fullPathFilename;
                                        var _m;
                                        return __generator(this, function (_o) {
                                            switch (_o.label) {
                                                case 0: return [4 /*yield*/, Promise.race([
                                                        // includes "SearchTimeline" because it's the endpoint for the search result
                                                        // or also includes "TweetDetail" because it's the endpoint for the tweet detail
                                                        page.waitForResponse(function (response) { return response.url().includes("Favoriters"); }),
                                                        page.waitForTimeout(5000),
                                                    ])];
                                                case 1:
                                                    response = _o.sent();
                                                    if (!response) return [3 /*break*/, 15];
                                                    timeoutCount = 0;
                                                    favorites_1 = [];
                                                    responseJson = void 0;
                                                    _o.label = 2;
                                                case 2:
                                                    _o.trys.push([2, 4, , 10]);
                                                    return [4 /*yield*/, response.json()];
                                                case 3:
                                                    responseJson = _o.sent();
                                                    return [3 /*break*/, 10];
                                                case 4:
                                                    error_2 = _o.sent();
                                                    return [4 /*yield*/, response.text()];
                                                case 5:
                                                    if (!(_o.sent()).toLowerCase().includes("rate limit")) return [3 /*break*/, 9];
                                                    console.error("Error parsing response json: ".concat(JSON.stringify(response)));
                                                    console.error("Most likely, you have already exceeded the Twitter rate limit. Read more on https://twitter.com/elonmusk/status/1675187969420828672?s=46.");
                                                    // wait for rate limit window passed before retrying
                                                    return [4 /*yield*/, page.waitForTimeout((0, exponential_backoff_1.calculateForRateLimit)(rateLimitCount++))];
                                                case 6:
                                                    // wait for rate limit window passed before retrying
                                                    _o.sent();
                                                    // click retry
                                                    return [4 /*yield*/, page.click("text=Retry")];
                                                case 7:
                                                    // click retry
                                                    _o.sent();
                                                    _l = {};
                                                    return [4 /*yield*/, scrollAndSave()];
                                                case 8: return [2 /*return*/, (_l.value = _o.sent(), _l)];
                                                case 9: return [2 /*return*/, "break"];
                                                case 10:
                                                    // reset the rate limit exception count
                                                    rateLimitCount = 0;
                                                    favorites_1 = (_a = responseJson.data) === null || _a === void 0 ? void 0 : _a.favoriters_timeline.timeline.instructions[0].entries;
                                                    if (!favorites_1) {
                                                        console.error("No more favorites found");
                                                        return [2 /*return*/, { value: void 0 }];
                                                    }
                                                    headerRow = filteredFavFields.map(function (field) { return "\"".concat(field, "\""); }).join(",") + "\n";
                                                    if (!headerWritten) {
                                                        headerWritten = true;
                                                        appendCsv(FILE_NAME, headerRow);
                                                    }
                                                    // add tweets and users to allData
                                                    (_m = allData.favorites).push.apply(_m, favorites_1);
                                                    comingFavs = favorites_1;
                                                    if (!fs.existsSync(FOLDER_DESTINATION)) {
                                                        dir = fs.mkdirSync(FOLDER_DESTINATION, { recursive: true });
                                                        dirFullPath = path_1.default.resolve(dir);
                                                        console.info(chalk_1.default.green("Created new directory: ".concat(dirFullPath)));
                                                    }
                                                    rows = comingFavs.reduce(function (prev, current) {
                                                        var _a, _b, _c, _d, _e, _f, _g;
                                                        if (current.entryId.indexOf('user') > -1 && ((_c = (_b = (_a = current === null || current === void 0 ? void 0 : current.content) === null || _a === void 0 ? void 0 : _a.itemContent) === null || _b === void 0 ? void 0 : _b.user_results) === null || _c === void 0 ? void 0 : _c.result)) {
                                                            var tweet = (0, lodash_1.pick)(__assign({ id: (_g = (_f = (_e = (_d = current === null || current === void 0 ? void 0 : current.content) === null || _d === void 0 ? void 0 : _d.itemContent) === null || _e === void 0 ? void 0 : _e.user_results) === null || _f === void 0 ? void 0 : _f.result) === null || _g === void 0 ? void 0 : _g.id }, current.content.itemContent.user_results.result.legacy), filteredFavFields);
                                                            var cleanText1 = "".concat(current.content.itemContent.user_results.result.legacy.description.replace(/,/g, " ").replace(/\n/g, " "));
                                                            var cleanText2 = "".concat(current.content.itemContent.user_results.result.legacy.name.replace(/,/g, " ").replace(/\n/g, " "));
                                                            tweet["description"] = cleanText1;
                                                            tweet["name"] = cleanText2;
                                                            var row = Object.values(convertValuesToStrings(tweet)).join(",");
                                                            return __spreadArray(__spreadArray([], prev, true), [row], false);
                                                        }
                                                        else {
                                                            return __spreadArray([], prev, true);
                                                        }
                                                    }, []);
                                                    csv = rows.join("\n") + "\n";
                                                    fullPathFilename = appendCsv(FILE_NAME, csv);
                                                    console.info(chalk_1.default.blue("Your user profiles saved to: ".concat(fullPathFilename)));
                                                    // progress:
                                                    console.info(chalk_1.default.yellow("Total user profiles saved: ".concat(allData.favorites.length)));
                                                    additionalTweetsCount += favorites_1.length;
                                                    if (!(additionalTweetsCount > 100)) return [3 /*break*/, 12];
                                                    additionalTweetsCount = 0;
                                                    // if (DELAY_EVERY_100_TWEETS_SECONDS) {
                                                    console.info(chalk_1.default.gray("\n--Taking a break, waiting for 1 second..."));
                                                    return [4 /*yield*/, page.waitForTimeout(1000)];
                                                case 11:
                                                    _o.sent();
                                                    return [3 /*break*/, 14];
                                                case 12:
                                                    if (!(additionalTweetsCount > 20)) return [3 /*break*/, 14];
                                                    return [4 /*yield*/, page.waitForTimeout(DELAY_EACH_LIKES_SECONDS * 1000)];
                                                case 13:
                                                    _o.sent();
                                                    _o.label = 14;
                                                case 14: return [3 /*break*/, 18];
                                                case 15:
                                                    timeoutCount++;
                                                    console.info(chalk_1.default.gray("Scrolling more..."));
                                                    if (timeoutCount > TIMEOUT_LIMIT) {
                                                        console.info(chalk_1.default.yellow("No more favs found, please check your search criteria and csv file result"));
                                                        return [2 /*return*/, "break"];
                                                    }
                                                    return [4 /*yield*/, page.evaluate(function () {
                                                            return window.scrollTo({
                                                                behavior: "smooth",
                                                                top: 10000 * 9000,
                                                            });
                                                        })];
                                                case 16:
                                                    _o.sent();
                                                    return [4 /*yield*/, scrollAndSave()];
                                                case 17:
                                                    _o.sent(); // call the function again to resume scrolling
                                                    _o.label = 18;
                                                case 18: return [4 /*yield*/, page.evaluate(function () {
                                                        return window.scrollTo({
                                                            behavior: "smooth",
                                                            top: 10000 * 9000,
                                                        });
                                                    })];
                                                case 19:
                                                    _o.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _k.label = 1;
                                case 1:
                                    if (!(allData.favorites.length < TARGET_TWEET_COUNT && timeoutCount < TIMEOUT_LIMIT)) return [3 /*break*/, 3];
                                    return [5 /*yield**/, _loop_1()];
                                case 2:
                                    state_1 = _k.sent();
                                    if (typeof state_1 === "object")
                                        return [2 /*return*/, state_1.value];
                                    if (state_1 === "break")
                                        return [3 /*break*/, 3];
                                    return [3 /*break*/, 1];
                                case 3: return [3 /*break*/, 11];
                                case 4:
                                    if (!(TWEET_THREAD_URL && TWEET_THREAD_URL.indexOf('/retweets') > -1)) return [3 /*break*/, 8];
                                    _loop_2 = function () {
                                        var response, retweetEntries_1, responseJson, error_3, _p, headerRow, comingFavs, dir, dirFullPath, rows, csv, fullPathFilename;
                                        var _q;
                                        return __generator(this, function (_r) {
                                            switch (_r.label) {
                                                case 0: return [4 /*yield*/, Promise.race([
                                                        // includes "SearchTimeline" because it's the endpoint for the search result
                                                        // or also includes "TweetDetail" because it's the endpoint for the tweet detail
                                                        page.waitForResponse(function (response) {
                                                            console.log('url', response.url());
                                                            return response.url().includes("Retweeters");
                                                        }),
                                                        page.waitForTimeout(5000),
                                                    ])];
                                                case 1:
                                                    response = _r.sent();
                                                    if (!response) return [3 /*break*/, 15];
                                                    timeoutCount = 0;
                                                    retweetEntries_1 = [];
                                                    responseJson = void 0;
                                                    _r.label = 2;
                                                case 2:
                                                    _r.trys.push([2, 4, , 10]);
                                                    return [4 /*yield*/, response.json()];
                                                case 3:
                                                    responseJson = _r.sent();
                                                    return [3 /*break*/, 10];
                                                case 4:
                                                    error_3 = _r.sent();
                                                    return [4 /*yield*/, response.text()];
                                                case 5:
                                                    if (!(_r.sent()).toLowerCase().includes("rate limit")) return [3 /*break*/, 9];
                                                    console.error("Error parsing response json: ".concat(JSON.stringify(response)));
                                                    console.error("Most likely, you have already exceeded the Twitter rate limit. Read more on https://twitter.com/elonmusk/status/1675187969420828672?s=46.");
                                                    // wait for rate limit window passed before retrying
                                                    return [4 /*yield*/, page.waitForTimeout((0, exponential_backoff_1.calculateForRateLimit)(rateLimitCount++))];
                                                case 6:
                                                    // wait for rate limit window passed before retrying
                                                    _r.sent();
                                                    // click retry
                                                    return [4 /*yield*/, page.click("text=Retry")];
                                                case 7:
                                                    // click retry
                                                    _r.sent();
                                                    _p = {};
                                                    return [4 /*yield*/, scrollAndSave()];
                                                case 8: return [2 /*return*/, (_p.value = _r.sent(), _p)];
                                                case 9: return [2 /*return*/, "break"];
                                                case 10:
                                                    // reset the rate limit exception count
                                                    rateLimitCount = 0;
                                                    if (((_b = responseJson.data) === null || _b === void 0 ? void 0 : _b.retweeters_timeline.timeline.instructions) && ((_c = responseJson.data) === null || _c === void 0 ? void 0 : _c.retweeters_timeline.timeline.instructions.length) > 0) {
                                                        retweetEntries_1 = (_d = responseJson.data) === null || _d === void 0 ? void 0 : _d.retweeters_timeline.timeline.instructions[0].entries;
                                                    }
                                                    if (!retweetEntries_1) {
                                                        console.error("No more retweets found");
                                                        return [2 /*return*/, { value: void 0 }];
                                                    }
                                                    headerRow = filteredFavFields.map(function (field) { return "\"".concat(field, "\""); }).join(",") + "\n";
                                                    if (!headerWritten) {
                                                        headerWritten = true;
                                                        appendCsv(FILE_NAME, headerRow);
                                                    }
                                                    // add tweets and users to allData
                                                    (_q = allData.reposts).push.apply(_q, retweetEntries_1);
                                                    comingFavs = retweetEntries_1;
                                                    if (!fs.existsSync(FOLDER_DESTINATION)) {
                                                        dir = fs.mkdirSync(FOLDER_DESTINATION, { recursive: true });
                                                        dirFullPath = path_1.default.resolve(dir);
                                                        console.info(chalk_1.default.green("Created new directory: ".concat(dirFullPath)));
                                                    }
                                                    rows = comingFavs.reduce(function (prev, current) {
                                                        var _a, _b, _c, _d, _e, _f, _g;
                                                        if (current.entryId.indexOf('user') > -1 && ((_c = (_b = (_a = current === null || current === void 0 ? void 0 : current.content) === null || _a === void 0 ? void 0 : _a.itemContent) === null || _b === void 0 ? void 0 : _b.user_results) === null || _c === void 0 ? void 0 : _c.result)) {
                                                            var tweet = (0, lodash_1.pick)(__assign({ id: (_g = (_f = (_e = (_d = current === null || current === void 0 ? void 0 : current.content) === null || _d === void 0 ? void 0 : _d.itemContent) === null || _e === void 0 ? void 0 : _e.user_results) === null || _f === void 0 ? void 0 : _f.result) === null || _g === void 0 ? void 0 : _g.id }, current.content.itemContent.user_results.result.legacy), filteredFavFields);
                                                            var cleanText1 = "".concat(current.content.itemContent.user_results.result.legacy.description.replace(/,/g, " ").replace(/\n/g, " "));
                                                            var cleanText2 = "".concat(current.content.itemContent.user_results.result.core.name.replace(/,/g, " ").replace(/\n/g, " "));
                                                            tweet["description"] = cleanText1;
                                                            tweet["name"] = cleanText2;
                                                            var row = Object.values(convertValuesToStrings(tweet)).join(",");
                                                            return __spreadArray(__spreadArray([], prev, true), [row], false);
                                                        }
                                                        else {
                                                            return __spreadArray([], prev, true);
                                                        }
                                                    }, []);
                                                    csv = rows.join("\n") + "\n";
                                                    fullPathFilename = appendCsv(FILE_NAME, csv);
                                                    console.info(chalk_1.default.blue("Your user profiles saved to: ".concat(fullPathFilename)));
                                                    // progress:
                                                    console.info(chalk_1.default.yellow("Total user profiles saved: ".concat(allData.reposts.length)));
                                                    additionalTweetsCount += retweetEntries_1.length;
                                                    if (!(additionalTweetsCount > 100)) return [3 /*break*/, 12];
                                                    additionalTweetsCount = 0;
                                                    // if (DELAY_EVERY_100_TWEETS_SECONDS) {
                                                    console.info(chalk_1.default.gray("\n--Taking a break, waiting for 1 second..."));
                                                    return [4 /*yield*/, page.waitForTimeout(1000)];
                                                case 11:
                                                    _r.sent();
                                                    return [3 /*break*/, 14];
                                                case 12:
                                                    if (!(additionalTweetsCount > 20)) return [3 /*break*/, 14];
                                                    return [4 /*yield*/, page.waitForTimeout(DELAY_EACH_LIKES_SECONDS * 1000)];
                                                case 13:
                                                    _r.sent();
                                                    _r.label = 14;
                                                case 14: return [3 /*break*/, 18];
                                                case 15:
                                                    timeoutCount++;
                                                    console.info(chalk_1.default.gray("Scrolling more..."));
                                                    if (timeoutCount > TIMEOUT_LIMIT) {
                                                        console.info(chalk_1.default.yellow("No more reposts found, please check your search criteria and csv file result"));
                                                        return [2 /*return*/, "break"];
                                                    }
                                                    return [4 /*yield*/, page.evaluate(function () {
                                                            return window.scrollTo({
                                                                behavior: "smooth",
                                                                top: 10000 * 9000,
                                                            });
                                                        })];
                                                case 16:
                                                    _r.sent();
                                                    return [4 /*yield*/, scrollAndSave()];
                                                case 17:
                                                    _r.sent(); // call the function again to resume scrolling
                                                    _r.label = 18;
                                                case 18: return [4 /*yield*/, page.evaluate(function () {
                                                        return window.scrollTo({
                                                            behavior: "smooth",
                                                            top: 10000 * 9000,
                                                        });
                                                    })];
                                                case 19:
                                                    _r.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _k.label = 5;
                                case 5:
                                    if (!(allData.reposts.length < TARGET_TWEET_COUNT && timeoutCount < TIMEOUT_LIMIT)) return [3 /*break*/, 7];
                                    return [5 /*yield**/, _loop_2()];
                                case 6:
                                    state_2 = _k.sent();
                                    if (typeof state_2 === "object")
                                        return [2 /*return*/, state_2.value];
                                    if (state_2 === "break")
                                        return [3 /*break*/, 7];
                                    return [3 /*break*/, 5];
                                case 7: return [3 /*break*/, 11];
                                case 8:
                                    _loop_3 = function () {
                                        var response, tweets, responseJson, error_4, _s, isTweetDetail, headerRow, tweetContents_1, comingTweets, dir, dirFullPath, rows, csv, fullPathFilename;
                                        var _t;
                                        return __generator(this, function (_u) {
                                            switch (_u.label) {
                                                case 0: return [4 /*yield*/, Promise.race([
                                                        // includes "SearchTimeline" because it's the endpoint for the search result
                                                        // or also includes "TweetDetail" because it's the endpoint for the tweet detail
                                                        page.waitForResponse(function (response) { return response.url().includes("SearchTimeline") || response.url().includes("TweetDetail"); }),
                                                        page.waitForTimeout(5000),
                                                    ])];
                                                case 1:
                                                    response = _u.sent();
                                                    if (!response) return [3 /*break*/, 18];
                                                    timeoutCount = 0;
                                                    tweets = [];
                                                    responseJson = void 0;
                                                    _u.label = 2;
                                                case 2:
                                                    _u.trys.push([2, 4, , 10]);
                                                    return [4 /*yield*/, response.json()];
                                                case 3:
                                                    responseJson = _u.sent();
                                                    return [3 /*break*/, 10];
                                                case 4:
                                                    error_4 = _u.sent();
                                                    return [4 /*yield*/, response.text()];
                                                case 5:
                                                    if (!(_u.sent()).toLowerCase().includes("rate limit")) return [3 /*break*/, 9];
                                                    console.error("Error parsing response json: ".concat(JSON.stringify(response)));
                                                    console.error("Most likely, you have already exceeded the Twitter rate limit. Read more on https://twitter.com/elonmusk/status/1675187969420828672?s=46.");
                                                    // wait for rate limit window passed before retrying
                                                    return [4 /*yield*/, page.waitForTimeout((0, exponential_backoff_1.calculateForRateLimit)(rateLimitCount++))];
                                                case 6:
                                                    // wait for rate limit window passed before retrying
                                                    _u.sent();
                                                    // click retry
                                                    return [4 /*yield*/, page.click("text=Retry")];
                                                case 7:
                                                    // click retry
                                                    _u.sent();
                                                    _s = {};
                                                    return [4 /*yield*/, scrollAndSave()];
                                                case 8: return [2 /*return*/, (_s.value = _u.sent(), _s)];
                                                case 9: return [2 /*return*/, "break"];
                                                case 10:
                                                    // reset the rate limit exception count
                                                    rateLimitCount = 0;
                                                    isTweetDetail = responseJson.data.threaded_conversation_with_injections_v2;
                                                    if (isTweetDetail) {
                                                        tweets = (_e = responseJson.data) === null || _e === void 0 ? void 0 : _e.threaded_conversation_with_injections_v2.instructions[0].entries;
                                                    }
                                                    else {
                                                        tweets = (_j = (_h = (_g = (_f = responseJson.data) === null || _f === void 0 ? void 0 : _f.search_by_raw_query.search_timeline.timeline) === null || _g === void 0 ? void 0 : _g.instructions) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.entries;
                                                    }
                                                    if (!tweets) {
                                                        console.error("No more tweets found, please check your search criteria and csv file result");
                                                        return [2 /*return*/, { value: void 0 }];
                                                    }
                                                    if (!!tweets.length) return [3 /*break*/, 12];
                                                    return [4 /*yield*/, page.getByText("No results for").count()];
                                                case 11:
                                                    // found text "not found" on the page
                                                    if (_u.sent()) {
                                                        TWEETS_NOT_FOUND_ON_CURRENT_TAB = true;
                                                        console.info("No tweets found for the search criteria");
                                                        return [2 /*return*/, "break"];
                                                    }
                                                    _u.label = 12;
                                                case 12:
                                                    headerRow = __spreadArray(__spreadArray([], filteredFields, true), ["views_count"], false).map(function (field) { return "\"".concat(field, "\""); }).join(",") + "\n";
                                                    if (!headerWritten) {
                                                        headerWritten = true;
                                                        appendCsv(FILE_NAME, headerRow);
                                                    }
                                                    tweetContents_1 = tweets
                                                        .map(function (tweet) {
                                                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
                                                        var isPromotedTweet = tweet.entryId.includes("promoted");
                                                        if (IS_SEARCH_MODE && !((_c = (_b = (_a = tweet === null || tweet === void 0 ? void 0 : tweet.content) === null || _a === void 0 ? void 0 : _a.itemContent) === null || _b === void 0 ? void 0 : _b.tweet_results) === null || _c === void 0 ? void 0 : _c.result))
                                                            return null;
                                                        if (IS_DETAIL_MODE) {
                                                            if (!((_g = (_f = (_e = (_d = tweet === null || tweet === void 0 ? void 0 : tweet.content) === null || _d === void 0 ? void 0 : _d.items) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.item) === null || _g === void 0 ? void 0 : _g.itemContent))
                                                                return null;
                                                            var isMentionThreadCreator = (_s = (_r = (_q = (_p = (_o = (_m = (_l = (_k = (_j = (_h = tweet === null || tweet === void 0 ? void 0 : tweet.content) === null || _h === void 0 ? void 0 : _h.items) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.item) === null || _l === void 0 ? void 0 : _l.itemContent) === null || _m === void 0 ? void 0 : _m.tweet_results) === null || _o === void 0 ? void 0 : _o.result) === null || _p === void 0 ? void 0 : _p.legacy) === null || _q === void 0 ? void 0 : _q.entities) === null || _r === void 0 ? void 0 : _r.user_mentions) === null || _s === void 0 ? void 0 : _s[0];
                                                            if (!isMentionThreadCreator)
                                                                return null;
                                                        }
                                                        if (isPromotedTweet)
                                                            return null;
                                                        var result = IS_SEARCH_MODE
                                                            ? tweet.content.itemContent.tweet_results.result
                                                            : tweet.content.items[0].item.itemContent.tweet_results.result;
                                                        if (!((_u = (_t = result.tweet) === null || _t === void 0 ? void 0 : _t.core) === null || _u === void 0 ? void 0 : _u.user_results) && !((_v = result.core) === null || _v === void 0 ? void 0 : _v.user_results))
                                                            return null;
                                                        var tweetContent = result.legacy || result.tweet.legacy;
                                                        var userContent = ((_y = (_x = (_w = result.core) === null || _w === void 0 ? void 0 : _w.user_results) === null || _x === void 0 ? void 0 : _x.result) === null || _y === void 0 ? void 0 : _y.legacy) || result.tweet.core.user_results.result.legacy;
                                                        var userDetail = ((_0 = (_z = result.core) === null || _z === void 0 ? void 0 : _z.user_results) === null || _0 === void 0 ? void 0 : _0.result) || result.tweet.core.user_results.result;
                                                        var views = result.views || ((_1 = result.tweet) === null || _1 === void 0 ? void 0 : _1.views);
                                                        console.log('tweetContent', tweetContent);
                                                        console.log('userContent', userContent);
                                                        console.log('userDetail', userDetail);
                                                        return {
                                                            tweet: tweetContent,
                                                            user: userContent,
                                                            userDetail: userDetail,
                                                            views: views
                                                        };
                                                    })
                                                        .filter(function (tweet) { return tweet !== null; });
                                                    // add tweets and users to allData
                                                    (_t = allData.tweets).push.apply(_t, tweetContents_1);
                                                    comingTweets = tweetContents_1;
                                                    if (!fs.existsSync(FOLDER_DESTINATION)) {
                                                        dir = fs.mkdirSync(FOLDER_DESTINATION, { recursive: true });
                                                        dirFullPath = path_1.default.resolve(dir);
                                                        console.info(chalk_1.default.green("Created new directory: ".concat(dirFullPath)));
                                                    }
                                                    rows = comingTweets.reduce(function (prev, current) {
                                                        var _a, _b, _c, _d, _e, _f, _g, _h;
                                                        var tweet = (0, lodash_1.pick)(current.tweet, filteredFields);
                                                        var cleanTweetText = "".concat(tweet.full_text.replace(/,/g, " ").replace(/\n/g, " "));
                                                        if (IS_DETAIL_MODE) {
                                                            var firstWord = cleanTweetText.split(" ")[0];
                                                            var replyToUsername = current.tweet.entities.user_mentions[0].screen_name;
                                                            // firstWord example: "@someone", the 0 index is " and the 1 index is @
                                                            if (firstWord[1] === "@") {
                                                                // remove the first word
                                                                cleanTweetText = cleanTweetText.replace("@".concat(replyToUsername, " "), "");
                                                            }
                                                        }
                                                        console.log('current', current);
                                                        var userName = (_b = (_a = current.userDetail) === null || _a === void 0 ? void 0 : _a.core) === null || _b === void 0 ? void 0 : _b.screen_name;
                                                        tweet["full_text"] = cleanTweetText;
                                                        tweet["username"] = userName;
                                                        tweet["tweet_url"] = "https://twitter.com/".concat(userName, "/status/").concat(tweet.id_str);
                                                        tweet["image_url"] = ((_e = (_d = (_c = current.tweet.entities) === null || _c === void 0 ? void 0 : _c.media) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.media_url_https) || "";
                                                        tweet["location"] = ((_g = (_f = current.userDetail) === null || _f === void 0 ? void 0 : _f.location) === null || _g === void 0 ? void 0 : _g.location) || "";
                                                        tweet["views_count"] = (_h = current.views) === null || _h === void 0 ? void 0 : _h.count;
                                                        var row = Object.values(convertValuesToStrings(tweet)).join(",");
                                                        return __spreadArray(__spreadArray([], prev, true), [row], false);
                                                    }, []);
                                                    csv = rows.join("\n") + "\n";
                                                    fullPathFilename = appendCsv(FILE_NAME, csv);
                                                    console.info(chalk_1.default.blue("Your tweets saved to: ".concat(fullPathFilename)));
                                                    // progress:
                                                    console.info(chalk_1.default.yellow("Total tweets saved: ".concat(allData.tweets.length)));
                                                    additionalTweetsCount += comingTweets.length;
                                                    if (!(additionalTweetsCount > 100)) return [3 /*break*/, 15];
                                                    additionalTweetsCount = 0;
                                                    if (!DELAY_EVERY_100_TWEETS_SECONDS) return [3 /*break*/, 14];
                                                    console.info(chalk_1.default.gray("\n--Taking a break, waiting for ".concat(DELAY_EVERY_100_TWEETS_SECONDS, " seconds...")));
                                                    return [4 /*yield*/, page.waitForTimeout(DELAY_EVERY_100_TWEETS_SECONDS * 1000)];
                                                case 13:
                                                    _u.sent();
                                                    _u.label = 14;
                                                case 14: return [3 /*break*/, 17];
                                                case 15:
                                                    if (!(additionalTweetsCount > 20)) return [3 /*break*/, 17];
                                                    return [4 /*yield*/, page.waitForTimeout(DELAY_EACH_TWEET_SECONDS * 1000)];
                                                case 16:
                                                    _u.sent();
                                                    _u.label = 17;
                                                case 17: return [3 /*break*/, 21];
                                                case 18:
                                                    timeoutCount++;
                                                    console.info(chalk_1.default.gray("Scrolling more..."));
                                                    if (timeoutCount > TIMEOUT_LIMIT) {
                                                        console.info(chalk_1.default.yellow("No more tweets found, please check your search criteria and csv file result"));
                                                        return [2 /*return*/, "break"];
                                                    }
                                                    return [4 /*yield*/, page.evaluate(function () {
                                                            return window.scrollTo({
                                                                behavior: "smooth",
                                                                top: 10000 * 9000,
                                                            });
                                                        })];
                                                case 19:
                                                    _u.sent();
                                                    return [4 /*yield*/, scrollAndSave()];
                                                case 20:
                                                    _u.sent(); // call the function again to resume scrolling
                                                    _u.label = 21;
                                                case 21: return [4 /*yield*/, page.evaluate(function () {
                                                        return window.scrollTo({
                                                            behavior: "smooth",
                                                            top: 10000 * 9000,
                                                        });
                                                    })];
                                                case 22:
                                                    _u.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _k.label = 9;
                                case 9:
                                    if (!(allData.tweets.length < TARGET_TWEET_COUNT && timeoutCount < TIMEOUT_LIMIT)) return [3 /*break*/, 11];
                                    return [5 /*yield**/, _loop_3()];
                                case 10:
                                    state_3 = _k.sent();
                                    if (typeof state_3 === "object")
                                        return [2 /*return*/, state_3.value];
                                    if (state_3 === "break")
                                        return [3 /*break*/, 11];
                                    return [3 /*break*/, 9];
                                case 11: return [2 /*return*/];
                            }
                        });
                    });
                }
                var isLoggedIn, timeoutCount, additionalTweetsCount, rateLimitCount, allData;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!IS_DETAIL_MODE) return [3 /*break*/, 2];
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
                            if (IS_SEARCH_MODE) {
                                (0, input_keywords_1.inputKeywords)(page, {
                                    SEARCH_FROM_DATE: SEARCH_FROM_DATE,
                                    SEARCH_TO_DATE: SEARCH_TO_DATE,
                                    SEARCH_KEYWORDS: SEARCH_KEYWORDS,
                                    MODIFIED_SEARCH_KEYWORDS: MODIFIED_SEARCH_KEYWORDS,
                                });
                            }
                            timeoutCount = 0;
                            additionalTweetsCount = 0;
                            rateLimitCount = 0;
                            allData = {
                                tweets: [],
                                favorites: [],
                                reposts: []
                            };
                            return [4 /*yield*/, scrollAndSave()];
                        case 5:
                            _d.sent();
                            if (allData.tweets.length) {
                                console.info("Already got ".concat(allData.tweets.length, " tweets, done scrolling..."));
                            }
                            else {
                                console.info("No tweets found for the search criteria");
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        var CRAWL_MODE, SWITCHED_SEARCH_TAB, IS_DETAIL_MODE, IS_SEARCH_MODE, TIMEOUT_LIMIT, MODIFIED_SEARCH_KEYWORDS, CURRENT_PACKAGE_VERSION, FOLDER_DESTINATION, FUlL_PATH_FOLDER_DESTINATION, filename, FILE_NAME, TWEETS_NOT_FOUND_ON_CURRENT_TAB, browser, context, page, error_1, errorFilename_1;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    CRAWL_MODE = TWEET_THREAD_URL ? "DETAIL" : "SEARCH";
                    SWITCHED_SEARCH_TAB = SEARCH_TAB === "TOP" ? "LATEST" : "TOP";
                    IS_DETAIL_MODE = CRAWL_MODE === "DETAIL";
                    IS_SEARCH_MODE = CRAWL_MODE === "SEARCH";
                    TIMEOUT_LIMIT = 4;
                    MODIFIED_SEARCH_KEYWORDS = SEARCH_KEYWORDS;
                    CURRENT_PACKAGE_VERSION = require("../package.json").version;
                    FOLDER_DESTINATION = "./tweets-data";
                    FUlL_PATH_FOLDER_DESTINATION = path_1.default.resolve(FOLDER_DESTINATION);
                    filename = (OUTPUT_FILENAME || "".concat(SEARCH_KEYWORDS, " ").concat(NOW)).trim().replace(".csv", "");
                    FILE_NAME = "".concat(FOLDER_DESTINATION, "/").concat(filename, ".csv").replace(/ /g, "_").replace(/:/g, "-");
                    console.info(chalk_1.default.blue("\nOpening twitter search page...\n"));
                    if (fs.existsSync(FILE_NAME)) {
                        console.info(chalk_1.default.blue("\nFound existing file ".concat(FILE_NAME, ", renaming to ").concat(FILE_NAME.replace(".csv", ".old.csv"))));
                        fs.renameSync(FILE_NAME, FILE_NAME.replace(".csv", ".old.csv"));
                    }
                    TWEETS_NOT_FOUND_ON_CURRENT_TAB = false;
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
                    (0, listen_network_requests_1.listenNetworkRequests)(page);
                    _g.label = 4;
                case 4:
                    _g.trys.push([4, 8, 10, 13]);
                    return [4 /*yield*/, startCrawlTwitter()];
                case 5:
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
                    console.info(chalk_1.default.blue("Keywords: ".concat(MODIFIED_SEARCH_KEYWORDS)));
                    console.info(chalk_1.default.yellowBright("Twitter Harvest v", CURRENT_PACKAGE_VERSION));
                    errorFilename_1 = FUlL_PATH_FOLDER_DESTINATION + "/Error-".concat(NOW, ".png").replace(/ /g, "_").replace(".csv", "");
                    return [4 /*yield*/, page.screenshot({ path: path_1.default.resolve(errorFilename_1) }).then(function () {
                            console.log(chalk_1.default.red("\nIf you need help, please send this error screenshot to the maintainer, it was saved to \"".concat(path_1.default.resolve(errorFilename_1), "\"")));
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
