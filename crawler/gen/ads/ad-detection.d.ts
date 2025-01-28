import { ElementHandle, Page } from 'puppeteer';
/**
 * Detects ads in the page using EasyList's CSS selectors, and returns an
 * array of element handles corresponding to ads.
 * This function also deduplicates any identical elements, or elements nested
 * inside each other.
 */
export declare function identifyAdsInDOM(page: Page): Promise<Set<ElementHandle<Element>>>;
