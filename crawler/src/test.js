"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var puppeteer_1 = require("puppeteer");
var extensionPath = '/mnt/c/Users/ibouk/AppData/Local/BraveSoftware/Brave-Browser/User Data/Default/Extensions/mdjildafknihdffpkfmmpnpoiajfjnjd/1.1.3_0';
var browser = await puppeteer_1.default.launch({
    headless: false,
    args: [
        "--disable-extensions-except=".concat(extensionPath),
        "--load-extension=".concat(extensionPath)
    ],
});
browser.on('targetcreated', function (target) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (target.type() !== 'page') {
                    return [2 /*return*/];
                }
                // console.log(target);
                _b = (_a = console).log;
                _d = (_c = "targetcreated\nURL:  ".concat(target.url(), "\nType:  ").concat(target.type(), "\nOpener: ").concat((_e = target.opener()) === null || _e === void 0 ? void 0 : _e.url(), "\nWorker? ")).concat;
                return [4 /*yield*/, !!target.worker()];
            case 1:
                // console.log(target);
                _b.apply(_a, [_d.apply(_c, [_f.sent(), "\n\n"])]);
                return [2 /*return*/];
        }
    });
}); });
var page = (await browser.pages())[0];
await page.goto('https://www.nytimes.com');
await page.setRequestInterception(true);
// Event listener for request interception
page.on('request', function (request) {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
        // If the current tab is being navigated, abort the request
        // and store the URL. This stops the page from navigating.
        console.log('Intercepted navigation to: ' + request.url().substring(0, Math.min(15, request.url().length)) + '...');
        // interceptedAdUrl = request.url();
        request.abort('aborted');
    }
    else {
        // If it's not a navigation request, or not in the main frame, ignore
        // console.log('Non navigation request allowed: ' + request.url());
        request.continue();
    }
});
var cdp = await browser.target().createCDPSession();
console.log('CDP Session ID:', cdp.id());
await cdp.send('Target.setAutoAttach', {
    waitForDebuggerOnStart: true,
    autoAttach: true,
    flatten: true,
    filter: [
        { type: 'page', exclude: false },
    ]
});
cdp.on('Target.attachedToTarget', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var connection, popupCdp;
    var sessionId = _b.sessionId, targetInfo = _b.targetInfo, waitingForDebugger = _b.waitingForDebugger;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log("Target.attachedToTarget\nsessionID: ".concat(sessionId, "\ntype: ").concat(targetInfo.type, "\nurl: ").concat(targetInfo.url, "\nwaitingForDebugger: ").concat(waitingForDebugger, ",\nsubtype: ").concat(targetInfo.subtype, "\n"));
                connection = cdp.connection();
                if (!connection) {
                    console.log('Could not get connection');
                    return [2 /*return*/];
                }
                popupCdp = connection.session(sessionId);
                if (!popupCdp) {
                    console.log('Could not get popup CDP session');
                    return [2 /*return*/];
                }
                // console.log('New popup session ID:', popupCdp.id());
                // await new Promise((resolve, reject) => {setTimeout(resolve, 5000)});
                console.log('Attempting to resume tab');
                return [4 /*yield*/, popupCdp.send('Fetch.enable')];
            case 1:
                _c.sent();
                console.log('Fetch.enable sent');
                popupCdp.on('Fetch.requestPaused', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var requestId = _b.requestId, request = _b.request;
                    return __generator(this, function (_c) {
                        console.log('Fetch.requestPaused:', request.url);
                        popupCdp === null || popupCdp === void 0 ? void 0 : popupCdp.send('Fetch.failRequest', { requestId: requestId, errorReason: 'Aborted' });
                        console.log('FailRequest sent');
                        return [2 /*return*/];
                    });
                }); });
                return [4 /*yield*/, popupCdp.send('Runtime.runIfWaitingForDebugger')];
            case 2:
                _c.sent();
                console.log('Runtime.runIfWaitingForDebugger sent');
                return [4 /*yield*/, popupCdp.send('Target.closeTarget', { targetId: targetInfo.targetId })];
            case 3:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
console.log('ready');
