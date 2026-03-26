import dayjs from "dayjs";
import chalk from "chalk";
import path from "path";
import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import { inputKeywords } from "./features/input-keywords";
import { listenNetworkRequests } from "./features/listen-network-requests";
import { HEADLESS_MODE } from "./env";
import { CrawlMode, DEFAULT_DATA_FOLDER, FORMATTED_TIMESTAMP, SearchTab, TWITTER_SEARCH_ADVANCED_URL } from "./utils/constants";
import { LikesHandler } from "./handlers/likes-handler";
import { RetweetsHandler } from "./handlers/retweets-handler";
import { TweetsHandler } from "./handlers/tweets-handler";
import { RepliesHandler } from "./handlers/replies-handler";
import { QuotesHandler } from "./handlers/quotes-handler";
import { UserInfoHandler } from "./handlers/user-info-handler";
import { BaseHandler } from "./handlers/base-handler";
import { finalizeVideo } from "./utils/video";

// Initialize stealth mode
chromium.use(stealth());

/**
 * Parameters for the crawl function
 */
interface CrawlParams {
  ACCESS_TOKEN: string;
  SEARCH_KEYWORDS?: string;
  SEARCH_FROM_DATE?: string;
  SEARCH_TO_DATE?: string;
  TARGET_TWEET_COUNT?: number;
  DELAY_EACH_TWEET_SECONDS?: number;
  DELAY_EACH_LIKES_SECONDS?: number;
  DELAY_EVERY_100_TWEETS_SECONDS?: number;
  DEBUG_MODE?: boolean;
  OUTPUT_FILENAME?: string;
  TWEET_THREAD_URL?: string;
  SCREEN_NAMES?: string[];
  SEARCH_TAB?: "LATEST" | "TOP";
  TIMEOUT_LIMIT?: number;
}

/**
 * Parameters for the startCrawlTwitter function
 */
interface StartCrawlTwitterParams {
  twitterSearchUrl?: string;
}

/**
 * Main crawl function
 */
