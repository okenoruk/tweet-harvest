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
    const instructions = responseJson.data?.favoriters_timeline?.timeline?.instructions;
    if (!instructions || !Array.isArray(instructions)) {
      return [];
    }

    // Search for any instruction that has entries
    const entriesInstruction = instructions.find((instruction: any) => instruction.entries);

    return entriesInstruction?.entries || [];
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
          id: result?.rest_id,
          created_at: result.legacy?.created_at || "",
          description: result.legacy?.description || "",
          followers_count: result.legacy?.followers_count || 0,
          friends_count: result.legacy?.friends_count || 0,
          name: result.legacy?.name || "",
          profile_image_url_https: result.legacy?.profile_image_url_https || "",
          screen_name: result.legacy?.screen_name || "",
          statuses_count: result.legacy?.statuses_count || 0,
          is_blue_verified: result.is_blue_verified || false,
          profile_description_language: this.cleanText(result.profile_description_language),
          favourites_count: result.legacy?.favourites_count || 0
        },
        USER_PROFILE_FIELDS
      );

      user["description"] = this.cleanText(user["description"] as string);
      user["name"] = this.cleanText(user["name"] as string);

      return pick(user, this.getFields());
    }

    return null;
  }

  /**
   * Get the name of the items being collected (for logging)
   */
  protected getItemName(): string {
    return "user profiles (likes)";
  }

  /**
   * Get the unique ID of a user profile
   * @param item User profile item
   */
  protected getUniqueId(item: any): string | null {
    return item.content?.itemContent?.user_results?.result?.rest_id || item.entryId || null;
  }
}
