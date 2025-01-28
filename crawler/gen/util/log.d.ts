import fs from 'fs';
import { CrawlerFlags } from '../crawler.js';
export declare enum LogLevel {
    ERROR = 1,
    WARNING = 2,
    INFO = 3,
    DEBUG = 4,
    VERBOSE = 5
}
declare global {
    var LOG_FILE_STREAM: fs.WriteStream | undefined;
    var LOG_LEVEL: LogLevel;
}
export declare function setLogDirFromFlags(crawlerFlags: CrawlerFlags): void;
export declare function error(e: Error, url?: string): void;
export declare function strError(message: string): void;
export declare function warning(message: string): void;
export declare function info(message: string): void;
export declare function debug(message: string): void;
export declare function verbose(message: string): void;
