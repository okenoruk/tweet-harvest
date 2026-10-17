import { Page } from "@playwright/test";
import chalk from "chalk";

export const inputKeywords = async (
  page: Page,
  { SEARCH_FROM_DATE, SEARCH_TO_DATE, SEARCH_KEYWORDS, MODIFIED_SEARCH_KEYWORDS }: {
    SEARCH_FROM_DATE?: string;
    SEARCH_TO_DATE?: string;
    SEARCH_KEYWORDS?: string;
    MODIFIED_SEARCH_KEYWORDS?: string;
  }
) => {
  // wait until it shown: input[name="allOfTheseWords"]
  await page.waitForSelector('input[name="allOfTheseWords"]', {
    state: "visible",
  });

  await page.click('input[name="allOfTheseWords"]');

  if (SEARCH_FROM_DATE) {
    const [day, month, year] = SEARCH_FROM_DATE.split(" ")[0].split("-");
    MODIFIED_SEARCH_KEYWORDS += ` since:${year}-${month}-${day}`;
  }

  if (SEARCH_TO_DATE) {
    const [day, month, year] = SEARCH_TO_DATE.split(" ")[0].split("-");
    MODIFIED_SEARCH_KEYWORDS += ` until:${year}-${month}-${day}`;
  }

  console.info(chalk.yellow(`\nFilling in keywords: ${MODIFIED_SEARCH_KEYWORDS}\n`));

  if (MODIFIED_SEARCH_KEYWORDS && MODIFIED_SEARCH_KEYWORDS !== "") {
    await page.fill('input[name="allOfTheseWords"]', MODIFIED_SEARCH_KEYWORDS);
  }

  // Press Enter
  await page.press('input[name="allOfTheseWords"]', "Enter");
};
