// Defines custom process exit codes, can be used to determine if the
// crawler should be restarted or not by automated job runners.
export var ExitCodes;
(function (ExitCodes) {
    ExitCodes[ExitCodes["OK"] = 0] = "OK";
    // Crawl input validation errors, like missing fields or mismatched
    // crawl lists when resuming previous crawls. Cannot be restarted without
    //  fixing the inputs.
    ExitCodes[ExitCodes["INPUT_ERROR"] = 242] = "INPUT_ERROR";
    // Other errors that require manual intervention before restarting, like
    // file permission issues.
    ExitCodes[ExitCodes["NON_RETRYABLE_ERROR"] = 243] = "NON_RETRYABLE_ERROR";
    // Unexpected errors that occurred during the crawl. In many cases, like
    // timeouts or network errors, the crawl can be restarted.
    ExitCodes[ExitCodes["UNCAUGHT_CRAWL_ERROR"] = 244] = "UNCAUGHT_CRAWL_ERROR";
    // Unused in node, but this code is thrown by runCrawl.sh if an error
    // is encountered in other commands (e.g. rsync failures)
    ExitCodes[ExitCodes["RUN_SCRIPT_ERROR"] = 245] = "RUN_SCRIPT_ERROR";
})(ExitCodes || (ExitCodes = {}));
export class InputError extends Error {
    constructor(message) {
        super(message);
        this.name = 'INPUT_ERROR';
    }
}
export class NonRetryableError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NON_RETRYABLE_ERROR';
    }
}
export class UncaughtCrawlError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UNCAUGHT_CRAWL_ERROR';
    }
}
//# sourceMappingURL=errors.js.map