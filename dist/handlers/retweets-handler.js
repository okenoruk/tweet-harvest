"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetweetsHandler = void 0;
const lodash_1 = require("lodash");
const chalk_1 = __importDefault(require("chalk"));
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
        this.initialHtmlBodies = [];
        this.seenTimelineIds = new Set();
        // 1. Listen for network responses that could contain the initial HTML with retweeters data
        this.page.on("response", (response) => __awaiter(this, void 0, void 0, function* () {
            try {
                const url = response.url();
                const resourceType = response.request().resourceType();
                if (resourceType === "document" || url.includes("/retweets")) {
                    const contentType = response.headers()["content-type"] || "";
                    if (contentType.includes("text/html") || contentType.includes("javascript") || !contentType) {
                        const text = yield response.text();
                        if (text && text.includes("retweeters_timeline")) {
                            this.initialHtmlBodies.push(text);
                        }
                    }
                }
            }
            catch (_a) {
                // Ignore errors if response cannot be read (e.g. redirected or closed)
            }
        }));
        // 2. Add an init script to capture the script element content before document.currentScript.remove() runs
        this.page.addInitScript(() => {
            try {
                const origRemove = Element.prototype.remove;
                Element.prototype.remove = function () {
                    try {
                        if (this && this.tagName === "SCRIPT" && this.textContent && this.textContent.includes("retweeters_timeline")) {
                            const win = window;
                            win.__initialRetweeterScripts = win.__initialRetweeterScripts || [];
                            win.__initialRetweeterScripts.push(this.textContent);
                        }
                    }
                    catch (_a) { }
                    return origRemove.call(this);
                };
                const origRemoveChild = Node.prototype.removeChild;
                Node.prototype.removeChild = function (child) {
                    try {
                        if (child && child.tagName === "SCRIPT" && child.textContent && child.textContent.includes("retweeters_timeline")) {
                            const win = window;
                            win.__initialRetweeterScripts = win.__initialRetweeterScripts || [];
                            win.__initialRetweeterScripts.push(child.textContent);
                        }
                    }
                    catch (_a) { }
                    return origRemoveChild.call(this, child);
                };
            }
            catch (_a) { }
        }).catch(() => { });
    }
    /**
     * Get the URL pattern to listen for
     */
    getUrlPattern() {
        return "Retweeters";
    }
    /**
     * Main method to collect retweets data
     * Overrides BaseHandler.collect() to extract initial retweeters from the page before Retweeters API is hit
     */
    collect() {
        const _super = Object.create(null, {
            collect: { get: () => super.collect }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // Process initial retweeters from the page before Retweeters API is hit
            yield this.collectInitialRetweeters();
            // If target has already been met from initial page script data, return immediately
            if (this.allData.length >= this.targetCount) {
                return this.allData;
            }
            return _super.collect.call(this);
        });
    }
    /**
     * Collect retweeters that are embedded in the initial page HTML / script tag
     * before the Retweeters API is triggered by scrolling.
     */
    collectInitialRetweeters() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const textSources = [...this.initialHtmlBodies];
            // 1. Get scripts captured right before removal via init script
            try {
                const removedScripts = yield this.page.evaluate(() => {
                    return window.__initialRetweeterScripts || [];
                });
                if (Array.isArray(removedScripts)) {
                    textSources.push(...removedScripts);
                }
            }
            catch (_d) {
                // Ignore evaluate error if page is not ready
            }
            // 2. Check any remaining script tags in DOM
            try {
                const domScripts = yield this.page.evaluate(() => {
                    return Array.from(document.querySelectorAll("script")).map((s) => s.textContent || "");
                });
                if (Array.isArray(domScripts)) {
                    textSources.push(...domScripts);
                }
            }
            catch (_e) {
                // Ignore
            }
            // 3. Fallback: Check full page content
            try {
                const pageContent = yield this.page.content();
                if (pageContent) {
                    textSources.push(pageContent);
                }
            }
            catch (_f) {
                // Ignore
            }
            for (const text of textSources) {
                if (!text || !text.includes("retweeters_timeline"))
                    continue;
                const timelineObjects = this.parseTimelineFromText(text);
                for (const timelineObj of timelineObjects) {
                    const timelineId = ((_b = (_a = timelineObj === null || timelineObj === void 0 ? void 0 : timelineObj.data) === null || _a === void 0 ? void 0 : _a.retweeters_timeline) === null || _b === void 0 ? void 0 : _b.id) || ((_c = timelineObj === null || timelineObj === void 0 ? void 0 : timelineObj.retweeters_timeline) === null || _c === void 0 ? void 0 : _c.id);
                    if (timelineId) {
                        if (this.seenTimelineIds.has(timelineId))
                            continue;
                        this.seenTimelineIds.add(timelineId);
                    }
                    const entries = this.processResponseData(timelineObj);
                    if (!entries || entries.length === 0)
                        continue;
                    const validUniqueItems = [];
                    for (const item of entries) {
                        const id = this.getUniqueId(item);
                        if (id) {
                            if (this.seenIds.has(id))
                                continue;
                            this.seenIds.add(id);
                        }
                        if (this.processItemForCsv(item)) {
                            validUniqueItems.push(item);
                        }
                    }
                    if (validUniqueItems.length > 0) {
                        this.allData.push(...validUniqueItems);
                        yield this.writeItemsToCsv(validUniqueItems);
                        console.info(chalk_1.default.green(`Retrieved ${validUniqueItems.length} initial ${this.getItemName()} from page script tag before API call`));
                        yield this.handleDelays(validUniqueItems.length);
                    }
                }
            }
        });
    }
    /**
     * Parse timeline data object from text containing retweeters_timeline
     * @param text Text containing the script or HTML
     */
    parseTimelineFromText(text) {
        var _a;
        if (!text || !text.includes("retweeters_timeline")) {
            return [];
        }
        const results = [];
        const target = "retweeters_timeline";
        let pos = 0;
        while ((pos = text.indexOf(target, pos)) !== -1) {
            let parsedObj = null;
            // Strategy 1: Look for 'value' before target
            const valueIdx = text.lastIndexOf("value", pos);
            if (valueIdx !== -1 && pos - valueIdx < 1000) {
                const afterValue = text.slice(valueIdx);
                const colonOffset = afterValue.indexOf(":");
                if (colonOffset !== -1) {
                    const sub = afterValue.slice(colonOffset + 1);
                    const match = sub.match(/\S/);
                    if (match && match.index !== undefined) {
                        const firstChar = match[0];
                        const charIndex = valueIdx + colonOffset + 1 + match.index;
                        if (firstChar === '"') {
                            // Quoted JSON string literal
                            let endQuote = -1;
                            let escaped = false;
                            for (let i = charIndex + 1; i < text.length; i++) {
                                const ch = text[i];
                                if (escaped) {
                                    escaped = false;
                                }
                                else if (ch === "\\") {
                                    escaped = true;
                                }
                                else if (ch === '"') {
                                    endQuote = i;
                                    break;
                                }
                            }
                            if (endQuote !== -1) {
                                const strLiteral = text.slice(charIndex, endQuote + 1);
                                try {
                                    const unescaped = JSON.parse(strLiteral);
                                    parsedObj = typeof unescaped === "string" ? JSON.parse(unescaped) : unescaped;
                                }
                                catch (_b) {
                                    // Ignore parse error
                                }
                            }
                        }
                        else if (firstChar === "{") {
                            // Direct JSON object literal
                            let depth = 0;
                            let endBrace = -1;
                            let inString = false;
                            let strChar = "";
                            let escaped = false;
                            for (let i = charIndex; i < text.length; i++) {
                                const ch = text[i];
                                if (escaped) {
                                    escaped = false;
                                    continue;
                                }
                                if (ch === "\\") {
                                    escaped = true;
                                    continue;
                                }
                                if (inString) {
                                    if (ch === strChar)
                                        inString = false;
                                    continue;
                                }
                                if (ch === '"' || ch === "'") {
                                    inString = true;
                                    strChar = ch;
                                    continue;
                                }
                                if (ch === "{")
                                    depth++;
                                else if (ch === "}") {
                                    depth--;
                                    if (depth === 0) {
                                        endBrace = i;
                                        break;
                                    }
                                }
                            }
                            if (endBrace !== -1) {
                                const objStr = text.slice(charIndex, endBrace + 1);
                                try {
                                    parsedObj = JSON.parse(objStr);
                                }
                                catch (_c) {
                                    // Ignore
                                }
                            }
                        }
                    }
                }
            }
            // Strategy 2: If Strategy 1 didn't yield an object, look backwards for '{"data"' or '{\"data\"'
            if (!parsedObj) {
                const dataIdx = Math.max(text.lastIndexOf('{"data"', pos), text.lastIndexOf('{\\"data\\"', pos));
                if (dataIdx !== -1 && pos - dataIdx < 1000) {
                    const quoteBefore = text.lastIndexOf('"', dataIdx);
                    if (quoteBefore !== -1 && dataIdx - quoteBefore === 1) {
                        let endQuote = -1;
                        let escaped = false;
                        for (let i = quoteBefore + 1; i < text.length; i++) {
                            const ch = text[i];
                            if (escaped) {
                                escaped = false;
                            }
                            else if (ch === "\\") {
                                escaped = true;
                            }
                            else if (ch === '"') {
                                endQuote = i;
                                break;
                            }
                        }
                        if (endQuote !== -1) {
                            try {
                                const unescaped = JSON.parse(text.slice(quoteBefore, endQuote + 1));
                                parsedObj = typeof unescaped === "string" ? JSON.parse(unescaped) : unescaped;
                            }
                            catch (_d) {
                                // Ignore
                            }
                        }
                    }
                }
            }
            if (parsedObj && (((_a = parsedObj.data) === null || _a === void 0 ? void 0 : _a.retweeters_timeline) || parsedObj.retweeters_timeline)) {
                results.push(parsedObj);
            }
            pos += target.length;
        }
        return results;
    }
    /**
     * Process the response data
     * @param responseJson Response JSON data
     */
    processResponseData(responseJson) {
        var _a, _b, _c;
        const timeline = ((_b = (_a = responseJson.data) === null || _a === void 0 ? void 0 : _a.retweeters_timeline) === null || _b === void 0 ? void 0 : _b.timeline) || ((_c = responseJson.retweeters_timeline) === null || _c === void 0 ? void 0 : _c.timeline);
        const instructions = timeline === null || timeline === void 0 ? void 0 : timeline.instructions;
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        var _w, _x;
        const content = item.content;
        if (!content)
            return null;
        const entryType = content.entryType || content.__typename;
        const itemContent = content.itemContent || content.content;
        const result = (_a = itemContent === null || itemContent === void 0 ? void 0 : itemContent.user_results) === null || _a === void 0 ? void 0 : _a.result;
        if (entryType === "TimelineTimelineItem" && result) {
            if (result.__typename === "UserUnavailable" || !result.rest_id) {
                return null;
            }
            const isBlueVerified = (_x = (_w = (_b = result.verification) === null || _b === void 0 ? void 0 : _b.is_blue_verified) !== null && _w !== void 0 ? _w : result.is_blue_verified) !== null && _x !== void 0 ? _x : false;
            const user = (0, lodash_1.pick)({
                id: result === null || result === void 0 ? void 0 : result.rest_id,
                created_at: ((_c = result.core) === null || _c === void 0 ? void 0 : _c.created_at) || ((_d = result.legacy) === null || _d === void 0 ? void 0 : _d.created_at) || "",
                description: ((_e = result.profile_bio) === null || _e === void 0 ? void 0 : _e.description) || ((_f = result.legacy) === null || _f === void 0 ? void 0 : _f.description) || "",
                followers_count: ((_g = result.relationship_counts) === null || _g === void 0 ? void 0 : _g.followers) || ((_h = result.legacy) === null || _h === void 0 ? void 0 : _h.followers_count) || 0,
                friends_count: ((_j = result.relationship_counts) === null || _j === void 0 ? void 0 : _j.following) || ((_k = result.legacy) === null || _k === void 0 ? void 0 : _k.friends_count) || 0,
                name: ((_l = result.core) === null || _l === void 0 ? void 0 : _l.name) || ((_m = result.legacy) === null || _m === void 0 ? void 0 : _m.name) || "",
                profile_image_url_https: ((_o = result.avatar) === null || _o === void 0 ? void 0 : _o.image_url) || ((_p = result.legacy) === null || _p === void 0 ? void 0 : _p.profile_image_url_https) || "",
                screen_name: ((_q = result.core) === null || _q === void 0 ? void 0 : _q.screen_name) || ((_r = result.legacy) === null || _r === void 0 ? void 0 : _r.screen_name) || "",
                statuses_count: ((_s = result.tweet_counts) === null || _s === void 0 ? void 0 : _s.tweets) || ((_t = result.legacy) === null || _t === void 0 ? void 0 : _t.statuses_count) || 0,
                is_blue_verified: isBlueVerified,
                profile_description_language: this.cleanText(result.profile_description_language),
                favourites_count: ((_u = result.action_counts) === null || _u === void 0 ? void 0 : _u.favorites_count) || ((_v = result.legacy) === null || _v === void 0 ? void 0 : _v.favourites_count) || 0,
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
        const itemContent = ((_a = item.content) === null || _a === void 0 ? void 0 : _a.itemContent) || ((_b = item.content) === null || _b === void 0 ? void 0 : _b.content);
        return ((_d = (_c = itemContent === null || itemContent === void 0 ? void 0 : itemContent.user_results) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.rest_id) || item.entryId || item.entry_id || null;
    }
}
exports.RetweetsHandler = RetweetsHandler;
