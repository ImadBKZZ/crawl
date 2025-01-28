import { Page } from 'puppeteer';
export default class SubpageExplorer {
    prevGuesses: Set<string>;
    constructor();
    /**
     * Randomly picks links from a page, opens them in a new tab, and checks if it
     * meets the criteria.
     * Returns the first link meeting the criteria
     * @param page Page to look at links from
     * @param maxGuesses Maximum number of links to explore
     * @param pageCriteria Function to be evaluated on a candidate page
     * @param optionalLinkCriteria Function to be evaluated on a candidate URL;
     * optional meaning if no links fit the criteria, this filter will be ignored.
     * @returns URL for the first matching page, or undefined if no page was found.
     */
    randomGuessPage(page: Page, maxGuesses: number, pageCriteria: (page: Page) => Promise<boolean>, optionalLinkCriteria?: (url: string) => boolean): Promise<string | undefined>;
    /**
     * Finds an article linked from the given page. First tries to locate an
     * RSS feed, falls back to randomly picking links.
     * When randomly picking, uses the readability library to determine if a page
     * is an article (same util used by Firefox for reader mode).
     * @param page Page to look for articles on
     * @returns Article URL, or undefined if no article was found.
     */
    findArticle(page: Page): Promise<string | undefined>;
    findPageWithAds(page: Page): Promise<string | undefined>;
    findHealthRelatedPagesWithAds(page: Page): Promise<string | undefined>;
}
