import { Page } from "@playwright/test";
import { pick } from "lodash";
import { BaseHandler } from "./base-handler";
import { TWEET_FIELDS } from "../utils/constants";
import { Entry } from "../types/tweets.types";
import { CrawlMode } from "../utils/constants";

/**
 * Handler for Twitter tweets data
 */
export class TweetsHandler extends BaseHandler {
  private crawlMode: CrawlMode;

  /**
   * Constructor for TweetsHandler
   * @param page Playwright page object
   * @param filePath Path to save the CSV file
   * @param dataFolder Folder to save the data
   * @param targetCount Target number of items to collect
   * @param crawlMode Crawl mode (SEARCH or DETAIL)
   * @param timeoutLimit Number of timeouts before stopping
   * @param delaySeconds Delay between items in seconds
   * @param delayEvery100Seconds Delay after every 100 items in seconds
   */
  constructor(
    page: Page,
    filePath: string,
    dataFolder: string,
    targetCount: number,
    crawlMode: CrawlMode,
    timeoutLimit: number = 4,
    delaySeconds: number = 3,
    delayEvery100Seconds: number = 5
  ) {
    super(page, filePath, dataFolder, targetCount, timeoutLimit, delaySeconds, delayEvery100Seconds);
    this.crawlMode = crawlMode;
  }

  /**
   * Get the URL pattern to listen for
   */
  protected getUrlPattern(): string {
    return this.crawlMode === CrawlMode.SEARCH ? "SearchTimeline" : "TweetDetail";
  }

  /**
   * Process the response data
   * @param responseJson Response JSON data
   */
  protected processResponseData(responseJson: any): any[] {
    let tweets: Entry[] = [];

    const isTweetDetail = responseJson.data.threaded_conversation_with_injections_v2;
    if (isTweetDetail) {
      tweets = responseJson.data?.threaded_conversation_with_injections_v2.instructions[0].entries;
    } else {
      tweets = responseJson.data?.search_by_raw_query.search_timeline.timeline?.instructions?.[0]?.entries;
    }

    if (!tweets || !tweets.length) {
      return [];
    }

    // Process tweets to extract content
    return tweets
      .map((tweet) => {
        const isPromotedTweet = tweet.entryId.includes("promoted");

        if (this.crawlMode === CrawlMode.SEARCH && !tweet?.content?.itemContent?.tweet_results?.result) return null;
        if (this.crawlMode === CrawlMode.DETAIL) {
          if (!tweet?.content?.items?.[0]?.item?.itemContent) return null;
          const isMentionThreadCreator =
            tweet?.content?.items?.[0]?.item?.itemContent?.tweet_results?.result?.legacy?.entities
              ?.user_mentions?.[0];
          if (!isMentionThreadCreator) return null;
        }
        if (isPromotedTweet) return null;

        const result = this.crawlMode === CrawlMode.SEARCH
          ? tweet.content.itemContent.tweet_results.result
          : tweet.content.items[0].item.itemContent.tweet_results.result;

        if (!result.tweet?.core?.user_results && !result.core?.user_results) return null;

        const tweetContent = result.legacy || result.tweet?.legacy;
        const userContent =
          result.core?.user_results?.result?.legacy || result.tweet?.core?.user_results?.result?.legacy;
        const userDetail = result.core?.user_results?.result || result.tweet?.core?.user_results?.result;
        const views = result.views || result.tweet?.views;

        return {
          tweet: tweetContent,
          user: userContent,
          userDetail: userDetail,
          views: views,
          rest_id: result.rest_id || result.tweet?.rest_id,
          userName: userDetail?.core?.name,
          userScreenName: userDetail?.core?.screen_name,
          userLocation: userDetail?.location?.location || ""
        };
      })
      .filter((tweet) => tweet !== null);
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
  protected processItemForCsv(item: any): Record<string, any> {
    const tweet = pick(
      {
        ...item.tweet,
        id_str: item.rest_id || item.tweet.id_str,
        username: item.userScreenName,
        location: item.userLocation
      },
      TWEET_FIELDS
    );

    let cleanTweetText = `${item.tweet.full_text.replace(/,/g, " ").replace(/\n/g, " ")}`;

    if (this.crawlMode === CrawlMode.DETAIL) {
      const firstWord = cleanTweetText.split(" ")[0];
      const replyToUsername = item.tweet.entities?.user_mentions?.[0]?.screen_name;
      // firstWord example: "@someone", the 0 index is " and the 1 index is @
      if (firstWord[1] === "@" && replyToUsername) {
        // remove the first word
        cleanTweetText = cleanTweetText.replace(`@${replyToUsername} `, "");
      }
    }

    const userScreenName = item.userScreenName || 'i';
    tweet["full_text"] = cleanTweetText;
    tweet["tweet_url"] = `https://twitter.com/${userScreenName}/status/${tweet.id_str}`;
    tweet["image_url"] = item.tweet.entities?.media?.[0]?.media_url_https || "";
    tweet["views_count"] = item.views?.count;

    return tweet;
  }

  /**
   * Get the name of the items being collected (for logging)
   */
  protected getItemName(): string {
    return "tweets";
  }
}
