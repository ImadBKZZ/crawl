import pg from 'pg';
import { AdExternalUrls } from '../ads/ad-external-urls.js';
import { ScrapedIFrame } from '../ads/iframe-scraper.js';
export interface dbInsertOptions {
    table: string;
    returning?: string;
    data: {
        [column: string]: any;
    };
}
export interface dbUpdateOptions {
    table: string;
    id: number;
    data: {
        [column: string]: any;
    };
}
export interface Ad {
    job_id?: number;
    crawl_id: number;
    timestamp?: Date;
    url?: string;
    html?: string;
    screenshot?: string;
    screenshot_host?: string;
    parent_page?: number;
    parent_page_url?: string;
    parent_page_type?: string;
    chumbox_id?: number;
    platform?: string;
    winning_bid?: boolean;
    max_bid_price?: number;
    with_context?: boolean;
    bb_x?: number;
    bb_y?: number;
    bb_height?: number;
    bb_width?: number;
}
export interface AdDomain {
    ad_id: number;
    iframe_id?: number;
    url: string;
    hostname?: string;
    type: string;
}
export interface Page {
    job_id?: number;
    crawl_id: number;
    timestamp: Date;
    url?: string;
    original_url: string;
    crawl_list_index: number;
    page_type: string;
    reload?: number;
    html?: string;
    mhtml?: string;
    screenshot?: string;
    referrer_page?: number;
    referrer_page_url?: string;
    referrer_ad?: number;
    error?: string;
}
export interface WebRequest {
    timestamp: Date;
    job_id?: number;
    crawl_id: number;
    parent_page: number;
    initiator: string;
    target_url: string;
    resource_type: string;
}
/**
 * Wrapper over the postgres client for inserting data from the crawler.
 * Singleton class - call initialize() at the beginning, call getInstance()
 * subsequently from any other scope.
 */
export default class DbClient {
    static instance: DbClient;
    postgres: pg.Client;
    private constructor();
    /**
     * Sets up a new DbClient. Must be called the first time this is used in
     * the script.
     * @param conf Postgres config
     * @returns A DbClient instance.
     */
    static initialize(conf: pg.ClientConfig): Promise<DbClient>;
    /**
     * Gets the DbClient.
     * @returns The global DbClient.
     */
    static getInstance(): DbClient;
    /**
     * Ends the client connection to the database.
     * @returns
     */
    end(): Promise<void>;
    /**
     * Generic insert wrapper
     * @param options
     * @returns
     */
    insert(options: dbInsertOptions): Promise<any>;
    updateById(options: dbUpdateOptions): Promise<void>;
    archiveScrapedIFrame(iframe: ScrapedIFrame, adId: number, parentId?: number): Promise<void>;
    createAd(ad: Ad): Promise<number>;
    createEmptyAd(): Promise<number>;
    updateAd(id: number, ad: Partial<Ad>): Promise<void>;
    archivePage(page: Page): Promise<number>;
    updatePage(pageId: number, page: Partial<Page>): Promise<void>;
    insertAdDomain(adDomain: AdDomain): Promise<void>;
    archiveExternalUrls(externals: AdExternalUrls, adId: number, iframeId?: number): Promise<void>;
    archiveRequest(request: WebRequest): Promise<void>;
}
