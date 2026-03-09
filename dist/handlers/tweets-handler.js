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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
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
            var tweetContent = result.legacy || ((_w = result.tweet) === null || _w === void 0 ? void 0 : _w.legacy);
            var userContent = ((_z = (_y = (_x = result.core) === null || _x === void 0 ? void 0 : _x.user_results) === null || _y === void 0 ? void 0 : _y.result) === null || _z === void 0 ? void 0 : _z.legacy) || ((_3 = (_2 = (_1 = (_0 = result.tweet) === null || _0 === void 0 ? void 0 : _0.core) === null || _1 === void 0 ? void 0 : _1.user_results) === null || _2 === void 0 ? void 0 : _2.result) === null || _3 === void 0 ? void 0 : _3.legacy);
            var userDetail = ((_5 = (_4 = result.core) === null || _4 === void 0 ? void 0 : _4.user_results) === null || _5 === void 0 ? void 0 : _5.result) || ((_8 = (_7 = (_6 = result.tweet) === null || _6 === void 0 ? void 0 : _6.core) === null || _7 === void 0 ? void 0 : _7.user_results) === null || _8 === void 0 ? void 0 : _8.result);
            var views = result.views || ((_9 = result.tweet) === null || _9 === void 0 ? void 0 : _9.views);
            return {
                tweet: tweetContent,
                user: userContent,
                userDetail: userDetail,
                views: views,
                rest_id: result.rest_id || ((_10 = result.tweet) === null || _10 === void 0 ? void 0 : _10.rest_id),
                userName: (_11 = userDetail === null || userDetail === void 0 ? void 0 : userDetail.core) === null || _11 === void 0 ? void 0 : _11.name,
                userScreenName: (_12 = userDetail === null || userDetail === void 0 ? void 0 : userDetail.core) === null || _12 === void 0 ? void 0 : _12.screen_name,
                userLocation: ((_13 = userDetail === null || userDetail === void 0 ? void 0 : userDetail.location) === null || _13 === void 0 ? void 0 : _13.location) || ""
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
    TweetsHandler.prototype.processItemForCsv = function (item) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var tweet = (0, lodash_1.pick)(__assign(__assign({}, item.tweet), { id_str: item.rest_id || item.tweet.id_str, username: item.userScreenName, location: item.userLocation }), constants_1.TWEET_FIELDS);
        var cleanTweetText = "".concat(item.tweet.full_text.replace(/,/g, " ").replace(/\n/g, " "));
        if (this.crawlMode === constants_2.CrawlMode.DETAIL) {
            var firstWord = cleanTweetText.split(" ")[0];
            var replyToUsername = (_c = (_b = (_a = item.tweet.entities) === null || _a === void 0 ? void 0 : _a.user_mentions) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.screen_name;
            // firstWord example: "@someone", the 0 index is " and the 1 index is @
            if ((firstWord.startsWith("@") || firstWord[1] === "@") && replyToUsername) {
                // remove the first word
                cleanTweetText = cleanTweetText.replace("@".concat(replyToUsername, " "), "");
            }
        }
        var userScreenName = item.userScreenName || 'i';
        tweet["full_text"] = this.cleanText(cleanTweetText || item.tweet.full_text);
        tweet["tweet_url"] = "https://twitter.com/".concat(userScreenName, "/status/").concat(tweet.id_str);
        tweet["image_url"] = ((_f = (_e = (_d = item.tweet.entities) === null || _d === void 0 ? void 0 : _d.media) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.media_url_https) || "";
        tweet["views_count"] = (_g = item.views) === null || _g === void 0 ? void 0 : _g.count;
        tweet["followers"] = (_h = item.user) === null || _h === void 0 ? void 0 : _h.followers_count;
        tweet["following"] = (_j = item.user) === null || _j === void 0 ? void 0 : _j.friends_count;
        return (0, lodash_1.pick)(tweet, this.getFields());
    };
    /**
     * Get the name of the items being collected (for logging)
     */
    TweetsHandler.prototype.getItemName = function () {
        return "tweets";
    };
    /**
     * Get the unique ID of a tweet
     * @param item Tweet item
     */
    TweetsHandler.prototype.getUniqueId = function (item) {
        return item.rest_id;
    };
    return TweetsHandler;
}(base_handler_1.BaseHandler));
exports.TweetsHandler = TweetsHandler;
