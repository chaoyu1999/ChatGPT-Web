"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
exports.requestOpenai = exports.OPENAI_URL = void 0;
var server_1 = require("next/server");
exports.OPENAI_URL = "api.openai.com";
var DEFAULT_PROTOCOL = "https";
var PROTOCOL = process.env.PROTOCOL || DEFAULT_PROTOCOL;
var BASE_URL = process.env.BASE_URL || exports.OPENAI_URL;
var DISABLE_GPT4 = !!process.env.DISABLE_GPT4;
function requestOpenai(req) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var controller, authValue, openaiPath, baseUrl, timeoutId, fetchUrl, fetchOptions, clonedBody, jsonBody, e_1, res, newHeaders;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    controller = new AbortController();
                    authValue = (_a = req.headers.get("Authorization")) !== null && _a !== void 0 ? _a : "";
                    openaiPath = ("" + req.nextUrl.pathname + req.nextUrl.search).replaceAll("/api/openai/", "");
                    baseUrl = BASE_URL;
                    if (!baseUrl.startsWith("http")) {
                        baseUrl = PROTOCOL + "://" + baseUrl;
                    }
                    if (baseUrl.endsWith('/')) {
                        baseUrl = baseUrl.slice(0, -1);
                    }
                    console.log("[Proxy] ", openaiPath);
                    console.log("[Base Url]", baseUrl);
                    if (process.env.OPENAI_ORG_ID) {
                        console.log("[Org ID]", process.env.OPENAI_ORG_ID);
                    }
                    timeoutId = setTimeout(function () {
                        controller.abort();
                    }, 10 * 60 * 1000);
                    fetchUrl = baseUrl + "/" + openaiPath;
                    fetchOptions = {
                        headers: __assign({ "Content-Type": "application/json", "Cache-Control": "no-store", Authorization: authValue }, (process.env.OPENAI_ORG_ID && {
                            "OpenAI-Organization": process.env.OPENAI_ORG_ID
                        })),
                        method: req.method,
                        body: req.body,
                        // to fix #2485: https://stackoverflow.com/questions/55920957/cloudflare-worker-typeerror-one-time-use-body
                        redirect: "manual",
                        // @ts-ignore
                        duplex: "half",
                        signal: controller.signal
                    };
                    if (!(DISABLE_GPT4 && req.body)) return [3 /*break*/, 4];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, req.text()];
                case 2:
                    clonedBody = _c.sent();
                    fetchOptions.body = clonedBody;
                    jsonBody = JSON.parse(clonedBody);
                    if (((_b = jsonBody === null || jsonBody === void 0 ? void 0 : jsonBody.model) !== null && _b !== void 0 ? _b : "").includes("gpt-4")) {
                        return [2 /*return*/, server_1.NextResponse.json({
                                error: true,
                                message: "you are not allowed to use gpt-4 model"
                            }, {
                                status: 403
                            })];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _c.sent();
                    console.error("[OpenAI] gpt4 filter", e_1);
                    return [3 /*break*/, 4];
                case 4:
                    _c.trys.push([4, , 6, 7]);
                    return [4 /*yield*/, fetch(fetchUrl, fetchOptions)];
                case 5:
                    res = _c.sent();
                    newHeaders = new Headers(res.headers);
                    newHeaders["delete"]("www-authenticate");
                    // to disable nginx buffering
                    newHeaders.set("X-Accel-Buffering", "no");
                    return [2 /*return*/, new Response(res.body, {
                            status: res.status,
                            statusText: res.statusText,
                            headers: newHeaders
                        })];
                case 6:
                    clearTimeout(timeoutId);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.requestOpenai = requestOpenai;
