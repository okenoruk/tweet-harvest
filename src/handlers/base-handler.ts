import { Page, Response } from "@playwright/test";
import chalk from "chalk";
import path from "path";
import { pick } from "lodash";
import { appendCsv, convertValuesToStrings, createCsvHeaderRow, ensureDirectoryExists } from "../utils/file";
import { calculateForRateLimit } from "../features/exponential-backoff";
import { FORMATTED_TIMESTAMP } from "../utils/constants";

/**
 * Base class for Twitter data handlers
 */
export abstract class BaseHandler {
  protected page: Page;
  protected filePath: string;
  protected dataFolder: string;
  protected targetCount: number;
  protected timeoutLimit: number;
  protected delaySeconds: number;
  protected delayEvery100Seconds: number;

  // Tracking variables
  protected timeoutCount = 0;
  protected additionalItemsCount = 0;
  protected rateLimitCount = 0;
  protected headerWritten = false;

  // Data storage
  protected allData: any[] = [];

  // Response buffer
  protected responseQueue: Response[] = [];

  /**
   * Constructor for BaseHandler
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
    timeoutLimit: number,
    delaySeconds: number,
    delayEvery100Seconds: number
  ) {
    this.page = page;
    this.filePath = filePath;
    this.dataFolder = dataFolder;
    this.targetCount = targetCount;
    this.timeoutLimit = timeoutLimit;
    this.delaySeconds = delaySeconds;
    this.delayEvery100Seconds = delayEvery100Seconds;

    // Ensure the data folder exists
    ensureDirectoryExists(dataFolder);

    // Start listening for responses immediately
    this.page.on('response', (response) => {
      if (response.url().includes(this.getUrlPattern())) {
        this.responseQueue.push(response);
      }
    });
  }

  /**
   * Get the URL pattern to listen for
   */
  protected abstract getUrlPattern(): string;

  /**
   * Process the response data
   * @param responseJson Response JSON data
   */
  protected abstract processResponseData(responseJson: any): any[];

  /**
   * Get the fields to extract
   */
  protected abstract getFields(): string[];

  /**
   * Process an item for CSV output
   * @param item Item to process
   */
  protected abstract processItemForCsv(item: any): Record<string, any>;

  /**
   * Get the name of the items being collected (for logging)
   */
  protected abstract getItemName(): string;

  /**
   * Handle a rate limit error
   * @param response Response object
   */
  protected async handleRateLimit(response: Response): Promise<boolean> {
    const responseText = await response.text();
    if (responseText.toLowerCase().includes("rate limit")) {
      console.error(`Error parsing response json: ${response.url()}`);
      console.error(
        `Most likely, you have already exceeded the Twitter rate limit. Read more on https://twitter.com/elonmusk/status/1675187969420828672?s=46.`
      );

      // Wait for rate limit window passed before retrying
      await this.page.waitForTimeout(calculateForRateLimit(this.rateLimitCount++));

      // Click retry
      await this.page.click("text=Retry");
      return true;
    }
    return false;
  }

  /**
   * Write items to CSV
   * @param items Items to write
   */
  protected async writeItemsToCsv(items: any[]): Promise<void> {
    if (items.length === 0) return;

    // Write header if not already written
    if (!this.headerWritten) {
      this.headerWritten = true;
      const headerRow = createCsvHeaderRow(this.getFields());
      appendCsv(this.filePath, headerRow);
    }

    // Process items for CSV
    const rows = items.reduce((prev: string[], current: any) => {
      const processedItem = this.processItemForCsv(current);
      if (processedItem) {
        const row = Object.values(convertValuesToStrings(processedItem)).join(",");
        return [...prev, row];
      }
      return prev;
    }, []);

    // Write to CSV
    if (rows.length > 0) {
      const csv = rows.join("\n") + "\n";
      const fullPathFilename = appendCsv(this.filePath, csv);
      console.info(chalk.blue(`Your ${this.getItemName()} saved to: ${fullPathFilename}`));
      console.info(chalk.yellow(`Total ${this.getItemName()} saved: ${this.allData.length}`));
    }
  }

