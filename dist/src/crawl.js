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
exports.crawl = crawl;
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const playwright_extra_1 = require("playwright-extra");
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const input_keywords_1 = require("./features/input-keywords");
const listen_network_requests_1 = require("./features/listen-network-requests");
const env_1 = require("./env");
const constants_1 = require("./utils/constants");
const likes_handler_1 = require("./handlers/likes-handler");
const retweets_handler_1 = require("./handlers/retweets-handler");
const tweets_handler_1 = require("./handlers/tweets-handler");
const replies_handler_1 = require("./handlers/replies-handler");
const quotes_handler_1 = require("./handlers/quotes-handler");
const user_info_handler_1 = require("./handlers/user-info-handler");
const video_1 = require("./utils/video");
// Initialize stealth mode
playwright_extra_1.chromium.use((0, puppeteer_extra_plugin_stealth_1.default)());
/**
 * Main crawl function
 */
function crawl(_a) {
    return __awaiter(this, arguments, void 0, function* ({ ACCESS_TOKEN, SEARCH_KEYWORDS, TWEET_THREAD_URL, SEARCH_FROM_DATE, SEARCH_TO_DATE, TARGET_TWEET_COUNT = 10, DELAY_EACH_TWEET_SECONDS = 3, DELAY_EACH_LIKES_SECONDS = 1, DELAY_EVERY_100_TWEETS_SECONDS = 5, DEBUG_MODE, OUTPUT_FILENAME, SEARCH_TAB = "LATEST", TIMEOUT_LIMIT = 20, SCREEN_NAMES, }) {
        // Determine crawl mode based on URL or screen names
        const CRAWL_MODE = SCREEN_NAMES ? constants_1.CrawlMode.USER_INFO : (TWEET_THREAD_URL ? constants_1.CrawlMode.DETAIL : constants_1.CrawlMode.SEARCH);
        const SWITCHED_SEARCH_TAB = SEARCH_TAB === "TOP" ? "LATEST" : "TOP";
        // Set up file paths
        const filename = (OUTPUT_FILENAME || `${SEARCH_KEYWORDS} ${constants_1.FORMATTED_TIMESTAMP}`).trim().replace(".csv", "");
        const cleanFilename = filename.replace(/ /g, "_").replace(/:/g, "-");
        const FILE_NAME = path_1.default.join(constants_1.DEFAULT_DATA_FOLDER, `${cleanFilename}.csv`);
        console.info(chalk_1.default.blue("\nOpening twitter search page...\n"));
        // Rename existing file if it exists
        const fs = require("fs");
        if (fs.existsSync(FILE_NAME)) {
            console.info(chalk_1.default.blue(`\nFound existing file ${FILE_NAME}, renaming to ${FILE_NAME.replace(".csv", ".old.csv")}`));
            fs.renameSync(FILE_NAME, FILE_NAME.replace(".csv", ".old.csv"));
        }
        let TWEETS_NOT_FOUND_ON_CURRENT_TAB = false;
        const CURRENT_PACKAGE_VERSION = require("../package.json").version;
        // Initialize browser
        const browser = yield playwright_extra_1.chromium.launch({ headless: env_1.HEADLESS_MODE });
        // Set up browser context with authentication
        const context = yield browser.newContext(Object.assign({ screen: { width: 1240, height: 1080 }, storageState: {
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
        } : {})));
        // Create new page
        const page = yield context.newPage();
        page.setDefaultTimeout(60 * 1000);
        // Listen for network requests
        (0, listen_network_requests_1.listenNetworkRequests)(page, SEARCH_TAB);
        /**
         * Start crawling Twitter
         */
        function startCrawlTwitter() {
            return __awaiter(this, arguments, void 0, function* ({ twitterSearchUrl = constants_1.TWITTER_SEARCH_ADVANCED_URL[SEARCH_TAB], screenName, } = {}) {
                // Determine which handler to use based on URL and mode
                let handler;
                let urlToGo = "";
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
                    else if (TWEET_THREAD_URL.indexOf('/quotes') > -1) {
                        handler = new quotes_handler_1.QuotesHandler(page, FILE_NAME, constants_1.DEFAULT_DATA_FOLDER, TARGET_TWEET_COUNT, TIMEOUT_LIMIT, // timeoutLimit
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
                    urlToGo = `https://x.com/${screenName}`;
                    handler = new user_info_handler_1.UserInfoHandler(page, FILE_NAME, constants_1.DEFAULT_DATA_FOLDER, TIMEOUT_LIMIT, DELAY_EACH_TWEET_SECONDS, 1);
                }
                else {
                    urlToGo = twitterSearchUrl;
                    handler = new tweets_handler_1.TweetsHandler(page, FILE_NAME, constants_1.DEFAULT_DATA_FOLDER, TARGET_TWEET_COUNT, CRAWL_MODE, TIMEOUT_LIMIT, // timeoutLimit
                    DELAY_EACH_TWEET_SECONDS, DELAY_EVERY_100_TWEETS_SECONDS);
                }
                // Navigate to the appropriate URL
                console.info(chalk_1.default.gray(`Navigating to ${urlToGo}...`));
                yield page.goto(urlToGo, { waitUntil: 'domcontentloaded' });
                // Check if logged in
                const isLoggedIn = !page.url().includes("/login");
                if (!isLoggedIn) {
                    console.error("Invalid twitter auth token. Please check your auth token");
                    return browser.close();
                }
                // Input search keywords if in search mode
                if (CRAWL_MODE === constants_1.CrawlMode.SEARCH) {
                    (0, input_keywords_1.inputKeywords)(page, {
                        SEARCH_FROM_DATE,
                        SEARCH_TO_DATE,
                        SEARCH_KEYWORDS,
                        MODIFIED_SEARCH_KEYWORDS: SEARCH_KEYWORDS,
                    });
                }
                const items = yield handler.collect();
                if (items.length === 0) {
                    if (handler instanceof tweets_handler_1.TweetsHandler) {
                        TWEETS_NOT_FOUND_ON_CURRENT_TAB = true;
                        console.info("No tweets found for the search criteria");
                    }
                    const screenshotPath = path_1.default.resolve(constants_1.DEFAULT_DATA_FOLDER, `No-${handler.constructor.name}-${constants_1.FORMATTED_TIMESTAMP}.png`).replace(/ /g, "_");
                    yield page.screenshot({ path: screenshotPath });
                }
                else {
                    console.info(`Collected ${items.length} items using ${handler.constructor.name}`);
                }
            });
        }
        try {
            // Start crawling
            if (CRAWL_MODE === constants_1.CrawlMode.USER_INFO && SCREEN_NAMES) {
                for (const screenName of SCREEN_NAMES) {
                    yield startCrawlTwitter({ screenName });
                }
            }
            else {
                yield startCrawlTwitter();
            }
            // If no tweets found, try the other tab
            if (TWEETS_NOT_FOUND_ON_CURRENT_TAB && (SEARCH_FROM_DATE || SEARCH_TO_DATE)) {
                console.info(`No tweets found on "${SEARCH_TAB}" tab, trying "${SWITCHED_SEARCH_TAB}" tab...`);
                yield startCrawlTwitter({
                    twitterSearchUrl: constants_1.TWITTER_SEARCH_ADVANCED_URL[SWITCHED_SEARCH_TAB],
                });
            }
        }
        catch (error) {
            console.error(error);
            console.info(chalk_1.default.blue(`Keywords: ${SEARCH_KEYWORDS}`));
            console.info(chalk_1.default.yellowBright("Twitter Harvest v", CURRENT_PACKAGE_VERSION));
            // Take screenshot on error
            const errorFilename = path_1.default.resolve(constants_1.DEFAULT_DATA_FOLDER, `Error-${constants_1.FORMATTED_TIMESTAMP}.png`).replace(/ /g, "_");
            yield page.screenshot({ path: errorFilename }).then(() => {
                console.log(chalk_1.default.red(`\nIf you need help, please send this error screenshot to the maintainer, it was saved to "${errorFilename}"`));
            });
        }
        finally {
            if (DEBUG_MODE) {
                const video = page.video();
                const originalVideoPath = video ? yield video.path() : null;
                yield browser.close();
                if (originalVideoPath) {
                    const videoPath = yield (0, video_1.finalizeVideo)(originalVideoPath, path_1.default.join(path_1.default.resolve(constants_1.DEFAULT_DATA_FOLDER), cleanFilename));
                    if (videoPath) {
                        console.info(chalk_1.default.green(`Video recording saved to: ${videoPath}`));
                    }
                }
            }
            else {
                yield browser.close();
            }
        }
    });
}
