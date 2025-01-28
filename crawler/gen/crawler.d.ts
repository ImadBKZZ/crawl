import { ClientConfig } from 'pg';
import { Browser } from 'puppeteer';
import * as log from './util/log.js';
export interface CrawlerFlags {
    jobId?: number;
    crawlId?: number;
    crawlName: string;
    resumeIfAble: boolean;
    profileId?: string;
    outputDir: string;
    url?: string;
    adId?: number;
    urlList?: string;
    adUrlList?: string;
    logLevel?: log.LogLevel;
    chromeOptions: {
        profileDir?: string;
        headless: boolean;
        executablePath?: string;
        proxyServer?: string;
    };
    crawlOptions: {
        shuffleCrawlList: boolean;
        findAndCrawlPageWithAds: number;
        findAndCrawlArticlePage: boolean;
        refreshPage: boolean;
        checkpointFreqSeconds?: number;
    };
    scrapeOptions: {
        scrapeSite: boolean;
        scrapeAds: boolean;
        clickAds: 'noClick' | 'clickAndBlockLoad' | 'clickAndScrapeLandingPage';
        screenshotAdsWithContext: boolean;
        captureThirdPartyRequests: boolean;
    };
    profileOptions?: any;
}
declare global {
    var BROWSER: Browser;
    var FLAGS: CrawlerFlags;
    var CRAWL_TIMEOUT: number;
    var SITE_TIMEOUT: number;
    var PAGE_NAVIGATION_TIMEOUT: number;
    var PAGE_SLEEP_TIME: number;
    var PAGE_SCRAPE_TIMEOUT: number;
    var AD_SLEEP_TIME: number;
    var AD_SCRAPE_TIMEOUT: number;
    var AD_CLICK_TIMEOUT: number;
    var CLICKTHROUGH_TIMEOUT: number;
    var VIEWPORT: {
        width: number;
        height: number;
    };
    var CRAWL_ID: number;
}
export declare function crawl(flags: CrawlerFlags, pgConf: ClientConfig, checkpointFn?: () => Promise<void>): Promise<void>;
export declare function launchBrowser(flags: CrawlerFlags): Promise<Browser>;
