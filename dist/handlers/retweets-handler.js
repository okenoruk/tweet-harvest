"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetweetsHandler = void 0;
const lodash_1 = require("lodash");
const base_handler_1 = require("./base-handler");
const constants_1 = require("../utils/constants");
/**
 * Handler for Twitter retweets data
 */
class RetweetsHandler extends base_handler_1.BaseHandler {
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
    constructor(page, filePath, dataFolder, targetCount, timeoutLimit = 2, delaySeconds = 1, delayEvery100Seconds = 1) {
        super(page, filePath, dataFolder, targetCount, timeoutLimit, delaySeconds, delayEvery100Seconds);
    }
    /**
     * Get the URL pattern to listen for
     */
    getUrlPattern() {
        return "Retweeters";
    }
    /**
     * Process the response data
     * @param responseJson Response JSON data
     */
    processResponseData(responseJson) {
        var _a, _b, _c;
        const instructions = (_c = (_b = (_a = responseJson.data) === null || _a === void 0 ? void 0 : _a.retweeters_timeline) === null || _b === void 0 ? void 0 : _b.timeline) === null || _c === void 0 ? void 0 : _c.instructions;
        if (!instructions || !Array.isArray(instructions)) {
            return [];
        }
        // Search for any instruction that has entries
        const entriesInstruction = instructions.find((instruction) => instruction.entries);
        return (entriesInstruction === null || entriesInstruction === void 0 ? void 0 : entriesInstruction.entries) || [];
    }
    /**
     * Get the fields to extract
     */
    getFields() {
        return constants_1.USER_PROFILE_FIELDS;
    }
    /**
     * Process an item for CSV output
     * @param item Item to process
     */
    processItemForCsv(item) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (item.content.entryType === 'TimelineTimelineItem' && ((_c = (_b = (_a = item === null || item === void 0 ? void 0 : item.content) === null || _a === void 0 ? void 0 : _a.itemContent) === null || _b === void 0 ? void 0 : _b.user_results) === null || _c === void 0 ? void 0 : _c.result)) {
            const result = item.content.itemContent.user_results.result;
            const isSuspended = result.__typename === 'UserUnavailable';
            const user = (0, lodash_1.pick)({
                id: result === null || result === void 0 ? void 0 : result.rest_id,
                created_at: ((_d = result.core) === null || _d === void 0 ? void 0 : _d.created_at) || "",
                description: ((_e = result.profile_bio) === null || _e === void 0 ? void 0 : _e.description) || "",
                followers_count: ((_f = result.relationship_counts) === null || _f === void 0 ? void 0 : _f.followers) || 0,
                friends_count: ((_g = result.relationship_counts) === null || _g === void 0 ? void 0 : _g.following) || 0,
                name: ((_h = result.core) === null || _h === void 0 ? void 0 : _h.name) || "",
                profile_image_url_https: ((_j = result.avatar) === null || _j === void 0 ? void 0 : _j.image_url) || "",
                screen_name: ((_k = result.core) === null || _k === void 0 ? void 0 : _k.screen_name) || "",
                statuses_count: ((_l = result.tweet_counts) === null || _l === void 0 ? void 0 : _l.tweets) || 0,
                is_blue_verified: result.is_blue_verified || false,
                profile_description_language: this.cleanText(result.profile_description_language),
                favourites_count: ((_m = result.action_counts) === null || _m === void 0 ? void 0 : _m.favorites_count) || 0
            }, constants_1.USER_PROFILE_FIELDS);
            user["description"] = this.cleanText(user["description"]);
            user["name"] = this.cleanText(user["name"]);
            return (0, lodash_1.pick)(user, this.getFields());
        }
        return null;
    }
    /**
     * Get the name of the items being collected (for logging)
     */
    getItemName() {
        return "user profiles (retweets)";
    }
    /**
     * Get the unique ID of a user profile
     * @param item User profile item
     */
    getUniqueId(item) {
        var _a, _b, _c, _d;
        return ((_d = (_c = (_b = (_a = item.content) === null || _a === void 0 ? void 0 : _a.itemContent) === null || _b === void 0 ? void 0 : _b.user_results) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.rest_id) || item.entryId || null;
    }
}
exports.RetweetsHandler = RetweetsHandler;
