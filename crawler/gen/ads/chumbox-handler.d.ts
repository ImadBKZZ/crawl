import { ElementHandle } from 'puppeteer';
import { AdHandles } from './ad-scraper.js';
export declare function splitChumbox(ad: ElementHandle): Promise<{
    platform: string;
    adHandles: AdHandles[];
} | null>;