  /**
   * Handle delays between requests
   * @param itemsCount Number of items processed in this batch
   */
  protected async handleDelays(itemsCount: number): Promise<void> {
    this.additionalItemsCount += itemsCount;

    if (this.additionalItemsCount > 100) {
      this.additionalItemsCount = 0;
      if (this.delayEvery100Seconds) {
        console.info(chalk.gray(`\n--Taking a break, waiting for ${this.delayEvery100Seconds} seconds...`));
        await this.page.waitForTimeout(this.delayEvery100Seconds * 1000);
      }
    } else if (this.additionalItemsCount > 20) {
      await this.page.waitForTimeout(this.delaySeconds * 1000);
    }
  }

  /**
   * Scroll the page
   */
  protected async scrollPage(): Promise<void> {
    await this.page.evaluate(() =>
      window.scrollTo({
        behavior: "smooth",
        top: 10_000 * 9_000,
      })
    );
  }

  /**
   * Main method to collect data
   */
  public async collect(): Promise<any[]> {
    let currentWaitTimeout = 5000;
    const MAX_WAIT_TIMEOUT = 60000;

    while (this.allData.length < this.targetCount && this.timeoutCount < this.timeoutLimit) {
      // Check the buffer first
      let response: Response | undefined = this.responseQueue.shift();

      if (!response) {
        // Wait for the next response or timeout
        try {
          // Promise.race will either return a new response or undefined (on timeout)
          const raceResult = await Promise.race([
            this.page.waitForResponse(
              (response) => response.url().includes(this.getUrlPattern())
            ),
            this.page.waitForTimeout(currentWaitTimeout),
          ]);

          if (raceResult) {
            response = raceResult;
          } else {
            // Check the queue again after timeout just in case the listener caught it
            response = this.responseQueue.shift();
          }
        } catch (error) {
          if (error instanceof Error && error.name === 'TimeoutError') {
            this.timeoutCount++;
            console.error(chalk.red(`Timeout waiting for ${this.getItemName()} response (${currentWaitTimeout}ms)`));

            // Take screenshot on timeout
            const screenshotPath = path.resolve(this.dataFolder, `Timeout-${this.getItemName().replace(/ /g, "_")}-${FORMATTED_TIMESTAMP}.png`);
            await this.page.screenshot({ path: screenshotPath });
            console.info(chalk.yellow(`Screenshot saved to: ${screenshotPath}`));

            await this.scrollPage();
            // currentWaitTimeout = Math.min(currentWaitTimeout + 5000, MAX_WAIT_TIMEOUT);
            break;
          }
          throw error;
        }
      }

      if (response) {
        this.timeoutCount = 0;
        currentWaitTimeout = 5000; // Reset timeout on success

        try {
          const responseJson = await response.json();

          // Reset the rate limit exception count
          this.rateLimitCount = 0;

          // Process the response data
          const items = this.processResponseData(responseJson);

          if (!items || items.length === 0) {
            console.error(`No more ${this.getItemName()} found`);
            continue;
          }

          // TODO: For debugging purpose, delete later
          const jsonData = JSON.stringify(items, null, 2);
          var fs = require('fs');
          fs.writeFile("api_results.json", jsonData, function (err) {
            if (err) {
              console.log(err);
            }
          });

          // Add items to allData
          this.allData.push(...items);

          // Write items to CSV
          await this.writeItemsToCsv(items);

          // Handle delays
          await this.handleDelays(items.length);
        } catch (error) {
          // Check if it's a rate limit error
          if (await this.handleRateLimit(response as Response)) {
            return await this.collect(); // Recursive call after handling rate limit
          }
          console.error(`Error processing response: ${error}`);
          break;
        }
      } else {
        this.timeoutCount++;
        console.info(
          chalk.gray(
            `Scrolling more... (Waiting for ${currentWaitTimeout / 1000}s)`
          )
        );

        // Increase timeout for next iteration, capped at 1 minute
        currentWaitTimeout = Math.min(currentWaitTimeout + 5000, MAX_WAIT_TIMEOUT);

        if (this.timeoutCount > this.timeoutLimit || currentWaitTimeout > MAX_WAIT_TIMEOUT) {
          if (currentWaitTimeout > MAX_WAIT_TIMEOUT) {
            console.info(chalk.red(`Timeout waiting for ${this.getItemName()} response (${currentWaitTimeout}ms)`));
          }
          console.info(chalk.yellow(`No more ${this.getItemName()} found, please check your search criteria and csv file result`));
          break;
        }

        await this.scrollPage();
      }

      // Scroll after each iteration
      await this.scrollPage();
    }

    return this.allData;
  }
}
