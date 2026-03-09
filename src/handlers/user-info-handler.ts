import { Page } from "@playwright/test";
import { pick } from "lodash";
import { BaseHandler } from "./base-handler";
import { USER_INFO_FIELDS } from "../utils/constants";

/**
 * Handler for Twitter user information data
 */
export class UserInfoHandler extends BaseHandler {
    /**
     * Constructor for UserInfoHandler
     * @param page Playwright page object
     * @param filePath Path to save the CSV file
     * @param dataFolder Folder to save the data
     * @param timeoutLimit Number of timeouts before stopping
     * @param delaySeconds Delay between items in seconds
     * @param delayEvery100Seconds Delay after every 100 items in seconds
     */
    constructor(
        page: Page,
        filePath: string,
        dataFolder: string,
        timeoutLimit: number = 4,
        delaySeconds: number = 3,
        delayEvery100Seconds: number = 5
    ) {
        // For user info, we usually fetch one user at a time, so targetCount is 1
        super(page, filePath, dataFolder, 1, timeoutLimit, delaySeconds, delayEvery100Seconds);
    }

    /**
     * Get the URL pattern to listen for
     */
    protected getUrlPattern(): string {
        return "UserByScreenName";
    }

    /**
     * Process the response data
     * @param responseJson Response JSON data
     */
    protected processResponseData(responseJson: any): any[] {
        const user = responseJson.data?.user?.result;
        if (!user) {
            return [];
        }
        return [user];
    }

    /**
     * Get the fields to extract
     */
    protected getFields(): string[] {
        return USER_INFO_FIELDS;
    }

    /**
     * Process an item for CSV output
     * @param item Item to process
     */
    protected processItemForCsv(item: any): Record<string, any> {
        const data = {
            id: item.id,
            rest_id: item.rest_id,
            created_at: item.core?.created_at,
            name: item.core?.name,
            screen_name: item.core?.screen_name,
            description: this.cleanText(item.legacy?.description || item.profile_bio?.description),
            location: this.cleanText(item.location?.location),
            followers_count: item.legacy?.followers_count,
            friends_count: item.legacy?.friends_count,
            statuses_count: item.legacy?.statuses_count,
            favourites_count: item.legacy?.favourites_count,
            listed_count: item.legacy?.listed_count,
            media_count: item.legacy?.media_count,
            profile_image_url: item.avatar?.image_url,
            profile_banner_url: item.legacy?.profile_banner_url,
            is_blue_verified: item.is_blue_verified,
            is_identity_verified: item.verification_info?.is_identity_verified,
        };

        return pick(data, this.getFields());
    }

    /**
     * Get the unique ID of an item
     * @param item Item to get the ID for
     */
    protected getUniqueId(item: any): string | null {
        return item.rest_id || item.id;
    }

    /**
     * Get the name of the items being collected (for logging)
     */
    protected getItemName(): string {
        return "user information";
    }
}
