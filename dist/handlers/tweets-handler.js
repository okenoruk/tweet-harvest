"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetsHandler = void 0;
var lodash_1 = require("lodash");
var base_handler_1 = require("./base-handler");
var constants_1 = require("../utils/constants");
var constants_2 = require("../utils/constants");
/**
 * Handler for Twitter tweets data
 */
var TweetsHandler = /** @class */ (function (_super) {
    __extends(TweetsHandler, _super);
    /**
     * Constructor for TweetsHandler
     * @param page Playwright page object
     * @param filePath Path to save the CSV file
     * @param dataFolder Folder to save the data
     * @param targetCount Target number of items to collect
     * @param crawlMode Crawl mode (SEARCH or DETAIL)
     * @param timeoutLimit Number of timeouts before stopping
     * @param delaySeconds Delay between items in seconds
     * @param delayEvery100Seconds Delay after every 100 items in seconds
     */
    function TweetsHandler(page, filePath, dataFolder, targetCount, crawlMode, timeoutLimit, delaySeconds, delayEvery100Seconds) {
        if (timeoutLimit === void 0) { timeoutLimit = 4; }
        if (delaySeconds === void 0) { delaySeconds = 3; }
        if (delayEvery100Seconds === void 0) { delayEvery100Seconds = 5; }
        var _this = _super.call(this, page, filePath, dataFolder, targetCount, timeoutLimit, delaySeconds, delayEvery100Seconds) || this;
        _this.crawlMode = crawlMode;
        return _this;
    }
    /**
     * Get the URL pattern to listen for
     */
    TweetsHandler.prototype.getUrlPattern = function () {
        return this.crawlMode === constants_2.CrawlMode.SEARCH ? "SearchTimeline" : "TweetDetail";
    };
    /**
     * Process the response data
     * @param responseJson Response JSON data
     */
    TweetsHandler.prototype.processResponseData = function (responseJson) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        var tweets = [];
        var isTweetDetail = responseJson.data.threaded_conversation_with_injections_v2;
        if (isTweetDetail) {
            tweets = (_a = responseJson.data) === null || _a === void 0 ? void 0 : _a.threaded_conversation_with_injections_v2.instructions[0].entries;
        }
        else {
            tweets = (_e = (_d = (_c = (_b = responseJson.data) === null || _b === void 0 ? void 0 : _b.search_by_raw_query.search_timeline.timeline) === null || _c === void 0 ? void 0 : _c.instructions) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.entries;
        }
        if (!tweets || !tweets.length) {
            return [];
        }
        // Process tweets to extract content
        return tweets
            .map(function (tweet) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
            var isPromotedTweet = tweet.entryId.includes("promoted");
            if (_this.crawlMode === constants_2.CrawlMode.SEARCH && !((_c = (_b = (_a = tweet === null || tweet === void 0 ? void 0 : tweet.content) === null || _a === void 0 ? void 0 : _a.itemContent) === null || _b === void 0 ? void 0 : _b.tweet_results) === null || _c === void 0 ? void 0 : _c.result))
                return null;
            if (_this.crawlMode === constants_2.CrawlMode.DETAIL) {
                if (!((_g = (_f = (_e = (_d = tweet === null || tweet === void 0 ? void 0 : tweet.content) === null || _d === void 0 ? void 0 : _d.items) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.item) === null || _g === void 0 ? void 0 : _g.itemContent))
                    return null;
                var isMentionThreadCreator = (_s = (_r = (_q = (_p = (_o = (_m = (_l = (_k = (_j = (_h = tweet === null || tweet === void 0 ? void 0 : tweet.content) === null || _h === void 0 ? void 0 : _h.items) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.item) === null || _l === void 0 ? void 0 : _l.itemContent) === null || _m === void 0 ? void 0 : _m.tweet_results) === null || _o === void 0 ? void 0 : _o.result) === null || _p === void 0 ? void 0 : _p.legacy) === null || _q === void 0 ? void 0 : _q.entities) === null || _r === void 0 ? void 0 : _r.user_mentions) === null || _s === void 0 ? void 0 : _s[0];
                if (!isMentionThreadCreator)
                    return null;
            }
            if (isPromotedTweet)
                return null;
            var result = _this.crawlMode === constants_2.CrawlMode.SEARCH
                ? tweet.content.itemContent.tweet_results.result
                : tweet.content.items[0].item.itemContent.tweet_results.result;
            if (!((_u = (_t = result.tweet) === null || _t === void 0 ? void 0 : _t.core) === null || _u === void 0 ? void 0 : _u.user_results) && !((_v = result.core) === null || _v === void 0 ? void 0 : _v.user_results))
                return null;
            var tweetContent = result.legacy || result.tweet.legacy;
            var userContent = ((_y = (_x = (_w = result.core) === null || _w === void 0 ? void 0 : _w.user_results) === null || _x === void 0 ? void 0 : _x.result) === null || _y === void 0 ? void 0 : _y.legacy) || result.tweet.core.user_results.result.legacy;
            var userDetail = ((_0 = (_z = result.core) === null || _z === void 0 ? void 0 : _z.user_results) === null || _0 === void 0 ? void 0 : _0.result) || result.tweet.core.user_results.result;
            var views = result.views || ((_1 = result.tweet) === null || _1 === void 0 ? void 0 : _1.views);
            return {
                tweet: tweetContent,
                user: userContent,
                userDetail: userDetail,
                views: views
            };
        })
            .filter(function (tweet) { return tweet !== null; });
    };
    /**
     * Get the fields to extract
     */
    TweetsHandler.prototype.getFields = function () {
        return __spreadArray(__spreadArray([], constants_1.TWEET_FIELDS, true), ["views_count"], false);
    };
    /**
     * Process an item for CSV output
     * @param item Item to process
     */
    TweetsHandler.prototype.processItemForCsv = function (item) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var tweet = (0, lodash_1.pick)(item.tweet, constants_1.TWEET_FIELDS);
        var cleanTweetText = "".concat(item.tweet.full_text.replace(/,/g, " ").replace(/\n/g, " "));
        if (this.crawlMode === constants_2.CrawlMode.DETAIL) {
            var firstWord = cleanTweetText.split(" ")[0];
            var replyToUsername = (_c = (_b = (_a = item.tweet.entities) === null || _a === void 0 ? void 0 : _a.user_mentions) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.screen_name;
            // firstWord example: "@someone", the 0 index is " and the 1 index is @
            if (firstWord[1] === "@" && replyToUsername) {
                // remove the first word
                cleanTweetText = cleanTweetText.replace("@".concat(replyToUsername, " "), "");
            }
        }
        var userName = ((_e = (_d = item.userDetail) === null || _d === void 0 ? void 0 : _d.core) === null || _e === void 0 ? void 0 : _e.screen_name) || ((_f = item.userDetail) === null || _f === void 0 ? void 0 : _f.screen_name);
        tweet["full_text"] = cleanTweetText;
        tweet["username"] = userName;
        tweet["tweet_url"] = "https://twitter.com/".concat(userName, "/status/").concat(tweet.id_str);
        tweet["image_url"] = ((_j = (_h = (_g = item.tweet.entities) === null || _g === void 0 ? void 0 : _g.media) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.media_url_https) || "";
        tweet["location"] = ((_l = (_k = item.userDetail) === null || _k === void 0 ? void 0 : _k.location) === null || _l === void 0 ? void 0 : _l.location) || "";
        tweet["views_count"] = (_m = item.views) === null || _m === void 0 ? void 0 : _m.count;
        return tweet;
    };
    /**
     * Get the name of the items being collected (for logging)
     */
    TweetsHandler.prototype.getItemName = function () {
        return "tweets";
    };
    return TweetsHandler;
}(base_handler_1.BaseHandler));
exports.TweetsHandler = TweetsHandler;
