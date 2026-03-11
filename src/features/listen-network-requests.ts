import { Page } from "@playwright/test";
import chalk from "chalk";

export const listenNetworkRequests = async (page: Page, searchTab?: string) => {
  // Listen to network requests
  await page.route("**/*", (route) => {
    const url = route.request().url();
    // only log requests that includes SearchTimeline
    if (url.includes("SearchTimeline")) {
      console.info(chalk.blue(`\nGot some tweets, saving to file...`));
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
        } catch (e) {
          console.error(chalk.red(`Error parsing variables in Retweeters URL: ${e}`));
        }
      }
    }

    // block pictures and videos
    if (url.includes(".jpg") || url.includes(".png") || url.includes(".mp4")) {
      return route.abort();
    }

    route.continue();
  });
};
