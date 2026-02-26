import { Page } from "@playwright/test";
import { pick } from "lodash";
import { BaseHandler } from "./base-handler";
import { USER_PROFILE_FIELDS } from "../utils/constants";
import { FavEntry } from "../types/favorites.types";

/**
 * Handler for Twitter likes data
 */
export class LikesHandler extends BaseHandler {
  /**
   * Constructor for LikesHandler
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
    return "Favoriters";
  }

  /**
   * Process the response data
   * @param responseJson Response JSON data
   */
  protected processResponseData(responseJson: any): FavEntry[] {
    if (!responseJson.data?.favoriters_timeline?.timeline?.instructions?.[0]?.entries) {
      return [];
    }

    return responseJson.data.favoriters_timeline.timeline.instructions[0].entries;
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
  protected processItemForCsv(item: FavEntry): Record<string, any> | null {
    if (item.content.entryType === 'TimelineTimelineItem' && item?.content?.itemContent?.user_results?.result) {
      const result = item.content.itemContent.user_results.result;
      const isSuspended = result.__typename === 'UserUnavailable';

      const user = pick(
        {
          id: result?.id,
          ...(isSuspended ? {} : result.legacy)
        },
        USER_PROFILE_FIELDS
      );

      // Clean text fields
      const description = (isSuspended ? "" : result.legacy?.description) || "";
      const name = (isSuspended ? "" : result.legacy?.name) || "";

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
    return "user profiles (likes)";
  }
}
