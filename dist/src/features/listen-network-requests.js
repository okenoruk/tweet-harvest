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
exports.listenNetworkRequests = void 0;
const chalk_1 = __importDefault(require("chalk"));
const listenNetworkRequests = (page, searchTab) => __awaiter(void 0, void 0, void 0, function* () {
    // Listen to network requests
    yield page.route("**/*", (route) => {
        const url = route.request().url();
        // only log requests that includes SearchTimeline
        if (url.includes("SearchTimeline")) {
            console.info(chalk_1.default.blue(`\nGot some tweets, saving to file...`));
        }
        // Intercept Retweeters URL to change enableRanking
        if (url.includes("Retweeters")) {
            const urlObj = new URL(url);
            const variablesStr = urlObj.searchParams.get("variables");
            if (variablesStr) {
                try {
                    const variables = JSON.parse(variablesStr);
                    // Set enableRanking to false if LATEST, else true
                    variables.enableRanking = searchTab !== "LATEST";
                    urlObj.searchParams.set("variables", JSON.stringify(variables));
                    return route.continue({ url: urlObj.toString() });
                }
                catch (e) {
                    console.error(chalk_1.default.red(`Error parsing variables in Retweeters URL: ${e}`));
                }
            }
        }
        // block pictures and videos
        if (url.includes(".jpg") || url.includes(".png") || url.includes(".mp4")) {
            return route.abort();
        }
        route.continue();
    });
});
exports.listenNetworkRequests = listenNetworkRequests;
