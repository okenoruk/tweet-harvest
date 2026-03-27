import { crawl } from "./crawl";
import { ACCESS_TOKEN } from "./env";

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

// crawl({
//   ACCESS_TOKEN: ACCESS_TOKEN,
//   SEARCH_KEYWORDS: ``,
//   TWEET_THREAD_URL: "https://twitter.com/KemensosRI/status/1986596642263605492/retweets",
//   TARGET_TWEET_COUNT: 100000,
//   OUTPUT_FILENAME: "kemensos_latest.csv",
//   DELAY_EACH_TWEET_SECONDS: 0.1,
//   DELAY_EVERY_100_TWEETS_SECONDS: 10,
//   SEARCH_TAB: "LATEST",
// });

crawl({
  ACCESS_TOKEN: ACCESS_TOKEN,
  TWEET_THREAD_URL: "https://twitter.com/BNPB_Indonesia/status/1998285789864849715/quotes",
  TARGET_TWEET_COUNT: 50,
  OUTPUT_FILENAME: "quotes_test.csv",
  DELAY_EACH_TWEET_SECONDS: 0.1,
  DELAY_EVERY_100_TWEETS_SECONDS: 10,
});

// TEST: Check if existing code handles replies from a plain tweet URL
// Using the same tweet as in tweet-detail.json (BNPB_Indonesia)
// crawl({
//   ACCESS_TOKEN: ACCESS_TOKEN,
//   TWEET_THREAD_URL: "https://twitter.com/BNPB_Indonesia/status/2026826810747715848",
//   TARGET_TWEET_COUNT: 50,
//   OUTPUT_FILENAME: "replies_test.csv",
//   DELAY_EACH_TWEET_SECONDS: 0.1,
//   DELAY_EVERY_100_TWEETS_SECONDS: 0,
// });

// crawl({
//   ACCESS_TOKEN: ACCESS_TOKEN,
//   SEARCH_KEYWORDS: `perang iran lang:id`,
//   TARGET_TWEET_COUNT: 20,
//   DEBUG_MODE: true,
//   OUTPUT_FILENAME: "perang_iran.csv",
//   DELAY_EACH_TWEET_SECONDS: 0.1,
//   DELAY_EVERY_100_TWEETS_SECONDS: 0,
//   SEARCH_TAB: "TOP",
// });

// crawl({
//   ACCESS_TOKEN: ACCESS_TOKEN,
//   SCREEN_NAMES: ["aniesbaswedan", "MiskinTV_", "tirta_cipeng"],
//   DEBUG_MODE: true,
//   OUTPUT_FILENAME: "user_info.csv",
//   DELAY_EACH_TWEET_SECONDS: 0.1,
//   DELAY_EVERY_100_TWEETS_SECONDS: 0,
// });
