import { Page } from 'puppeteer';
export declare enum PageType {
    MAIN = "main",// The URL specified in the crawl list
    SUBPAGE = "subpage",// A link found on the main page (article or randomly guessed page)
    LANDING = "landing"
}
/**
 * @property pageType: Type of page (e.g. home page, article)
 * @property referrerPage: If this is a subpage or clickthrough page, the id of the page
 * page that linked to this page.
 * @property referrerPageUrl: URL of the referrerPage.
 * @property referrerAd: If this is a clickthrough page, the id of the ad
 * that linked to this page.
 */
interface ScrapePageMetadata {
    pageId: number;
    pageType: PageType;
    referrerAd?: number;
}
/**
 * Scrapes a page and saves it in the database.
 * @param page The page to be crawled.
 * @returns A ScrapedPage object containing the file locations of the scraped
 * content and other metadata.
 */
export declare function scrapePage(page: Page, metadata: ScrapePageMetadata): Promise<void>;
export {};
