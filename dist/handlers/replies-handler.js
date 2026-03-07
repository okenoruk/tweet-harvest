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
exports.RepliesHandler = void 0;
var lodash_1 = require("lodash");
var base_handler_1 = require("./base-handler");
var constants_1 = require("../utils/constants");
/**
 * Handler for Twitter tweet replies
 * Intercepts the TweetDetail API and extracts reply tweets from conversation threads
 */
var RepliesHandler = /** @class */ (function (_super) {
    __extends(RepliesHandler, _super);
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
    function RepliesHandler(page, filePath, dataFolder, targetCount, timeoutLimit, delaySeconds, delayEvery100Seconds) {
        if (timeoutLimit === void 0) { timeoutLimit = 20; }
        if (delaySeconds === void 0) { delaySeconds = 1; }
        if (delayEvery100Seconds === void 0) { delayEvery100Seconds = 1; }
        return _super.call(this, page, filePath, dataFolder, targetCount, timeoutLimit, delaySeconds, delayEvery100Seconds) || this;
    }
    /**
     * Get the URL pattern to listen for
     */
    RepliesHandler.prototype.getUrlPattern = function () {
        return "TweetDetail";
    };
    /**
     * Process the response data from TweetDetail API
     * Extracts all reply tweets from conversation thread entries,
     * skipping the original tweet itself and pagination cursors.
     */
    RepliesHandler.prototype.processResponseData = function (responseJson) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var instructions = (_b = (_a = responseJson.data) === null || _a === void 0 ? void 0 : _a.threaded_conversation_with_injections_v2) === null || _b === void 0 ? void 0 : _b.instructions;
        if (!instructions || !Array.isArray(instructions)) {
            return [];
        }
        // Find the instruction that has entries (TimelineAddEntries)
        var addEntriesInstruction = instructions.find(function (instruction) { return instruction.type === "TimelineAddEntries" && instruction.entries; });
        if (!(addEntriesInstruction === null || addEntriesInstruction === void 0 ? void 0 : addEntriesInstruction.entries)) {
            return [];
        }
        var entries = addEntriesInstruction.entries;
        var replies = [];
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
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
                for (var _l = 0, _m = entry.content.items; _l < _m.length; _l++) {
                    var item = _m[_l];
                    var result = (_g = (_f = (_e = item === null || item === void 0 ? void 0 : item.item) === null || _e === void 0 ? void 0 : _e.itemContent) === null || _f === void 0 ? void 0 : _f.tweet_results) === null || _g === void 0 ? void 0 : _g.result;
                    if (!result || result.__typename !== "Tweet")
                        continue;
                    if (!((_j = (_h = result.core) === null || _h === void 0 ? void 0 : _h.user_results) === null || _j === void 0 ? void 0 : _j.result))
                        continue;
                    var tweetLegacy = result.legacy;
                    var userResult = result.core.user_results.result;
                    var userCore = userResult.core;
                    var userLegacy = userResult.legacy;
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
    };
    /**
     * Get the fields to extract
     */
    RepliesHandler.prototype.getFields = function () {
        return __spreadArray(__spreadArray([], constants_1.TWEET_FIELDS, true), ["views_count"], false);
    };
    /**
     * Process an item for CSV output
     * @param item Item to process
     */
    RepliesHandler.prototype.processItemForCsv = function (item) {
        var _a, _b, _c, _d;
        if (!(item === null || item === void 0 ? void 0 : item.tweet) || !(item === null || item === void 0 ? void 0 : item.userScreenName))
            return null;
        var tweet = (0, lodash_1.pick)(__assign(__assign({}, item.tweet), { id_str: item.rest_id || item.tweet.id_str, username: item.userScreenName, location: item.userLocation }), constants_1.TWEET_FIELDS);
        var userScreenName = item.userScreenName || "i";
        tweet["full_text"] = this.cleanText(item.tweet.full_text);
        tweet["tweet_url"] = "https://twitter.com/".concat(userScreenName, "/status/").concat(tweet.id_str);
        tweet["image_url"] = ((_c = (_b = (_a = item.tweet.entities) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.media_url_https) || "";
        tweet["views_count"] = ((_d = item.views) === null || _d === void 0 ? void 0 : _d.count) || "";
        return (0, lodash_1.pick)(tweet, this.getFields());
    };
    /**
     * Get the name of the items being collected (for logging)
     */
    RepliesHandler.prototype.getItemName = function () {
        return "tweet replies";
    };
    /**
     * Get the unique ID of a tweet reply
     * @param item Tweet reply item
     */
    RepliesHandler.prototype.getUniqueId = function (item) {
        return item.rest_id;
    };
    return RepliesHandler;
}(base_handler_1.BaseHandler));
exports.RepliesHandler = RepliesHandler;
