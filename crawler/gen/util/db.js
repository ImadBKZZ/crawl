import pg from 'pg';
import * as log from './log.js';
/**
 * Wrapper over the postgres client for inserting data from the crawler.
 * Singleton class - call initialize() at the beginning, call getInstance()
 * subsequently from any other scope.
 */
export default class DbClient {
    constructor(conf) {
        this.postgres = new pg.Client(conf);
    }
    /**
     * Sets up a new DbClient. Must be called the first time this is used in
     * the script.
     * @param conf Postgres config
     * @returns A DbClient instance.
     */
    static async initialize(conf) {
        if (DbClient.instance) {
            await DbClient.instance.postgres.end();
        }
        DbClient.instance = new DbClient(conf);
        await DbClient.instance.postgres.connect();
        log.info('Postgres driver initialized');
        return DbClient.instance;
    }
    /**
     * Gets the DbClient.
     * @returns The global DbClient.
     */
    static getInstance() {
        if (!DbClient.instance) {
            throw new Error('DbClient must be initialized before use');
        }
        return DbClient.instance;
    }
    /**
     * Ends the client connection to the database.
     * @returns
     */
    async end() {
        return this.postgres.end();
    }
    /**
     * Generic insert wrapper
     * @param options
     * @returns
     */
    async insert(options) {
        const columns = Object.keys(options.data).join(', ');
        const valuesStr = [...Array(Object.keys(options.data).length).keys()]
            .map((v) => `$${v + 1}`).join(', ');
        const params = Object.values(options.data);
        let insert = `INSERT INTO ${options.table} (${columns}) VALUES (${valuesStr})`;
        if (options.returning) {
            insert += ` RETURNING ${options.returning}`;
        }
        insert += ';';
        const result = await this.postgres.query(insert, params);
        if (!options.returning) {
            return;
        }
        if (result.rowCount !== 1) {
            throw new Error('Insert query didn\'t return a value');
        }
        return result.rows[0][options.returning];
    }
    async updateById(options) {
        const columns = Object.keys(options.data)
            .map((col, idx) => `${col}=$${idx + 1}`)
            .join(', ');
        const params = Object.values(options.data);
        params.push(options.id);
        const update = `UPDATE ${options.table} SET ${columns} WHERE id=$${params.length}`;
        const result = await this.postgres.query(update, params);
        if (!result.rowCount || result.rowCount == 0) {
            log.warning(`Could not update row in table ${options.table} with id ${options.id}`);
        }
        else if (result.rowCount > 1) {
            log.warning(`Updated more than one row in ${options.table} with id ${options.id}`);
        }
    }
    // Saves a scraped iframe to the database, and recursively saves any child
    // iframes as well.
    async archiveScrapedIFrame(iframe, adId, parentId) {
        try {
            const frameId = await this.insert({
                table: 'iframe',
                returning: 'id',
                data: {
                    timestamp: iframe.timestamp,
                    url: iframe.url,
                    parent_ad: adId,
                    parent_iframe: parentId ? parentId : null,
                    html: iframe.html
                }
            });
            if (iframe.externals) {
                await this.archiveExternalUrls(iframe.externals, adId, frameId);
            }
            for (let child of iframe.children) {
                await this.archiveScrapedIFrame(child, adId, frameId);
            }
        }
        catch (e) {
            log.strError('Error while archiving iframe ' + iframe.url);
            log.error(e);
        }
    }
    async createAd(ad) {
        const adId = await this.insert({
            table: 'ad',
            returning: 'id',
            data: ad
        });
        return adId;
    }
    async createEmptyAd() {
        const result = await this.postgres.query('INSERT INTO ad DEFAULT VALUES RETURNING id');
        return result.rows[0].id;
    }
    async updateAd(id, ad) {
        return this.updateById({
            table: 'ad',
            id: id,
            data: ad
        });
    }
    async archivePage(page) {
        const pageId = await this.insert({
            table: 'page',
            returning: 'id',
            data: page
        });
        return pageId;
    }
    async updatePage(pageId, page) {
        await this.updateById({
            table: 'page',
            id: pageId,
            data: page
        });
    }
    async insertAdDomain(adDomain) {
        this.insert({
            table: 'ad_domain',
            data: adDomain
        });
    }
    async archiveExternalUrls(externals, adId, iframeId) {
        const { anchorHrefs, iframeSrcs, scriptSrcs, imgSrcs } = externals;
        const insertDomains = async (domains, type) => {
            for (let d of domains) {
                try {
                    let hostname = new URL(d).hostname;
                    await this.insertAdDomain({
                        ad_id: adId, iframe_id: iframeId, url: d, hostname: hostname, type: type
                    });
                }
                catch (e) {
                    continue;
                }
            }
        };
        await insertDomains(anchorHrefs, `${iframeId ? 'subframe_' : ''}anchor_href`);
        await insertDomains(iframeSrcs, `${iframeId ? 'subframe_' : ''}iframe_src`);
        await insertDomains(scriptSrcs, `${iframeId ? 'subframe_' : ''}script_src`);
        await insertDomains(imgSrcs, `${iframeId ? 'subframe_' : ''}img_src`);
    }
    async archiveRequest(request) {
        await this.insert({
            table: 'request',
            data: request
        });
    }
}
//# sourceMappingURL=db.js.map