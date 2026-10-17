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
exports.inputKeywords = void 0;
const chalk_1 = __importDefault(require("chalk"));
const inputKeywords = (page_1, _a) => __awaiter(void 0, [page_1, _a], void 0, function* (page, { SEARCH_FROM_DATE, SEARCH_TO_DATE, SEARCH_KEYWORDS, MODIFIED_SEARCH_KEYWORDS }) {
    // wait until it shown: input[name="allOfTheseWords"]
    yield page.waitForSelector('input[name="allOfTheseWords"]', {
        state: "visible",
    });
    yield page.click('input[name="allOfTheseWords"]');
    if (SEARCH_FROM_DATE) {
        const [day, month, year] = SEARCH_FROM_DATE.split(" ")[0].split("-");
        MODIFIED_SEARCH_KEYWORDS += ` since:${year}-${month}-${day}`;
    }
    if (SEARCH_TO_DATE) {
        const [day, month, year] = SEARCH_TO_DATE.split(" ")[0].split("-");
        MODIFIED_SEARCH_KEYWORDS += ` until:${year}-${month}-${day}`;
    }
    console.info(chalk_1.default.yellow(`\nFilling in keywords: ${MODIFIED_SEARCH_KEYWORDS}\n`));
    yield page.fill('input[name="allOfTheseWords"]', MODIFIED_SEARCH_KEYWORDS);
    // Press Enter
    yield page.press('input[name="allOfTheseWords"]', "Enter");
});
exports.inputKeywords = inputKeywords;
