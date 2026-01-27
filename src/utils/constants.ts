import dayjs from "dayjs";

// Twitter search URLs
export const TWITTER_SEARCH_ADVANCED_URL = {
  TOP: "https://twitter.com/search-advanced",
  LATEST: "https://twitter.com/search-advanced",
};

// Fields to extract from tweets
export const TWEET_FIELDS = [
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

// Fields to extract from user profiles (used for both favorites and retweets)
export const USER_PROFILE_FIELDS = [
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

// Current timestamp formatted for filenames
export const FORMATTED_TIMESTAMP = dayjs().format("DD-MM-YYYY HH-mm-ss");

// Default folder for saving data
export const DEFAULT_DATA_FOLDER = "./tweets-data";

// Crawl modes
export enum CrawlMode {
  SEARCH = "SEARCH",
  DETAIL = "DETAIL"
}

// Search tabs
export enum SearchTab {
  TOP = "TOP",
  LATEST = "LATEST"
}
