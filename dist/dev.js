"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crawl_1 = require("./crawl");
var env_1 = require("./env");
// crawl({
//   ACCESS_TOKEN: ACCESS_TOKEN,
//   SEARCH_KEYWORDS: `miftah lang:id`,
//   TARGET_TWEET_COUNT: 100,
//   OUTPUT_FILENAME: "miftah.csv",
//   DELAY_EACH_TWEET_SECONDS: 0.1,
//   DELAY_EVERY_100_TWEETS_SECONDS: 0,
//   SEARCH_TAB: "TOP",
// });
// crawl({
//   ACCESS_TOKEN: ACCESS_TOKEN,
//   SEARCH_KEYWORDS: `gibran lang:id`,
//   TWEET_THREAD_URL: "https://twitter.com/pangeransiahaan/status/1690590234009112576/retweets",
//   TARGET_TWEET_COUNT: 100000,
//   OUTPUT_FILENAME: "gibran_2025.csv",
//   DELAY_EACH_TWEET_SECONDS: 0.1,
//   DELAY_EVERY_100_TWEETS_SECONDS: 0,
//   SEARCH_TAB: "TOP",
// });
// crawl({
//   ACCESS_TOKEN: ACCESS_TOKEN,
//   SEARCH_KEYWORDS: ``,
//   TWEET_THREAD_URL: "https://twitter.com/infoBMKG/status/1991834483155480835/retweets",
//   TARGET_TWEET_COUNT: 100000,
//   OUTPUT_FILENAME: "bmkg_1.csv",
//   DELAY_EACH_TWEET_SECONDS: 0.1,
//   DELAY_EVERY_100_TWEETS_SECONDS: 10,
//   SEARCH_TAB: "TOP",
// });
(0, crawl_1.crawl)({
    ACCESS_TOKEN: env_1.ACCESS_TOKEN,
    SEARCH_KEYWORDS: "",
    TWEET_THREAD_URL: "https://twitter.com/KemensosRI/status/1986596642263605492/retweets",
    TARGET_TWEET_COUNT: 100000,
    OUTPUT_FILENAME: "kemensos.csv",
    DELAY_EACH_TWEET_SECONDS: 0.1,
    DELAY_EVERY_100_TWEETS_SECONDS: 10,
    SEARCH_TAB: "TOP",
});
// crawl({
//   ACCESS_TOKEN: ACCESS_TOKEN,
//   SEARCH_KEYWORDS: `makan bergizi lang:id`,
//   TARGET_TWEET_COUNT: 50,
//   OUTPUT_FILENAME: "mbg2.csv",
//   DELAY_EACH_TWEET_SECONDS: 0.1,
//   DELAY_EVERY_100_TWEETS_SECONDS: 0,
//   SEARCH_TAB: "TOP",
// });
