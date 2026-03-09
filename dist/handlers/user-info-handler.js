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
exports.UserInfoHandler = void 0;
var lodash_1 = require("lodash");
var base_handler_1 = require("./base-handler");
var constants_1 = require("../utils/constants");
/**
 * Handler for Twitter user information data
 */
var UserInfoHandler = /** @class */ (function (_super) {
    __extends(UserInfoHandler, _super);
    /**
     * Constructor for UserInfoHandler
     * @param page Playwright page object
     * @param filePath Path to save the CSV file
     * @param dataFolder Folder to save the data
     * @param timeoutLimit Number of timeouts before stopping
     * @param delaySeconds Delay between items in seconds
     * @param delayEvery100Seconds Delay after every 100 items in seconds
     */
    function UserInfoHandler(page, filePath, dataFolder, timeoutLimit, delaySeconds, delayEvery100Seconds) {
        if (timeoutLimit === void 0) { timeoutLimit = 4; }
        if (delaySeconds === void 0) { delaySeconds = 3; }
        if (delayEvery100Seconds === void 0) { delayEvery100Seconds = 5; }
        // For user info, we usually fetch one user at a time, so targetCount is 1
        return _super.call(this, page, filePath, dataFolder, 1, timeoutLimit, delaySeconds, delayEvery100Seconds) || this;
    }
    /**
     * Get the URL pattern to listen for
     */
    UserInfoHandler.prototype.getUrlPattern = function () {
        return "UserByScreenName";
    };
    /**
     * Process the response data
     * @param responseJson Response JSON data
     */
    UserInfoHandler.prototype.processResponseData = function (responseJson) {
        var _a, _b;
        var user = (_b = (_a = responseJson.data) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.result;
        if (!user) {
            return [];
        }
        return [user];
    };
    /**
     * Get the fields to extract
     */
    UserInfoHandler.prototype.getFields = function () {
        return constants_1.USER_INFO_FIELDS;
    };
    /**
     * Process an item for CSV output
     * @param item Item to process
     */
    UserInfoHandler.prototype.processItemForCsv = function (item) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        var data = {
            id: item.id,
            rest_id: item.rest_id,
            created_at: (_a = item.core) === null || _a === void 0 ? void 0 : _a.created_at,
            name: (_b = item.core) === null || _b === void 0 ? void 0 : _b.name,
            screen_name: (_c = item.core) === null || _c === void 0 ? void 0 : _c.screen_name,
            description: this.cleanText(((_d = item.legacy) === null || _d === void 0 ? void 0 : _d.description) || ((_e = item.profile_bio) === null || _e === void 0 ? void 0 : _e.description)),
            location: this.cleanText((_f = item.location) === null || _f === void 0 ? void 0 : _f.location),
            followers_count: (_g = item.legacy) === null || _g === void 0 ? void 0 : _g.followers_count,
            friends_count: (_h = item.legacy) === null || _h === void 0 ? void 0 : _h.friends_count,
            statuses_count: (_j = item.legacy) === null || _j === void 0 ? void 0 : _j.statuses_count,
            favourites_count: (_k = item.legacy) === null || _k === void 0 ? void 0 : _k.favourites_count,
            listed_count: (_l = item.legacy) === null || _l === void 0 ? void 0 : _l.listed_count,
            media_count: (_m = item.legacy) === null || _m === void 0 ? void 0 : _m.media_count,
            profile_image_url: (_o = item.avatar) === null || _o === void 0 ? void 0 : _o.image_url,
            profile_banner_url: (_p = item.legacy) === null || _p === void 0 ? void 0 : _p.profile_banner_url,
            is_blue_verified: item.is_blue_verified,
            is_identity_verified: (_q = item.verification_info) === null || _q === void 0 ? void 0 : _q.is_identity_verified,
        };
        return (0, lodash_1.pick)(data, this.getFields());
    };
    /**
     * Get the unique ID of an item
     * @param item Item to get the ID for
     */
    UserInfoHandler.prototype.getUniqueId = function (item) {
        return item.rest_id || item.id;
    };
    /**
     * Get the name of the items being collected (for logging)
     */
    UserInfoHandler.prototype.getItemName = function () {
        return "user information";
    };
    return UserInfoHandler;
}(base_handler_1.BaseHandler));
exports.UserInfoHandler = UserInfoHandler;
