import adSelectors from './easylist_ad_selectors.json' with { type: "json" };
/**
 * Detects ads in the page using EasyList's CSS selectors, and returns an
 * array of element handles corresponding to ads.
 * This function also deduplicates any identical elements, or elements nested
 * inside each other.
 */
export async function identifyAdsInDOM(page) {
    const ads = await page.evaluateHandle((selectors) => {
        try {
            // Execute all of the input query selectors and collect results in a set.
            let ads = new Set();
            selectors.forEach((selector) => {
                let matches = document.querySelectorAll(selector);
                matches.forEach((match) => {
                    ads.add(match);
                });
            });
            // Remove all elements that are children of another element in the set.
            // We just want the top-most element identified as an ad.
            for (let ad of ads) {
                // For each element in the set, traverse up until it hits <body>, or another
                // element in the set.
                let removed = false;
                let current = ad;
                while (current !== document.body && current.parentNode !== null) {
                    current = current.parentNode;
                    for (let otherAd of ads) {
                        if (current === otherAd) {
                            ads.delete(ad);
                            removed = true;
                            break;
                        }
                    }
                    if (removed) {
                        break;
                    }
                }
            }
            return Array.from(ads);
        }
        catch (e) {
            throw e;
        }
    }, adSelectors);
    const numAds = await ads.evaluate((ads) => ads.length);
    const adHandles = new Set();
    for (let i = 0; i < numAds; i++) {
        let ad = await ads.evaluateHandle((ads, idx) => ads[idx], i);
        adHandles.add(ad);
    }
    return adHandles;
}
//# sourceMappingURL=ad-detection.js.map