export async function crawl({
  ACCESS_TOKEN,
  SEARCH_KEYWORDS,
  TWEET_THREAD_URL,
  SEARCH_FROM_DATE,
  SEARCH_TO_DATE,
  TARGET_TWEET_COUNT = 10,
  DELAY_EACH_TWEET_SECONDS = 3,
  DELAY_EACH_LIKES_SECONDS = 1,
  DELAY_EVERY_100_TWEETS_SECONDS = 5,
  DEBUG_MODE,
  OUTPUT_FILENAME,
  SEARCH_TAB = "LATEST",
  TIMEOUT_LIMIT = 20,
  SCREEN_NAMES,
}: CrawlParams) {
  // Determine crawl mode based on URL or screen names
  const CRAWL_MODE = SCREEN_NAMES ? CrawlMode.USER_INFO : (TWEET_THREAD_URL ? CrawlMode.DETAIL : CrawlMode.SEARCH);
  const SWITCHED_SEARCH_TAB = SEARCH_TAB === "TOP" ? "LATEST" : "TOP";

  // Set up file paths
  const filename = (OUTPUT_FILENAME || `${SEARCH_KEYWORDS} ${FORMATTED_TIMESTAMP}`).trim().replace(".csv", "");
  const cleanFilename = filename.replace(/ /g, "_").replace(/:/g, "-");
  const FILE_NAME = path.join(DEFAULT_DATA_FOLDER, `${cleanFilename}.csv`);

  console.info(chalk.blue("\nOpening twitter search page...\n"));

  // Rename existing file if it exists
  const fs = require("fs");
  if (fs.existsSync(FILE_NAME)) {
    console.info(
      chalk.blue(`\nFound existing file ${FILE_NAME}, renaming to ${FILE_NAME.replace(".csv", ".old.csv")}`)
    );
    fs.renameSync(FILE_NAME, FILE_NAME.replace(".csv", ".old.csv"));
  }

  let TWEETS_NOT_FOUND_ON_CURRENT_TAB = false;
  const CURRENT_PACKAGE_VERSION = require("../package.json").version;

  // Initialize browser
  const browser = await chromium.launch({ headless: HEADLESS_MODE });

  // Set up browser context with authentication
  const context = await browser.newContext({
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
    ...(DEBUG_MODE ? {
      recordVideo: {
        dir: DEFAULT_DATA_FOLDER,
        size: { width: 1240, height: 1080 }
      }
    } : {})
  });

  // Create new page
  const page = await context.newPage();
  page.setDefaultTimeout(60 * 1000);

  // Listen for network requests
  listenNetworkRequests(page, SEARCH_TAB);

  /**
   * Start crawling Twitter
   */
  async function startCrawlTwitter({
    twitterSearchUrl = TWITTER_SEARCH_ADVANCED_URL[SEARCH_TAB],
    screenName,
  }: StartCrawlTwitterParams & { screenName?: string } = {}) {
    // Determine which handler to use based on URL and mode
    let handler: BaseHandler;
    let urlToGo = "";

    if (CRAWL_MODE === CrawlMode.DETAIL) {
      urlToGo = TWEET_THREAD_URL!;
      if (TWEET_THREAD_URL!.indexOf('/likes') > -1) {
        handler = new LikesHandler(
          page,
          FILE_NAME,
          DEFAULT_DATA_FOLDER,
          TARGET_TWEET_COUNT,
          TIMEOUT_LIMIT, // timeoutLimit
          DELAY_EACH_LIKES_SECONDS,
          1 // delayEvery100Seconds
        );
      } else if (TWEET_THREAD_URL!.indexOf('/retweets') > -1) {
        handler = new RetweetsHandler(
          page,
          FILE_NAME,
          DEFAULT_DATA_FOLDER,
          TARGET_TWEET_COUNT,
          TIMEOUT_LIMIT, // timeoutLimit
          DELAY_EACH_LIKES_SECONDS,
          1 // delayEvery100Seconds
        );
      } else if (TWEET_THREAD_URL!.indexOf('/quotes') > -1) {
        handler = new QuotesHandler(
          page,
          FILE_NAME,
          DEFAULT_DATA_FOLDER,
          TARGET_TWEET_COUNT,
          TIMEOUT_LIMIT, // timeoutLimit
          DELAY_EACH_LIKES_SECONDS,
          1 // delayEvery100Seconds
        );
      } else {
        // Plain tweet URL → collect all replies via TweetDetail API
        handler = new RepliesHandler(
          page,
          FILE_NAME,
          DEFAULT_DATA_FOLDER,
          TARGET_TWEET_COUNT,
          TIMEOUT_LIMIT, // timeoutLimit
          DELAY_EACH_LIKES_SECONDS,
          1 // delayEvery100Seconds
        );
      }
    } else if (CRAWL_MODE === CrawlMode.USER_INFO) {
      urlToGo = `https://x.com/${screenName}`;
      handler = new UserInfoHandler(
        page,
        FILE_NAME,
        DEFAULT_DATA_FOLDER,
        TIMEOUT_LIMIT,
        DELAY_EACH_TWEET_SECONDS,
        1
      );
    } else {
      urlToGo = twitterSearchUrl;
      handler = new TweetsHandler(
        page,
        FILE_NAME,
        DEFAULT_DATA_FOLDER,
        TARGET_TWEET_COUNT,
        CRAWL_MODE,
        TIMEOUT_LIMIT, // timeoutLimit
        DELAY_EACH_TWEET_SECONDS,
        DELAY_EVERY_100_TWEETS_SECONDS
      );
    }

    // Navigate to the appropriate URL
    console.info(chalk.gray(`Navigating to ${urlToGo}...`));
    await page.goto(urlToGo, { waitUntil: 'domcontentloaded' });

    // Check if logged in
    const isLoggedIn = !page.url().includes("/login");
    if (!isLoggedIn) {
      console.error("Invalid twitter auth token. Please check your auth token");
      return browser.close();
    }

    // Input search keywords if in search mode
    if (CRAWL_MODE === CrawlMode.SEARCH) {
      inputKeywords(page, {
        SEARCH_FROM_DATE,
        SEARCH_TO_DATE,
        SEARCH_KEYWORDS,
        MODIFIED_SEARCH_KEYWORDS: SEARCH_KEYWORDS,
      });
    }

    const items = await handler.collect();

    if (items.length === 0) {
      if (handler instanceof TweetsHandler) {
        TWEETS_NOT_FOUND_ON_CURRENT_TAB = true;
        console.info("No tweets found for the search criteria");
      }
      const screenshotPath = path.resolve(DEFAULT_DATA_FOLDER, `No-${handler.constructor.name}-${FORMATTED_TIMESTAMP}.png`).replace(/ /g, "_");
      await page.screenshot({ path: screenshotPath });
    } else {
      console.info(`Collected ${items.length} items using ${handler.constructor.name}`);
    }
  }

  try {
    // Start crawling
    if (CRAWL_MODE === CrawlMode.USER_INFO && SCREEN_NAMES) {
      for (const screenName of SCREEN_NAMES) {
        await startCrawlTwitter({ screenName });
      }
    } else {
      await startCrawlTwitter();
    }

    // If no tweets found, try the other tab
    if (TWEETS_NOT_FOUND_ON_CURRENT_TAB && (SEARCH_FROM_DATE || SEARCH_TO_DATE)) {
      console.info(`No tweets found on "${SEARCH_TAB}" tab, trying "${SWITCHED_SEARCH_TAB}" tab...`);

      await startCrawlTwitter({
        twitterSearchUrl: TWITTER_SEARCH_ADVANCED_URL[SWITCHED_SEARCH_TAB],
      });
    }
  } catch (error) {
    console.error(error);
    console.info(chalk.blue(`Keywords: ${SEARCH_KEYWORDS}`));
    console.info(chalk.yellowBright("Twitter Harvest v", CURRENT_PACKAGE_VERSION));

    // Take screenshot on error
    const errorFilename = path.resolve(DEFAULT_DATA_FOLDER, `Error-${FORMATTED_TIMESTAMP}.png`).replace(/ /g, "_");

    await page.screenshot({ path: errorFilename }).then(() => {
      console.log(
        chalk.red(
          `\nIf you need help, please send this error screenshot to the maintainer, it was saved to "${errorFilename}"`
        )
      );
    });
  } finally {
    if (DEBUG_MODE) {
      const video = page.video();
      const originalVideoPath = video ? await video.path() : null;
      await browser.close();
      if (originalVideoPath) {
        const videoPath = await finalizeVideo(originalVideoPath, path.join(path.resolve(DEFAULT_DATA_FOLDER), cleanFilename));
        if (videoPath) {
          console.info(chalk.green(`Video recording saved to: ${videoPath}`));
        }
      }
    } else {
      await browser.close();
    }
  }
}
