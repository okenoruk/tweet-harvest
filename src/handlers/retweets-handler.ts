import { Page } from "@playwright/test";
import { pick } from "lodash";
import chalk from "chalk";
import { BaseHandler } from "./base-handler";
import { USER_PROFILE_FIELDS } from "../utils/constants";
import { RetweetEntry } from "../types/retweets.types";

/**
 * Handler for Twitter retweets data
 */
export class RetweetsHandler extends BaseHandler {
  private initialHtmlBodies: string[] = [];
  private seenTimelineIds: Set<string> = new Set();

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

    // 1. Listen for network responses that could contain the initial HTML with retweeters data
    this.page.on("response", async (response) => {
      try {
        const url = response.url();
        const resourceType = response.request().resourceType();
        if (resourceType === "document" || url.includes("/retweets")) {
          const contentType = response.headers()["content-type"] || "";
          if (contentType.includes("text/html") || contentType.includes("javascript") || !contentType) {
            const text = await response.text();
            if (text && text.includes("retweeters_timeline")) {
              this.initialHtmlBodies.push(text);
            }
          }
        }
      } catch {
        // Ignore errors if response cannot be read (e.g. redirected or closed)
      }
    });

    // 2. Add an init script to capture the script element content before document.currentScript.remove() runs
    this.page.addInitScript(() => {
      try {
        const origRemove = Element.prototype.remove;
        Element.prototype.remove = function () {
          try {
            if (this && this.tagName === "SCRIPT" && this.textContent && this.textContent.includes("retweeters_timeline")) {
              const win = window as any;
              win.__initialRetweeterScripts = win.__initialRetweeterScripts || [];
              win.__initialRetweeterScripts.push(this.textContent);
            }
          } catch {}
          return origRemove.call(this);
        };

        const origRemoveChild = Node.prototype.removeChild;
        Node.prototype.removeChild = function <T extends Node>(child: T): T {
          try {
            if (child && (child as any).tagName === "SCRIPT" && child.textContent && child.textContent.includes("retweeters_timeline")) {
              const win = window as any;
              win.__initialRetweeterScripts = win.__initialRetweeterScripts || [];
              win.__initialRetweeterScripts.push(child.textContent);
            }
          } catch {}
          return origRemoveChild.call(this, child) as T;
        };
      } catch {}
    }).catch(() => {});
  }

  /**
   * Get the URL pattern to listen for
   */
  protected getUrlPattern(): string {
    return "Retweeters";
  }

  /**
   * Main method to collect retweets data
   * Overrides BaseHandler.collect() to extract initial retweeters from the page before Retweeters API is hit
   */
  public override async collect(): Promise<any[]> {
    // Process initial retweeters from the page before Retweeters API is hit
    await this.collectInitialRetweeters();

    // If target has already been met from initial page script data, return immediately
    if (this.allData.length >= this.targetCount) {
      return this.allData;
    }

    return super.collect();
  }

  /**
   * Collect retweeters that are embedded in the initial page HTML / script tag
   * before the Retweeters API is triggered by scrolling.
   */
  public async collectInitialRetweeters(): Promise<void> {
    const textSources: string[] = [...this.initialHtmlBodies];

    // 1. Get scripts captured right before removal via init script
    try {
      const removedScripts = await this.page.evaluate(() => {
        return (window as any).__initialRetweeterScripts || [];
      });
      if (Array.isArray(removedScripts)) {
        textSources.push(...removedScripts);
      }
    } catch {
      // Ignore evaluate error if page is not ready
    }

    // 2. Check any remaining script tags in DOM
    try {
      const domScripts = await this.page.evaluate(() => {
        return Array.from(document.querySelectorAll("script")).map((s) => s.textContent || "");
      });
      if (Array.isArray(domScripts)) {
        textSources.push(...domScripts);
      }
    } catch {
      // Ignore
    }

    // 3. Fallback: Check full page content
    try {
      const pageContent = await this.page.content();
      if (pageContent) {
        textSources.push(pageContent);
      }
    } catch {
      // Ignore
    }

    for (const text of textSources) {
      if (!text || !text.includes("retweeters_timeline")) continue;

      const timelineObjects = this.parseTimelineFromText(text);
      for (const timelineObj of timelineObjects) {
        const timelineId = timelineObj?.data?.retweeters_timeline?.id || timelineObj?.retweeters_timeline?.id;
        if (timelineId) {
          if (this.seenTimelineIds.has(timelineId)) continue;
          this.seenTimelineIds.add(timelineId);
        }

        const entries = this.processResponseData(timelineObj);
        if (!entries || entries.length === 0) continue;

        const validUniqueItems: RetweetEntry[] = [];
        for (const item of entries) {
          const id = this.getUniqueId(item);
          if (id) {
            if (this.seenIds.has(id)) continue;
            this.seenIds.add(id);
          }
          if (this.processItemForCsv(item)) {
            validUniqueItems.push(item);
          }
        }

        if (validUniqueItems.length > 0) {
          this.allData.push(...validUniqueItems);
          await this.writeItemsToCsv(validUniqueItems);
          console.info(
            chalk.green(
              `Retrieved ${validUniqueItems.length} initial ${this.getItemName()} from page script tag before API call`
            )
          );
          await this.handleDelays(validUniqueItems.length);
        }
      }
    }
  }

  /**
   * Parse timeline data object from text containing retweeters_timeline
   * @param text Text containing the script or HTML
   */
  public parseTimelineFromText(text: string): any[] {
    if (!text || !text.includes("retweeters_timeline")) {
      return [];
    }

    const results: any[] = [];
    const target = "retweeters_timeline";
    let pos = 0;

    while ((pos = text.indexOf(target, pos)) !== -1) {
      let parsedObj: any = null;

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
                } else if (ch === "\\") {
                  escaped = true;
                } else if (ch === '"') {
                  endQuote = i;
                  break;
                }
              }

              if (endQuote !== -1) {
                const strLiteral = text.slice(charIndex, endQuote + 1);
                try {
                  const unescaped = JSON.parse(strLiteral);
                  parsedObj = typeof unescaped === "string" ? JSON.parse(unescaped) : unescaped;
                } catch {
                  // Ignore parse error
                }
              }
            } else if (firstChar === "{") {
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
                  if (ch === strChar) inString = false;
                  continue;
                }
                if (ch === '"' || ch === "'") {
                  inString = true;
                  strChar = ch;
                  continue;
                }
                if (ch === "{") depth++;
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
                } catch {
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
              } else if (ch === "\\") {
                escaped = true;
              } else if (ch === '"') {
                endQuote = i;
                break;
              }
            }
            if (endQuote !== -1) {
              try {
                const unescaped = JSON.parse(text.slice(quoteBefore, endQuote + 1));
                parsedObj = typeof unescaped === "string" ? JSON.parse(unescaped) : unescaped;
              } catch {
                // Ignore
              }
            }
          }
        }
      }

      if (parsedObj && (parsedObj.data?.retweeters_timeline || parsedObj.retweeters_timeline)) {
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
  protected processResponseData(responseJson: any): RetweetEntry[] {
    const timeline = responseJson.data?.retweeters_timeline?.timeline || responseJson.retweeters_timeline?.timeline;
    const instructions = timeline?.instructions;
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
  protected processItemForCsv(item: RetweetEntry): Record<string, any> | null {
    const content = item.content;
    if (!content) return null;

    const entryType = content.entryType || content.__typename;
    const itemContent = content.itemContent || (content as any).content;
    const result = itemContent?.user_results?.result;

    if (entryType === "TimelineTimelineItem" && result) {
      if (result.__typename === "UserUnavailable" || !result.rest_id) {
        return null;
      }

      const isBlueVerified = result.verification?.is_blue_verified ?? result.is_blue_verified ?? false;

      const user = pick(
        {
          id: result?.rest_id,
          created_at: result.core?.created_at || result.legacy?.created_at || "",
          description: result.profile_bio?.description || result.legacy?.description || "",
          followers_count: result.relationship_counts?.followers || result.legacy?.followers_count || 0,
          friends_count: result.relationship_counts?.following || result.legacy?.friends_count || 0,
          name: result.core?.name || result.legacy?.name || "",
          profile_image_url_https: result.avatar?.image_url || result.legacy?.profile_image_url_https || "",
          screen_name: result.core?.screen_name || result.legacy?.screen_name || "",
          statuses_count: result.tweet_counts?.tweets || result.legacy?.statuses_count || 0,
          is_blue_verified: isBlueVerified,
          profile_description_language: this.cleanText(result.profile_description_language),
          favourites_count: result.action_counts?.favorites_count || result.legacy?.favourites_count || 0,
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
    return "user profiles (retweets)";
  }

  /**
   * Get the unique ID of a user profile
   * @param item User profile item
   */
  protected getUniqueId(item: any): string | null {
    const itemContent = item.content?.itemContent || item.content?.content;
    return itemContent?.user_results?.result?.rest_id || item.entryId || item.entry_id || null;
  }
}
