# Tweet Harvest (Twitter Crawler)

Tweet Harvest is a command-line tool that uses Playwright to scrape tweets from Twitter search results based on specified keywords and date range. The scraped tweets are saved in a CSV file.

**Note: This script is for educational purposes only. Twitter prohibits unauthenticated users from performing search or advanced search. To use this script, you need to have a valid Twitter account and obtain an Access Token, which can be obtained by logging into Twitter in your browser and extracting the `auth_token` cookie.**

## How to Use

To use Tweet Harvest, follow these simple steps:
1. Install Node.js (LTS) on your computer.
2. Open your terminal or command prompt.
3. Type `npx tweet-harvest@latest` and press Enter.
4. Follow the prompts to provide the data you want to search for on Twitter, such as keywords, dates, and other parameters.

That’s it! Tweet Harvest will open a Chromium browser instance and navigate to Twitter's search page. It will then enter your search parameters and scrape the resulting tweets. The tweets will be saved in a CSV file in a directory named tweets-data in the current working directory.

Note: You will need a Twitter auth token to use this tool. When prompted, enter your Twitter auth token to authenticate your search.

# Publishing `tweet-harvest2` to npmjs (Step-by-step)

## Prerequisites
- You have access to the npm package name: `tweet-harvest2`
- Your code compiles to `dist/` (because your package publishes only `dist/`)
- You have `pnpm` and `npm` installed

---

## 1) Go to your project folder
```bash
cd /path/to/tweet-harvest2
````

---

## 2) Install dependencies

```bash
pnpm install
```

---

## 3) Make sure you are logged in to npmjs

Check login:

```bash
npm whoami
```

If it errors, login:

```bash
npm login
```

(Optional) confirm registry points to npmjs:

```bash
npm config get registry
# should be: https://registry.npmjs.org/
```

---

## 4) Build the project (generate `dist/`)

```bash
pnpm build
```

Verify output exists:

```bash
ls dist
```

Also verify the CLI entry exists (important):

```bash
ls dist/bin.js
```

---

## 5) Bump the version

You MUST bump version before publishing (npm won’t allow re-publishing the same version).

Choose ONE:

* Patch (bugfix):

```bash
npm version patch
```

* Minor (new features, backward-compatible):

```bash
npm version minor
```

* Major (breaking changes):

```bash
npm version major
```

This updates `package.json` and creates a git commit + tag.

---

## 6) Publish to npmjs

```bash
npm publish
```

> Note: Your `package.json` includes `"prepublish": "pnpm build"`, so `npm publish` will run the build again automatically.

---

## 7) Verify the published version

```bash
npm view tweet-harvest2 version
```

Optional: test install in a fresh place

```bash
npm i -g tweet-harvest2
tweet-harvest --help
```

---

## 8) Push git commits & tags (recommended)

If you use git:

```bash
git push --follow-tags
```

---

## Common errors & fixes

### Error: "You cannot publish over the previously published versions"

Fix: bump version again, then publish:

```bash
npm version patch
npm publish
```

### CLI installed but command fails

Fix: ensure `dist/bin.js` exists and is included:

* `pnpm build`
* check `dist/bin.js`
* publish again (with a new version)

---

```
```
