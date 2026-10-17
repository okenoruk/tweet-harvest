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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crawl_1 = require("./crawl");
const child_process_1 = require("child_process");
const prompts_1 = __importDefault(require("prompts"));
const chalk_1 = __importDefault(require("chalk"));
const yargs_1 = __importDefault(require("yargs"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk_1.default.bold("\nWelcome to the Twitter Crawler 🕷️\n"));
        console.log("This script uses Chromium Browser to crawl data from Twitter with *your* Twitter auth token.");
        console.log("Please enter your Twitter auth token when prompted.\n");
        console.log("Note: Keep your access token secret! Don't share it with anyone else.");
        console.log("Note: This script only runs on your local device.\n");
        const questions = [];
        const argv = yargs_1.default
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
            screen_names: {
                alias: "sn",
                describe: "List of screen names to fetch info from (comma separated)",
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
            debug: {
                describe: "Enable debug mode (record video)",
                type: "boolean",
                default: false,
            },
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
                message: `What's your Twitter auth token?`,
                validate: (value) => {
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
        if (!argv.search_keyword && !argv.tweet_thread_url && !argv.screen_names) {
            questions.push({
                type: "select",
                name: "crawl_mode",
                message: "What do you want to crawl?",
                choices: [
                    { title: "Search Mode", value: "search" },
                    { title: "Detail Mode (Replies/Likes/Retweets)", value: "detail" },
                    { title: "User Info Mode", value: "user_info" },
                ],
            });
            questions.push({
                type: (_, values) => (values.crawl_mode === "search" ? "text" : null),
                name: "search_keyword",
                message: "What's the search keyword?",
                validate: (value) => (value.length < 1 ? "Please enter a search keyword" : true),
            });
            questions.push({
                type: (_, values) => (values.crawl_mode === "detail" ? "text" : null),
                name: "tweet_thread_url",
                message: "What's the tweet thread URL?",
                validate: (value) => (value.length < 1 ? "Please enter a tweet thread URL" : true),
            });
            questions.push({
                type: (_, values) => (values.crawl_mode === "user_info" ? "text" : null),
                name: "screen_names",
                message: "Enter screen names (comma separated):",
                validate: (value) => (value.length < 1 ? "Please enter at least one screen name" : true),
            });
        }
        if (!argv.limit && !argv.screen_names) {
            questions.push({
                type: "number",
                name: "target_tweet_count",
                message: "How many tweets do you want to crawl?",
                validate: (value) => {
                    if (value < 1) {
                        return "Please enter a number greater than 0";
                    }
                    return true;
                },
            });
        }
        const answers = yield (0, prompts_1.default)(questions, {
            onCancel: () => {
                console.info("Exiting...");
                process.exit(0);
            },
        });
        if (!argv.token) {
            argv.token = answers.auth_token;
        }
        if (!argv.search_keyword) {
            argv.search_keyword = answers.search_keyword;
        }
        if (answers.tweet_thread_url) {
            argv.tweet_thread_url = answers.tweet_thread_url;
        }
        if (answers.screen_names) {
            argv.screen_names = answers.screen_names;
        }
        if (!argv.limit && !argv.screen_names) {
            argv.limit = answers.target_tweet_count;
        }
        try {
            // Run `npx playwright install` to install the Playwright dependencies
            const output = (0, child_process_1.execSync)("npx playwright --version").toString();
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
                DEBUG_MODE: argv.debug,
                SCREEN_NAMES: argv.screen_names ? argv.screen_names.split(",").map((s) => s.trim()) : undefined,
            });
        }
        catch (err) {
            console.error("Error running script:", err);
            process.exit(1);
        }
    });
}
run();
