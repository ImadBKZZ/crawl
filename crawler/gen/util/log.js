import chalk from 'chalk';
import fs from 'fs';
import dayjs from 'dayjs';
import path from 'path';
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
    LogLevel[LogLevel["WARNING"] = 2] = "WARNING";
    LogLevel[LogLevel["INFO"] = 3] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
    LogLevel[LogLevel["VERBOSE"] = 5] = "VERBOSE";
})(LogLevel || (LogLevel = {}));
globalThis.LOG_FILE_STREAM = undefined;
globalThis.LOG_LEVEL = LogLevel.INFO;
// Call to set where log files should be stored - directory structure and
// name are based on the job id and crawl name. If not called, no logs will
// be written to file.
export function setLogDirFromFlags(crawlerFlags) {
    if (LOG_FILE_STREAM) {
        console.log('Log file already open');
        return;
    }
    let logDirSegments = [crawlerFlags.outputDir, 'logs'];
    if (crawlerFlags.jobId) {
        logDirSegments.push(`job_${crawlerFlags.jobId.toString()}`);
    }
    let logDir = path.resolve(...logDirSegments);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    let logFile = path.resolve(logDir, `${crawlerFlags.crawlName}.txt`);
    console.log('Opening log file at ' + logFile);
    globalThis.LOG_FILE_STREAM = fs.createWriteStream(logFile, { flags: 'a' });
    globalThis.LOG_LEVEL = crawlerFlags.logLevel ? crawlerFlags.logLevel : LogLevel.INFO;
}
export function error(e, url) {
    let log = {
        ts: dayjs().format(),
        level: 'ERROR',
        message: `${url ? url + ': ' : ''}${e.message}`,
        stack: e.stack
    };
    let logStr = formatLog(log);
    if (LOG_LEVEL >= LogLevel.ERROR) {
        printLog(logStr, chalk.red);
    }
    writeLog(logStr);
}
export function strError(message) {
    let log = {
        ts: dayjs().format(),
        level: 'ERROR',
        message: message
    };
    let logStr = formatLog(log);
    if (LOG_LEVEL >= LogLevel.ERROR) {
        printLog(logStr, chalk.red);
    }
    writeLog(logStr);
}
export function warning(message) {
    let log = {
        ts: dayjs().format(),
        level: 'WARNING',
        message: message
    };
    let logStr = formatLog(log);
    if (LOG_LEVEL >= LogLevel.WARNING) {
        printLog(logStr, chalk.yellow);
    }
    writeLog(logStr);
}
export function info(message) {
    let log = {
        ts: dayjs().format(),
        level: 'INFO',
        message: message
    };
    let logStr = formatLog(log);
    if (LOG_LEVEL >= LogLevel.INFO) {
        printLog(logStr, chalk.whiteBright);
    }
    writeLog(logStr);
}
export function debug(message) {
    let log = {
        ts: dayjs().format(),
        level: 'DEBUG',
        message: message
    };
    if (LOG_LEVEL >= LogLevel.DEBUG) {
        let logStr = formatLog(log);
        printLog(logStr, chalk.whiteBright.dim);
        writeLog(logStr);
    }
}
export function verbose(message) {
    let log = {
        ts: dayjs().format(),
        level: 'VERBOSE',
        message: message
    };
    if (LOG_LEVEL >= LogLevel.VERBOSE) {
        let logStr = formatLog(log);
        printLog(logStr, chalk.white.dim);
        writeLog(logStr);
    }
}
function writeLog(l) {
    if (LOG_FILE_STREAM) {
        LOG_FILE_STREAM.write(l + '\n');
    }
}
function formatLog(l) {
    return `[${l.level} ${l.ts}] ${l.message}${l.stack ? '\n' + l.stack : ''}`;
}
function printLog(l, color) {
    console.log(color(l));
}
//# sourceMappingURL=log.js.map