import { ElementHandle, Page } from 'puppeteer';
import { PageType } from '../pages/page-scraper.js';
export interface AdHandles {
    clickTarget: ElementHandle;
    screenshotTarget: ElementHandle | null;
}
/**
 * Crawler metadata to be stored with scraped ad data.
 * @property crawlId: id of the current crawl list entry
 * @property pageType: Type of the parent page
 * @property parentPageId: The database id of the page the ad appears on
 * @property chumboxId: The chumbox the ad belongs to, if applicable
 * @property platform: The ad platform used by this ad, if identified
 */
interface CrawlAdMetadata {
    crawlListIndex: number;
    pageType: PageType;
    parentPageId: number;
    originalUrl: string;
    chumboxId?: number;
    platform?: string;
}
export declare function scrapeAdsOnPage(page: Page, metadata: CrawlAdMetadata): Promise<void>;
/**
 * Scrapes the content and takes a screenshot of an ad embedded in a page,
 * including all sub-frames, and then saves it in the adscraper database.
 * @param ad A handle to the HTML element bounding the ad.
 * @param page The page the ad appears on.
 * @param metadata Crawler metadata linked to this ad.
 * @returns Promise containing the database id of the scraped ad, once it is
 * done crawling/saving.
 */
export declare function scrapeAd(ad: ElementHandle, page: Page, metadata: CrawlAdMetadata): Promise<number>;
export {};
