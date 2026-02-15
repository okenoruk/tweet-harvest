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
        var _a, _b, _c, _d, _e;
        if (!((_e = (_d = (_c = (_b = (_a = responseJson.data) === null || _a === void 0 ? void 0 : _a.retweeters_timeline) === null || _b === void 0 ? void 0 : _b.timeline) === null || _c === void 0 ? void 0 : _c.instructions) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.entries)) {
            return [];
        }
        return responseJson.data.retweeters_timeline.timeline.instructions[0].entries;
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
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (item.entryId.indexOf('user') > -1 && ((_c = (_b = (_a = item === null || item === void 0 ? void 0 : item.content) === null || _a === void 0 ? void 0 : _a.itemContent) === null || _b === void 0 ? void 0 : _b.user_results) === null || _c === void 0 ? void 0 : _c.result)) {
            var user = (0, lodash_1.pick)(__assign({ id: (_g = (_f = (_e = (_d = item === null || item === void 0 ? void 0 : item.content) === null || _d === void 0 ? void 0 : _d.itemContent) === null || _e === void 0 ? void 0 : _e.user_results) === null || _f === void 0 ? void 0 : _f.result) === null || _g === void 0 ? void 0 : _g.id }, item.content.itemContent.user_results.result.legacy), constants_1.USER_PROFILE_FIELDS);
            // Clean text fields
            var description = item.content.itemContent.user_results.result.legacy.description || "";
            // Use type assertion to handle potential missing properties
            var name_1 = ((_h = item.content.itemContent.user_results.result.core) === null || _h === void 0 ? void 0 : _h.name) ||
                item.content.itemContent.user_results.result.legacy.name || "";
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
