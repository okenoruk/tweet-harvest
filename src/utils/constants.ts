import dayjs from "dayjs";

// Twitter search URLs
export const TWITTER_SEARCH_ADVANCED_URL = {
  TOP: "https://twitter.com/search-advanced",
  LATEST: "https://twitter.com/search-advanced?f=live",
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
  "followers",
  "following",
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
  "statuses_count",
  "is_blue_verified",
  "profile_description_language",
  "favourites_count"
];

// Fields to extract from user details (UserByScreenName API)
export const USER_INFO_FIELDS = [
  "id",
  "rest_id",
  "created_at",
  "name",
  "screen_name",
  "description",
  "location",
  "followers_count",
  "friends_count",
  "statuses_count",
  "favourites_count",
  "listed_count",
  "media_count",
  "profile_image_url",
  "profile_banner_url",
  "is_blue_verified",
  "is_identity_verified",
];

// Current timestamp formatted for filenames
export const FORMATTED_TIMESTAMP = dayjs().format("DD-MM-YYYY HH-mm-ss");

// Default folder for saving data
export const DEFAULT_DATA_FOLDER = "./tweets-data";

// Crawl modes
export enum CrawlMode {
  SEARCH = "SEARCH",
  DETAIL = "DETAIL",
  USER_INFO = "USER_INFO"
}

// Search tabs
export enum SearchTab {
  TOP = "TOP",
  LATEST = "LATEST"
}
