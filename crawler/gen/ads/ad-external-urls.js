// Extracts URLs in the HTML content of an ad, such as the "href" attribute in
// an <a> element, or the "src" attribute in an <img> element.
// This data can sometimes indicate the provenance of an ad.
export async function extractExternalUrls(handle) {
    const anchorHrefs = await handle.$$eval('a', (elements) => {
        let anchors = elements;
        return anchors.map(a => a.href);
    });
    const iframeSrcs = await handle.$$eval('iframe', (elements) => {
        let iframes = elements;
        return iframes.map(iframe => iframe.src);
    });
    const scriptSrcs = await handle.$$eval('script', (elements) => {
        let scripts = elements;
        return scripts.map(script => script.src);
    });
    const imgSrcs = await handle.$$eval('img', (elements) => {
        let imgs = elements;
        return imgs.map(img => img.src);
    });
    return {
        anchorHrefs: anchorHrefs,
        iframeSrcs: iframeSrcs,
        scriptSrcs: scriptSrcs,
        imgSrcs: imgSrcs
    };
}
//# sourceMappingURL=ad-external-urls.js.map