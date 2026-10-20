"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetsHandler = void 0;
const lodash_1 = require("lodash");
const base_handler_1 = require("./base-handler");
const constants_1 = require("../utils/constants");
const constants_2 = require("../utils/constants");
/**
 * Handler for Twitter tweets data
 */
class TweetsHandler extends base_handler_1.BaseHandler {
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
    constructor(page, filePath, dataFolder, targetCount, crawlMode, timeoutLimit = 4, delaySeconds = 3, delayEvery100Seconds = 5) {
        super(page, filePath, dataFolder, targetCount, timeoutLimit, delaySeconds, delayEvery100Seconds);
        this.crawlMode = crawlMode;
    }
    /**
     * Get the URL pattern to listen for
     */
    getUrlPattern() {
        return this.crawlMode === constants_2.CrawlMode.SEARCH ? "SearchTimeline" : "TweetDetail";
    }
    /**
     * Process the response data
     * @param responseJson Response JSON data
     */
    processResponseData(responseJson) {
        var _a, _b, _c, _d, _e;
        let tweets = [];
        const isTweetDetail = responseJson.data.threaded_conversation_with_injections_v2;
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
            .map((tweet) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
            const isPromotedTweet = tweet.entryId.includes("promoted");
            if (this.crawlMode === constants_2.CrawlMode.SEARCH && !((_c = (_b = (_a = tweet === null || tweet === void 0 ? void 0 : tweet.content) === null || _a === void 0 ? void 0 : _a.itemContent) === null || _b === void 0 ? void 0 : _b.tweet_results) === null || _c === void 0 ? void 0 : _c.result))
                return null;
            if (this.crawlMode === constants_2.CrawlMode.DETAIL) {
                if (!((_g = (_f = (_e = (_d = tweet === null || tweet === void 0 ? void 0 : tweet.content) === null || _d === void 0 ? void 0 : _d.items) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.item) === null || _g === void 0 ? void 0 : _g.itemContent))
                    return null;
                const isMentionThreadCreator = (_s = (_r = (_q = (_p = (_o = (_m = (_l = (_k = (_j = (_h = tweet === null || tweet === void 0 ? void 0 : tweet.content) === null || _h === void 0 ? void 0 : _h.items) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.item) === null || _l === void 0 ? void 0 : _l.itemContent) === null || _m === void 0 ? void 0 : _m.tweet_results) === null || _o === void 0 ? void 0 : _o.result) === null || _p === void 0 ? void 0 : _p.legacy) === null || _q === void 0 ? void 0 : _q.entities) === null || _r === void 0 ? void 0 : _r.user_mentions) === null || _s === void 0 ? void 0 : _s[0];
                if (!isMentionThreadCreator)
                    return null;
            }
            if (isPromotedTweet)
                return null;
            const result = this.crawlMode === constants_2.CrawlMode.SEARCH
                ? tweet.content.itemContent.tweet_results.result
                : (((_t = tweet.content.items) === null || _t === void 0 ? void 0 : _t.length) ? tweet.content.items[0].item.itemContent.tweet_results.result : null);
            if (!result)
                return null;
            if (!((_v = (_u = result.tweet) === null || _u === void 0 ? void 0 : _u.core) === null || _v === void 0 ? void 0 : _v.user_results) && !((_w = result.core) === null || _w === void 0 ? void 0 : _w.user_results))
                return null;
            const tweetContent = result.legacy || ((_x = result.tweet) === null || _x === void 0 ? void 0 : _x.legacy);
            const noteTweet = ((_0 = (_z = (_y = result.note_tweet) === null || _y === void 0 ? void 0 : _y.note_tweet_results) === null || _z === void 0 ? void 0 : _z.result) === null || _0 === void 0 ? void 0 : _0.text) || ""; // Get expanded tweet text if available, otherwise empty string
            const userContent = (_2 = (_1 = result.core) === null || _1 === void 0 ? void 0 : _1.user_results) === null || _2 === void 0 ? void 0 : _2.result;
            const userDetail = ((_4 = (_3 = result.core) === null || _3 === void 0 ? void 0 : _3.user_results) === null || _4 === void 0 ? void 0 : _4.result) || ((_7 = (_6 = (_5 = result.tweet) === null || _5 === void 0 ? void 0 : _5.core) === null || _6 === void 0 ? void 0 : _6.user_results) === null || _7 === void 0 ? void 0 : _7.result);
            const views = result.views || ((_8 = result.tweet) === null || _8 === void 0 ? void 0 : _8.views);
            return {
                tweet: tweetContent,
                noteTweet: noteTweet,
                user: userContent,
                userDetail: userDetail,
                views: views,
                rest_id: result.rest_id || ((_9 = result.tweet) === null || _9 === void 0 ? void 0 : _9.rest_id),
                userName: (_10 = userDetail === null || userDetail === void 0 ? void 0 : userDetail.core) === null || _10 === void 0 ? void 0 : _10.name,
                userScreenName: (_11 = userDetail === null || userDetail === void 0 ? void 0 : userDetail.core) === null || _11 === void 0 ? void 0 : _11.screen_name,
                userLocation: (((_12 = userDetail === null || userDetail === void 0 ? void 0 : userDetail.location) === null || _12 === void 0 ? void 0 : _12.location) || "").replace(/,/g, " ").replace(/\n/g, " ")
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const tweet = (0, lodash_1.pick)(Object.assign(Object.assign({}, item.tweet), { id_str: item.rest_id || item.tweet.id_str, username: item.userScreenName, location: item.userLocation }), constants_1.TWEET_FIELDS);
        let cleanTweetText = `${(item.noteTweet || item.tweet.full_text).replace(/,/g, " ").replace(/\n/g, " ")}`;
        if (this.crawlMode === constants_2.CrawlMode.DETAIL) {
            const firstWord = cleanTweetText.split(" ")[0];
            const replyToUsername = (_c = (_b = (_a = item.tweet.entities) === null || _a === void 0 ? void 0 : _a.user_mentions) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.screen_name;
            // firstWord example: "@someone", the 0 index is " and the 1 index is @
            if ((firstWord.startsWith("@") || firstWord[1] === "@") && replyToUsername) {
                // remove the first word
                cleanTweetText = cleanTweetText.replace(`@${replyToUsername} `, "");
            }
        }
        const userScreenName = item.userScreenName || 'i';
        tweet["full_text"] = this.cleanText(cleanTweetText || item.tweet.full_text);
        tweet["tweet_url"] = `https://twitter.com/${userScreenName}/status/${tweet.id_str}`;
        tweet["image_url"] = ((_f = (_e = (_d = item.tweet.entities) === null || _d === void 0 ? void 0 : _d.media) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.media_url_https) || "";
        tweet["views_count"] = (_g = item.views) === null || _g === void 0 ? void 0 : _g.count;
        tweet["followers"] = (_j = (_h = item.user) === null || _h === void 0 ? void 0 : _h.relationship_counts) === null || _j === void 0 ? void 0 : _j.followers;
        tweet["following"] = (_l = (_k = item.user) === null || _k === void 0 ? void 0 : _k.relationship_counts) === null || _l === void 0 ? void 0 : _l.following;
        return (0, lodash_1.pick)(tweet, this.getFields());
    }
    /**
     * Get the name of the items being collected (for logging)
     */
    getItemName() {
        return "tweets";
    }
    /**
     * Get the unique ID of a tweet
     * @param item Tweet item
     */
    getUniqueId(item) {
        return item.rest_id;
    }
}
exports.TweetsHandler = TweetsHandler;
