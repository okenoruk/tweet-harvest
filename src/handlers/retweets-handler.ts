import { Page } from "@playwright/test";
import { pick } from "lodash";
import { BaseHandler } from "./base-handler";
import { USER_PROFILE_FIELDS } from "../utils/constants";
import { RetweetEntry } from "../types/retweets.types";

/**
 * Handler for Twitter retweets data
 */
export class RetweetsHandler extends BaseHandler {
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
  constructor(
    page: Page,
    filePath: string,
    dataFolder: string,
    targetCount: number,
    timeoutLimit: number = 2,
    delaySeconds: number = 1,
    delayEvery100Seconds: number = 1
  ) {
    super(page, filePath, dataFolder, targetCount, timeoutLimit, delaySeconds, delayEvery100Seconds);
  }

  /**
   * Get the URL pattern to listen for
   */
  protected getUrlPattern(): string {
    return "Retweeters";
  }

  /**
   * Process the response data
   * @param responseJson Response JSON data
   */
  protected processResponseData(responseJson: any): RetweetEntry[] {
    if (!responseJson.data?.retweeters_timeline?.timeline?.instructions?.[0]?.entries) {
      return [];
    }

    return responseJson.data.retweeters_timeline.timeline.instructions[0].entries;
  }

  /**
   * Get the fields to extract
   */
  protected getFields(): string[] {
    return USER_PROFILE_FIELDS;
  }

  /**
   * Process an item for CSV output
   * @param item Item to process
   */
  protected processItemForCsv(item: RetweetEntry): Record<string, any> | null {
    if (item.entryId.indexOf('user') > -1 && item?.content?.itemContent?.user_results?.result) {
      const user = pick(
        { 
          id: item?.content?.itemContent?.user_results?.result?.id, 
          ...item.content.itemContent.user_results.result.legacy 
        }, 
        USER_PROFILE_FIELDS
      );

      // Clean text fields
      const description = item.content.itemContent.user_results.result.legacy.description || "";
      // Use type assertion to handle potential missing properties
      const name = item.content.itemContent.user_results.result.core?.name || 
                  (item.content.itemContent.user_results.result.legacy as any).name || "";

      user["description"] = description.replace(/,/g, " ").replace(/\n/g, " ");
      user["name"] = name.replace(/,/g, " ").replace(/\n/g, " ");

      return user;
    }

    return null;
  }

  /**
   * Get the name of the items being collected (for logging)
   */
  protected getItemName(): string {
    return "user profiles (retweets)";
  }
}
