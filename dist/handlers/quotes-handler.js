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
exports.QuotesHandler = void 0;
var lodash_1 = require("lodash");
var base_handler_1 = require("./base-handler");
var constants_1 = require("../utils/constants");
/**
 * Handler for Twitter quotes data
 */
var QuotesHandler = /** @class */ (function (_super) {
    __extends(QuotesHandler, _super);
    /**
     * Constructor for QuotesHandler
     * @param page Playwright page object
     * @param filePath Path to save the CSV file
     * @param dataFolder Folder to save the data
     * @param targetCount Target number of items to collect
     * @param timeoutLimit Number of timeouts before stopping
     * @param delaySeconds Delay between items in seconds
     * @param delayEvery100Seconds Delay after every 100 items in seconds
     */
    function QuotesHandler(page, filePath, dataFolder, targetCount, timeoutLimit, delaySeconds, delayEvery100Seconds) {
        if (timeoutLimit === void 0) { timeoutLimit = 4; }
        if (delaySeconds === void 0) { delaySeconds = 3; }
        if (delayEvery100Seconds === void 0) { delayEvery100Seconds = 5; }
        return _super.call(this, page, filePath, dataFolder, targetCount, timeoutLimit, delaySeconds, delayEvery100Seconds) || this;
    }
    /**
     * Get the URL pattern to listen for
     */
    QuotesHandler.prototype.getUrlPattern = function () {
        return "SearchTimeline";
    };
    /**
     * Process the response data
     * @param responseJson Response JSON data
     */
    QuotesHandler.prototype.processResponseData = function (responseJson) {
        var _a, _b, _c, _d, _e, _f;
        var tweets = [];
        tweets = (_f = (_e = (_d = (_c = (_b = (_a = responseJson.data) === null || _a === void 0 ? void 0 : _a.search_by_raw_query) === null || _b === void 0 ? void 0 : _b.search_timeline) === null || _c === void 0 ? void 0 : _c.timeline) === null || _d === void 0 ? void 0 : _d.instructions) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.entries;
        if (!tweets || !tweets.length) {
            return [];
        }
        // Process tweets to extract content
        return tweets
            .map(function (tweet) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
            var isPromotedTweet = tweet.entryId.includes("promoted");
            if (isPromotedTweet)
                return null;
            if (!((_c = (_b = (_a = tweet === null || tweet === void 0 ? void 0 : tweet.content) === null || _a === void 0 ? void 0 : _a.itemContent) === null || _b === void 0 ? void 0 : _b.tweet_results) === null || _c === void 0 ? void 0 : _c.result))
                return null;
            var result = tweet.content.itemContent.tweet_results.result;
            if (!((_e = (_d = result.tweet) === null || _d === void 0 ? void 0 : _d.core) === null || _e === void 0 ? void 0 : _e.user_results) && !((_f = result.core) === null || _f === void 0 ? void 0 : _f.user_results))
                return null;
            var tweetContent = result.legacy || ((_g = result.tweet) === null || _g === void 0 ? void 0 : _g.legacy);
            var userContent = ((_k = (_j = (_h = result.core) === null || _h === void 0 ? void 0 : _h.user_results) === null || _j === void 0 ? void 0 : _j.result) === null || _k === void 0 ? void 0 : _k.legacy) || ((_p = (_o = (_m = (_l = result.tweet) === null || _l === void 0 ? void 0 : _l.core) === null || _m === void 0 ? void 0 : _m.user_results) === null || _o === void 0 ? void 0 : _o.result) === null || _p === void 0 ? void 0 : _p.legacy);
            var userDetail = ((_r = (_q = result.core) === null || _q === void 0 ? void 0 : _q.user_results) === null || _r === void 0 ? void 0 : _r.result) || ((_u = (_t = (_s = result.tweet) === null || _s === void 0 ? void 0 : _s.core) === null || _t === void 0 ? void 0 : _t.user_results) === null || _u === void 0 ? void 0 : _u.result);
            var views = result.views || ((_v = result.tweet) === null || _v === void 0 ? void 0 : _v.views);
            return {
                tweet: tweetContent,
                user: userContent,
                userDetail: userDetail,
                views: views,
                rest_id: result.rest_id || ((_w = result.tweet) === null || _w === void 0 ? void 0 : _w.rest_id),
                userName: (_x = userDetail === null || userDetail === void 0 ? void 0 : userDetail.core) === null || _x === void 0 ? void 0 : _x.name,
                userScreenName: (_y = userDetail === null || userDetail === void 0 ? void 0 : userDetail.core) === null || _y === void 0 ? void 0 : _y.screen_name,
                userLocation: ((_z = userDetail === null || userDetail === void 0 ? void 0 : userDetail.location) === null || _z === void 0 ? void 0 : _z.location) || ""
            };
        })
            .filter(function (tweet) { return tweet !== null; });
    };
    /**
     * Get the fields to extract
     */
    QuotesHandler.prototype.getFields = function () {
        return __spreadArray(__spreadArray([], constants_1.TWEET_FIELDS, true), ["views_count"], false);
    };
    QuotesHandler.prototype.processItemForCsv = function (item) {
        var _a, _b, _c, _d, _e, _f;
        var tweet = (0, lodash_1.pick)(__assign(__assign({}, item.tweet), { id_str: item.rest_id || item.tweet.id_str, username: item.userScreenName, location: item.userLocation }), constants_1.TWEET_FIELDS);
        var cleanTweetText = "".concat(item.tweet.full_text.replace(/,/g, " ").replace(/\n/g, " "));
        var userScreenName = item.userScreenName || 'i';
        tweet["full_text"] = this.cleanText(cleanTweetText || item.tweet.full_text);
        tweet["tweet_url"] = "https://twitter.com/".concat(userScreenName, "/status/").concat(tweet.id_str);
        tweet["image_url"] = ((_c = (_b = (_a = item.tweet.entities) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.media_url_https) || "";
        tweet["views_count"] = (_d = item.views) === null || _d === void 0 ? void 0 : _d.count;
        tweet["followers"] = (_e = item.user) === null || _e === void 0 ? void 0 : _e.followers_count;
        tweet["following"] = (_f = item.user) === null || _f === void 0 ? void 0 : _f.friends_count;
        return (0, lodash_1.pick)(tweet, this.getFields());
    };
    /**
     * Get the name of the items being collected (for logging)
     */
    QuotesHandler.prototype.getItemName = function () {
        return "quotes";
    };
    /**
     * Get the unique ID of a tweet
     * @param item Tweet item
     */
    QuotesHandler.prototype.getUniqueId = function (item) {
        return item.rest_id;
    };
    return QuotesHandler;
}(base_handler_1.BaseHandler));
exports.QuotesHandler = QuotesHandler;
