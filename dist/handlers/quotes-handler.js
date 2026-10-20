"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotesHandler = void 0;
const lodash_1 = require("lodash");
const base_handler_1 = require("./base-handler");
const constants_1 = require("../utils/constants");
/**
 * Handler for Twitter quotes data
 */
class QuotesHandler extends base_handler_1.BaseHandler {
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
    constructor(page, filePath, dataFolder, targetCount, timeoutLimit = 4, delaySeconds = 3, delayEvery100Seconds = 5) {
        super(page, filePath, dataFolder, targetCount, timeoutLimit, delaySeconds, delayEvery100Seconds);
    }
    /**
     * Get the URL pattern to listen for
     */
    getUrlPattern() {
        return "SearchTimeline";
    }
    /**
     * Process the response data
     * @param responseJson Response JSON data
     */
    processResponseData(responseJson) {
        var _a, _b, _c, _d, _e, _f;
        let tweets = [];
        tweets = (_f = (_e = (_d = (_c = (_b = (_a = responseJson.data) === null || _a === void 0 ? void 0 : _a.search_by_raw_query) === null || _b === void 0 ? void 0 : _b.search_timeline) === null || _c === void 0 ? void 0 : _c.timeline) === null || _d === void 0 ? void 0 : _d.instructions) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.entries;
        if (!tweets || !tweets.length) {
            return [];
        }
        // Process tweets to extract content
        return tweets
            .map((tweet) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
            const isPromotedTweet = tweet.entryId.includes("promoted");
            if (isPromotedTweet)
                return null;
            if (!((_c = (_b = (_a = tweet === null || tweet === void 0 ? void 0 : tweet.content) === null || _a === void 0 ? void 0 : _a.itemContent) === null || _b === void 0 ? void 0 : _b.tweet_results) === null || _c === void 0 ? void 0 : _c.result))
                return null;
            const result = tweet.content.itemContent.tweet_results.result;
            if (!((_e = (_d = result.tweet) === null || _d === void 0 ? void 0 : _d.core) === null || _e === void 0 ? void 0 : _e.user_results) && !((_f = result.core) === null || _f === void 0 ? void 0 : _f.user_results))
                return null;
            const tweetContent = result.legacy || ((_g = result.tweet) === null || _g === void 0 ? void 0 : _g.legacy);
            const userContent = (_j = (_h = result.core) === null || _h === void 0 ? void 0 : _h.user_results) === null || _j === void 0 ? void 0 : _j.result;
            const userDetail = ((_l = (_k = result.core) === null || _k === void 0 ? void 0 : _k.user_results) === null || _l === void 0 ? void 0 : _l.result) || ((_p = (_o = (_m = result.tweet) === null || _m === void 0 ? void 0 : _m.core) === null || _o === void 0 ? void 0 : _o.user_results) === null || _p === void 0 ? void 0 : _p.result);
            const views = result.views || ((_q = result.tweet) === null || _q === void 0 ? void 0 : _q.views);
            return {
                tweet: tweetContent,
                user: userContent,
                userDetail: userDetail,
                views: views,
                rest_id: result.rest_id || ((_r = result.tweet) === null || _r === void 0 ? void 0 : _r.rest_id),
                userName: (_s = userDetail === null || userDetail === void 0 ? void 0 : userDetail.core) === null || _s === void 0 ? void 0 : _s.name,
                userScreenName: (_t = userDetail === null || userDetail === void 0 ? void 0 : userDetail.core) === null || _t === void 0 ? void 0 : _t.screen_name,
                userLocation: (((_u = userDetail === null || userDetail === void 0 ? void 0 : userDetail.location) === null || _u === void 0 ? void 0 : _u.location) || "").replace(/,/g, " ").replace(/\n/g, " ")
            };
        })
            .filter((tweet) => tweet !== null);
    }
    /**
     * Get the fields to extract
     */
    getFields() {
        return [...constants_1.TWEET_FIELDS, "views_count"];
    }
    processItemForCsv(item) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const tweet = (0, lodash_1.pick)(Object.assign(Object.assign({}, item.tweet), { id_str: item.rest_id || item.tweet.id_str, username: item.userScreenName, location: item.userLocation }), constants_1.TWEET_FIELDS);
        let cleanTweetText = `${item.tweet.full_text.replace(/,/g, " ").replace(/\n/g, " ")}`;
        const userScreenName = item.userScreenName || 'i';
        tweet["full_text"] = this.cleanText(cleanTweetText || item.tweet.full_text);
        tweet["tweet_url"] = `https://twitter.com/${userScreenName}/status/${tweet.id_str}`;
        tweet["image_url"] = ((_c = (_b = (_a = item.tweet.entities) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.media_url_https) || "";
        tweet["views_count"] = (_d = item.views) === null || _d === void 0 ? void 0 : _d.count;
        tweet["followers"] = (_f = (_e = item.user) === null || _e === void 0 ? void 0 : _e.relationship_counts) === null || _f === void 0 ? void 0 : _f.followers;
        tweet["following"] = (_h = (_g = item.user) === null || _g === void 0 ? void 0 : _g.relationship_counts) === null || _h === void 0 ? void 0 : _h.following;
        return (0, lodash_1.pick)(tweet, this.getFields());
    }
    /**
     * Get the name of the items being collected (for logging)
     */
    getItemName() {
        return "quotes";
    }
    /**
     * Get the unique ID of a tweet
     * @param item Tweet item
     */
    getUniqueId(item) {
        return item.rest_id;
    }
}
exports.QuotesHandler = QuotesHandler;
