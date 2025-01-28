import { ElementHandle } from 'puppeteer';
export interface AdExternalUrls {
    anchorHrefs: string[];
    iframeSrcs: string[];
    scriptSrcs: string[];
    imgSrcs: string[];
}
export declare function extractExternalUrls(handle: ElementHandle): Promise<{
    anchorHrefs: string[];
    iframeSrcs: string[];
    scriptSrcs: string[];
    imgSrcs: string[];
}>;
