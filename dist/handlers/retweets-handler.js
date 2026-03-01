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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetweetsHandler = void 0;
var lodash_1 = require("lodash");
var base_handler_1 = require("./base-handler");
var constants_1 = require("../utils/constants");
/**
 * Handler for Twitter retweets data
 */
var RetweetsHandler = /** @class */ (function (_super) {
    __extends(RetweetsHandler, _super);
    /**
     * Constructor for RetweetsHandler
     * @param page Playwright page object
     * @param filePath Path to save the CSV file
     * @param dataFolder Folder to save the data
     * @param targetCount Target number of items to collect
     * @param timeoutLimit Number of timeouts before stopping
     * @param delaySeconds Delay between items in seconds
     * @param delayEvery100Seconds Delay after every 100 items in seconds
     */
    function RetweetsHandler(page, filePath, dataFolder, targetCount, timeoutLimit, delaySeconds, delayEvery100Seconds) {
        if (timeoutLimit === void 0) { timeoutLimit = 2; }
        if (delaySeconds === void 0) { delaySeconds = 1; }
        if (delayEvery100Seconds === void 0) { delayEvery100Seconds = 1; }
        return _super.call(this, page, filePath, dataFolder, targetCount, timeoutLimit, delaySeconds, delayEvery100Seconds) || this;
    }
    /**
     * Get the URL pattern to listen for
     */
    RetweetsHandler.prototype.getUrlPattern = function () {
        return "Retweeters";
    };
    /**
     * Process the response data
     * @param responseJson Response JSON data
     */
    RetweetsHandler.prototype.processResponseData = function (responseJson) {
        var _a, _b, _c;
        var instructions = (_c = (_b = (_a = responseJson.data) === null || _a === void 0 ? void 0 : _a.retweeters_timeline) === null || _b === void 0 ? void 0 : _b.timeline) === null || _c === void 0 ? void 0 : _c.instructions;
        if (!instructions || !Array.isArray(instructions)) {
            return [];
        }
        // Search for any instruction that has entries
        var entriesInstruction = instructions.find(function (instruction) { return instruction.entries; });
        return (entriesInstruction === null || entriesInstruction === void 0 ? void 0 : entriesInstruction.entries) || [];
    };
    /**
     * Get the fields to extract
     */
    RetweetsHandler.prototype.getFields = function () {
        return constants_1.USER_PROFILE_FIELDS;
    };
    /**
     * Process an item for CSV output
     * @param item Item to process
     */
    RetweetsHandler.prototype.processItemForCsv = function (item) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (item.content.entryType === 'TimelineTimelineItem' && ((_c = (_b = (_a = item === null || item === void 0 ? void 0 : item.content) === null || _a === void 0 ? void 0 : _a.itemContent) === null || _b === void 0 ? void 0 : _b.user_results) === null || _c === void 0 ? void 0 : _c.result)) {
            var result = item.content.itemContent.user_results.result;
            var isSuspended = result.__typename === 'UserUnavailable';
            var user = (0, lodash_1.pick)({
                id: result === null || result === void 0 ? void 0 : result.rest_id,
                created_at: ((_d = result.core) === null || _d === void 0 ? void 0 : _d.created_at) || "",
                description: ((_e = result.legacy) === null || _e === void 0 ? void 0 : _e.description) || "",
                followers_count: ((_f = result.legacy) === null || _f === void 0 ? void 0 : _f.followers_count) || 0,
                friends_count: ((_g = result.legacy) === null || _g === void 0 ? void 0 : _g.friends_count) || 0,
                name: ((_h = result.core) === null || _h === void 0 ? void 0 : _h.name) || "",
                profile_image_url_https: ((_j = result.avatar) === null || _j === void 0 ? void 0 : _j.image_url) || "",
                screen_name: ((_k = result.core) === null || _k === void 0 ? void 0 : _k.screen_name) || "",
                statuses_count: ((_l = result.legacy) === null || _l === void 0 ? void 0 : _l.statuses_count) || 0,
                is_blue_verified: result.is_blue_verified || false,
                profile_description_language: result.profile_description_language || "unknown",
                favourites_count: ((_m = result.legacy) === null || _m === void 0 ? void 0 : _m.favourites_count) || 0
            }, constants_1.USER_PROFILE_FIELDS);
            // Clean text fields
            var description = user["description"] || "";
            var name_1 = user["name"] || "";
            user["description"] = description.replace(/,/g, " ").replace(/\n/g, " ");
            user["name"] = name_1.replace(/,/g, " ").replace(/\n/g, " ");
            return user;
        }
        return null;
    };
    /**
     * Get the name of the items being collected (for logging)
     */
    RetweetsHandler.prototype.getItemName = function () {
        return "user profiles (retweets)";
    };
    return RetweetsHandler;
}(base_handler_1.BaseHandler));
exports.RetweetsHandler = RetweetsHandler;
