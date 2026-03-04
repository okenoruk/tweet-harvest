#!/usr/bin/env node
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
var crawl_1 = require("./crawl");
var child_process_1 = require("child_process");
var prompts_1 = __importDefault(require("prompts"));
var chalk_1 = __importDefault(require("chalk"));
var yargs_1 = __importDefault(require("yargs"));
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var questions, argv, answers, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(chalk_1.default.bold("\nWelcome to the Twitter Crawler 🕷️\n"));
                    console.log("This script uses Chromium Browser to crawl data from Twitter with *your* Twitter auth token.");
                    console.log("Please enter your Twitter auth token when prompted.\n");
                    console.log("Note: Keep your access token secret! Don't share it with anyone else.");
                    console.log("Note: This script only runs on your local device.\n");
                    questions = [];
                    argv = yargs_1.default
                        .usage("Usage: $0 [options]")
                        .options({
                        token: {
                            describe: "Twitter auth token",
                            type: "string",
                        },
                        from: {
                            alias: "f",
                            describe: "From date (DD-MM-YYYY)",
                            type: "string",
                        },
                        to: {
                            alias: "t",
                            describe: "To date (DD-MM-YYYY)",
                            type: "string",
                        },
                        search_keyword: {
                            alias: "s",
                            describe: "Search keyword",
                            type: "string",
                        },
                        tweet_thread_url: {
                            alias: "thread",
                            describe: "Tweet thread URL",
                            type: "string",
                        },
                        limit: {
                            alias: "l",
                            describe: "Limit number of tweets to crawl",
                            type: "number",
                        },
                        delay: {
                            alias: "d",
                            describe: "Delay between each tweet (in seconds)",
                            type: "number",
                            default: 3,
                        },
                        timeout: {
                            describe: "Timeout limit for scrolling/crawling",
                            type: "number",
                            default: 20,
                        },
                        debug: {},
                        output_filename: {
                            alias: "o",
                            describe: "Output filename",
                            type: "string",
                        },
                        search_tab: {
                            alias: "tab",
                            describe: "Search tab (TOP or LATEST)",
                            default: "LATEST",
                            choices: ["TOP", "LATEST"],
                        },
                    })
                        .help()
                        .alias("help", "h").argv;
                    if (!argv.token) {
                        questions.push({
                            type: "password",
                            name: "auth_token",
                            message: "What's your Twitter auth token?",
                            validate: function (value) {
                                if (value.length < 1) {
                                    return "Please enter your Twitter auth token";
                                }
                                else if (value.length < 30) {
                                    return "Please enter a valid Twitter auth token";
                                }
                                return true;
                            },
                        });
                    }
                    if (!argv.search_keyword && !argv.tweet_thread_url) {
                        questions.push({
                            type: "text",
                            name: "search_keyword",
                            message: "What's the search keyword?",
                            validate: function (value) {
                                if (value.length < 1) {
                                    return "Please enter a search keyword";
                                }
                                return true;
                            },
                        });
                    }
                    if (!argv.limit) {
                        questions.push({
                            type: "number",
                            name: "target_tweet_count",
                            message: "How many tweets do you want to crawl?",
                            validate: function (value) {
                                if (value < 1) {
                                    return "Please enter a number greater than 0";
                                }
                                return true;
                            },
                        });
                    }
                    return [4 /*yield*/, (0, prompts_1.default)(questions, {
                            onCancel: function () {
                                console.info("Exiting...");
                                process.exit(0);
                            },
                        })];
                case 1:
                    answers = _a.sent();
                    if (!argv.token) {
                        argv.token = answers.auth_token;
                    }
                    if (!argv.search_keyword) {
                        argv.search_keyword = answers.search_keyword;
                    }
                    if (!argv.limit) {
                        argv.limit = answers.target_tweet_count;
                    }
                    try {
                        output = (0, child_process_1.execSync)("npx playwright --version").toString();
                        (0, child_process_1.execSync)("npm i @playwright/test", { stdio: "inherit" });
                        (0, child_process_1.execSync)("npx playwright install chromium --with-deps", { stdio: "inherit" });
                        if (!output.includes("Version")) {
                            console.log("Installing required playwright browser dependencies... Please wait, this will take a while");
                        }
                        // Call the `crawl` function with the access token
                        (0, crawl_1.crawl)({
                            ACCESS_TOKEN: argv.token,
                            SEARCH_KEYWORDS: argv.search_keyword,
                            TWEET_THREAD_URL: argv.tweet_thread_url,
                            SEARCH_FROM_DATE: argv.from,
                            SEARCH_TO_DATE: argv.to,
                            TARGET_TWEET_COUNT: argv.limit,
                            DELAY_EACH_TWEET_SECONDS: argv.delay_each_tweet,
                            OUTPUT_FILENAME: argv.output_filename,
                            SEARCH_TAB: String(argv.search_tab).toUpperCase(),
                            TIMEOUT_LIMIT: argv.timeout,
                        });
                    }
                    catch (err) {
                        console.error("Error running script:", err);
                        process.exit(1);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
run();
