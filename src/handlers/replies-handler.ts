import { Page } from "@playwright/test";
import { pick } from "lodash";
import { BaseHandler } from "./base-handler";
import { TWEET_FIELDS } from "../utils/constants";
import { ReplyEntry, ReplyTweetResult } from "../types/replies.types";

/**
 * Handler for Twitter tweet replies
 * Intercepts the TweetDetail API and extracts reply tweets from conversation threads
 */
export class RepliesHandler extends BaseHandler {
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
    constructor(
        page: Page,
        filePath: string,
        dataFolder: string,
        targetCount: number,
        timeoutLimit: number = 20,
        delaySeconds: number = 1,
        delayEvery100Seconds: number = 1
    ) {
        super(page, filePath, dataFolder, targetCount, timeoutLimit, delaySeconds, delayEvery100Seconds);
    }

    /**
     * Get the URL pattern to listen for
     */
    protected getUrlPattern(): string {
        return "TweetDetail";
    }

    /**
     * Process the response data from TweetDetail API
     * Extracts all reply tweets from conversation thread entries,
     * skipping the original tweet itself and pagination cursors.
     */
    protected processResponseData(responseJson: any): any[] {
        const instructions = responseJson.data?.threaded_conversation_with_injections_v2?.instructions;
        if (!instructions || !Array.isArray(instructions)) {
            return [];
        }

        // Find the instruction that has entries (TimelineAddEntries)
        const addEntriesInstruction = instructions.find(
            (instruction: any) => instruction.type === "TimelineAddEntries" && instruction.entries
        );

        if (!addEntriesInstruction?.entries) {
            return [];
        }

        const entries: ReplyEntry[] = addEntriesInstruction.entries;
        const replies: any[] = [];

        for (const entry of entries) {
            // Skip the original tweet (entryId starts with "tweet-")
            if (entry.entryId.startsWith("tweet-")) continue;

            // Skip cursor entries (entryId starts with "cursor-")
            if (entry.entryId.startsWith("cursor-")) continue;

            // Process conversation thread modules (entryId starts with "conversationthread-")
            if (
                entry.entryId.startsWith("conversationthread-") &&
                entry.content?.entryType === "TimelineTimelineModule" &&
                Array.isArray(entry.content?.items)
            ) {
                for (const item of entry.content.items) {
                    const result: ReplyTweetResult | undefined =
                        item?.item?.itemContent?.tweet_results?.result;

                    if (!result || result.__typename !== "Tweet") continue;
                    if (!result.core?.user_results?.result) continue;

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
                        userName: userCore?.name,
                        userScreenName: userCore?.screen_name,
                        userLocation: userResult?.location?.location || "",
                    });
                }
            }
        }

        return replies;
    }

    /**
     * Get the fields to extract
     */
    protected getFields(): string[] {
        return [...TWEET_FIELDS, "views_count"];
    }

    /**
     * Process an item for CSV output
     * @param item Item to process
     */
    protected processItemForCsv(item: any): Record<string, any> | null {
        if (!item?.tweet || !item?.userScreenName) return null;

        const tweet = pick(
            {
                ...item.tweet,
                id_str: item.rest_id || item.tweet.id_str,
                username: item.userScreenName,
                location: item.userLocation,
            },
            TWEET_FIELDS
        );

        const cleanTweetText = `${item.tweet.full_text.replace(/,/g, " ").replace(/\n/g, " ")}`;

        const userScreenName = item.userScreenName || "i";
        tweet["full_text"] = cleanTweetText;
        tweet["tweet_url"] = `https://twitter.com/${userScreenName}/status/${tweet.id_str}`;
        tweet["image_url"] = item.tweet.entities?.media?.[0]?.media_url_https || "";
        tweet["views_count"] = item.views?.count || "";

        return pick(tweet, this.getFields());
    }

    /**
     * Get the name of the items being collected (for logging)
     */
    protected getItemName(): string {
        return "tweet replies";
    }
}
