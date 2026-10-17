"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepliesHandler = void 0;
const lodash_1 = require("lodash");
const base_handler_1 = require("./base-handler");
const constants_1 = require("../utils/constants");
/**
 * Handler for Twitter tweet replies
 * Intercepts the TweetDetail API and extracts reply tweets from conversation threads
 */
class RepliesHandler extends base_handler_1.BaseHandler {
    /**
     * Constructor for RepliesHandler
     * @param page Playwright page object
     * @param filePath Path to save the CSV file
     * @param dataFolder Folder to save the data
     * @param targetCount Target number of items to collect
     * @param timeoutLimit Number of timeouts before stopping
     * @param delaySeconds Delay between items in seconds
     * @param delayEvery100Seconds Delay after every 100 items in seconds
     */
    constructor(page, filePath, dataFolder, targetCount, timeoutLimit = 20, delaySeconds = 1, delayEvery100Seconds = 1) {
        super(page, filePath, dataFolder, targetCount, timeoutLimit, delaySeconds, delayEvery100Seconds);
    }
    /**
     * Get the URL pattern to listen for
     */
    getUrlPattern() {
        return "TweetDetail";
    }
    /**
     * Process the response data from TweetDetail API
     * Extracts all reply tweets from conversation thread entries,
     * skipping the original tweet itself and pagination cursors.
     */
    processResponseData(responseJson) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const instructions = (_b = (_a = responseJson.data) === null || _a === void 0 ? void 0 : _a.threaded_conversation_with_injections_v2) === null || _b === void 0 ? void 0 : _b.instructions;
        if (!instructions || !Array.isArray(instructions)) {
            return [];
        }
        // Find the instruction that has entries (TimelineAddEntries)
        const addEntriesInstruction = instructions.find((instruction) => instruction.type === "TimelineAddEntries" && instruction.entries);
        if (!(addEntriesInstruction === null || addEntriesInstruction === void 0 ? void 0 : addEntriesInstruction.entries)) {
            return [];
        }
        const entries = addEntriesInstruction.entries;
        const replies = [];
        for (const entry of entries) {
            // Skip the original tweet (entryId starts with "tweet-")
            if (entry.entryId.startsWith("tweet-"))
                continue;
            // Skip cursor entries (entryId starts with "cursor-")
            if (entry.entryId.startsWith("cursor-"))
                continue;
            // Process conversation thread modules (entryId starts with "conversationthread-")
            if (entry.entryId.startsWith("conversationthread-") &&
                ((_c = entry.content) === null || _c === void 0 ? void 0 : _c.entryType) === "TimelineTimelineModule" &&
                Array.isArray((_d = entry.content) === null || _d === void 0 ? void 0 : _d.items)) {
                for (const item of entry.content.items) {
                    const result = (_g = (_f = (_e = item === null || item === void 0 ? void 0 : item.item) === null || _e === void 0 ? void 0 : _e.itemContent) === null || _f === void 0 ? void 0 : _f.tweet_results) === null || _g === void 0 ? void 0 : _g.result;
                    if (!result || result.__typename !== "Tweet")
                        continue;
                    if (!((_j = (_h = result.core) === null || _h === void 0 ? void 0 : _h.user_results) === null || _j === void 0 ? void 0 : _j.result))
                        continue;
                    const tweetLegacy = result.legacy;
                    const userResult = result.core.user_results.result;
                    const userCore = userResult.core;
                    const userLegacy = userResult.legacy;
                    replies.push({
                        tweet: tweetLegacy,
                        user: userLegacy,
                        userDetail: userResult,
                        views: result.views,
                        rest_id: result.rest_id,
                        userName: userCore === null || userCore === void 0 ? void 0 : userCore.name,
                        userScreenName: userCore === null || userCore === void 0 ? void 0 : userCore.screen_name,
                        userLocation: ((_k = userResult === null || userResult === void 0 ? void 0 : userResult.location) === null || _k === void 0 ? void 0 : _k.location) || "",
                    });
                }
            }
        }
        return replies;
    }
    /**
     * Get the fields to extract
     */
    getFields() {
        return [...constants_1.TWEET_FIELDS, "views_count"];
    }
    /**
     * Process an item for CSV output
     * @param item Item to process
     */
    processItemForCsv(item) {
        var _a, _b, _c, _d, _e, _f;
        if (!(item === null || item === void 0 ? void 0 : item.tweet) || !(item === null || item === void 0 ? void 0 : item.userScreenName))
            return null;
        const tweet = (0, lodash_1.pick)(Object.assign(Object.assign({}, item.tweet), { id_str: item.rest_id || item.tweet.id_str, username: item.userScreenName, location: item.userLocation }), constants_1.TWEET_FIELDS);
        const userScreenName = item.userScreenName || "i";
        tweet["full_text"] = this.cleanText(item.tweet.full_text);
        tweet["tweet_url"] = `https://twitter.com/${userScreenName}/status/${tweet.id_str}`;
        tweet["image_url"] = ((_c = (_b = (_a = item.tweet.entities) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.media_url_https) || "";
        tweet["views_count"] = ((_d = item.views) === null || _d === void 0 ? void 0 : _d.count) || "";
        tweet["followers"] = (_e = item.user) === null || _e === void 0 ? void 0 : _e.followers_count;
        tweet["following"] = (_f = item.user) === null || _f === void 0 ? void 0 : _f.friends_count;
        return (0, lodash_1.pick)(tweet, this.getFields());
    }
    /**
     * Get the name of the items being collected (for logging)
     */
    getItemName() {
        return "tweet replies";
    }
    /**
     * Get the unique ID of a tweet reply
     * @param item Tweet reply item
     */
    getUniqueId(item) {
        return item.rest_id;
    }
}
exports.RepliesHandler = RepliesHandler;
