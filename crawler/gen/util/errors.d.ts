export declare enum ExitCodes {
    OK = 0,
    INPUT_ERROR = 242,
    NON_RETRYABLE_ERROR = 243,
    UNCAUGHT_CRAWL_ERROR = 244,
    RUN_SCRIPT_ERROR = 245
}
export declare class InputError extends Error {
    constructor(message: string);
}
export declare class NonRetryableError extends Error {
    constructor(message: string);
}
export declare class UncaughtCrawlError extends Error {
    constructor(message: string);
}
