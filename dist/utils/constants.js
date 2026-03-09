"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchTab = exports.CrawlMode = exports.DEFAULT_DATA_FOLDER = exports.FORMATTED_TIMESTAMP = exports.USER_INFO_FIELDS = exports.USER_PROFILE_FIELDS = exports.TWEET_FIELDS = exports.TWITTER_SEARCH_ADVANCED_URL = void 0;
var dayjs_1 = __importDefault(require("dayjs"));
// Twitter search URLs
exports.TWITTER_SEARCH_ADVANCED_URL = {
    TOP: "https://twitter.com/search-advanced",
    LATEST: "https://twitter.com/search-advanced",
};
// Fields to extract from tweets
exports.TWEET_FIELDS = [
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
exports.USER_PROFILE_FIELDS = [
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
exports.USER_INFO_FIELDS = [
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
exports.FORMATTED_TIMESTAMP = (0, dayjs_1.default)().format("DD-MM-YYYY HH-mm-ss");
// Default folder for saving data
exports.DEFAULT_DATA_FOLDER = "./tweets-data";
// Crawl modes
var CrawlMode;
(function (CrawlMode) {
    CrawlMode["SEARCH"] = "SEARCH";
    CrawlMode["DETAIL"] = "DETAIL";
    CrawlMode["USER_INFO"] = "USER_INFO";
})(CrawlMode || (exports.CrawlMode = CrawlMode = {}));
// Search tabs
var SearchTab;
(function (SearchTab) {
    SearchTab["TOP"] = "TOP";
    SearchTab["LATEST"] = "LATEST";
})(SearchTab || (exports.SearchTab = SearchTab = {}));
