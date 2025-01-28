import { ElementHandle, Page } from "puppeteer";
/**
 * Clicks on an ad, and starts a crawl on the page that it links to.
 * @param ad A handle to the ad to click on.
 * @param page The page the ad appears on.
 * @param adId The database id of the ad.
 * @param pageId The database id of the page the ad appeared on.
 * @param crawlListIndex The index of the page in the crawl list.
 * @param originalUrl The URL of the page the ad appeared on.
 * @returns Promise that resolves when crawling is complete for the linked page,
 * and any sub pages opened by clicking on ads in the linked page.
 */
export declare function clickAd(ad: ElementHandle, page: Page, adId: number, pageId: number, crawlListIndex: number, originalUrl: string): Promise<void>;
