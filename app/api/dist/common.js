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
var PARAMETER_URL = process.env.PARAMETER_URL;
function fetchParameter(path) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(PARAMETER_URL + "/" + path)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    data = _a.sent();
                    console.log("[fetchParameter]: " + path + " = " + data);
                    return [2 /*return*/, data];
            }
        });
    });
}
// 定义常量 OPENAI_URL 为 OpenAI API 的基础 URL
exports.OPENAI_URL = "api.openai.com";
/**
 * 发送请求到 OpenAI API
 * @param req - Next.js 请求对象
 * @returns 返回处理后的响应
 */
function requestOpenai(req) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function () {
        var DEFAULT_PROTOCOL, PROTOCOL, BASE_URL, DISABLE_GPT4, controller, authValue, openaiPath, baseUrl, timeoutId, fetchUrl, fetchOptions, clonedBody, jsonBody, e_1, clonedBody, jsonBody, GPT_3_MODEL, OPENAI_API_KEY, BING_URL, BING_API_KEY, BING_ONLINE, BING_URL, BING_API_KEY, BING_OFFLINE, BING_URL, BING_API_KEY, BING_GPT_4, GPT4_URL, e_2, res, newHeaders;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    DEFAULT_PROTOCOL = "https";
                    PROTOCOL = process.env.PROTOCOL || DEFAULT_PROTOCOL;
                    return [4 /*yield*/, fetchParameter("BASE_URL")];
                case 1:
                    BASE_URL = (_h.sent()) || exports.OPENAI_URL;
                    DISABLE_GPT4 = !!process.env.DISABLE_GPT4;
                    controller = new AbortController();
                    authValue = (_a = req.headers.get("Authorization")) !== null && _a !== void 0 ? _a : "";
                    openaiPath = ("" + req.nextUrl.pathname + req.nextUrl.search).replaceAll("/api/openai/", "");
                    baseUrl = BASE_URL;
                    if (!baseUrl.startsWith("http")) {
                        baseUrl = PROTOCOL + "://" + baseUrl;
                    }
                    // 移除 baseUrl 末尾的斜杠（如果有）
                    if (baseUrl.endsWith('/')) {
                        baseUrl = baseUrl.slice(0, -1);
                    }
                    // 打印代理路径和基础 URL 用于调试
                    console.log("[Proxy] ", openaiPath);
                    console.log("[Base Url]", baseUrl);
                    // 如果设置了 OPENAI_ORG_ID 环境变量，打印出来
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
                        // 设置重定向策略为手动处理
                        redirect: "manual",
                        // 设置请求为半双工模式
                        // @ts-ignore
                        duplex: "half",
                        // 设置中止信号
                        signal: controller.signal
                    };
                    if (!(DISABLE_GPT4 && req.body)) return [3 /*break*/, 5];
                    _h.label = 2;
                case 2:
                    _h.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, req.text()];
                case 3:
                    clonedBody = _h.sent();
                    fetchOptions.body = clonedBody;
                    jsonBody = JSON.parse(clonedBody);
                    // 如果请求体中包含对 GPT-4 模型的请求，返回 403 状态码
                    if (((_b = jsonBody === null || jsonBody === void 0 ? void 0 : jsonBody.model) !== null && _b !== void 0 ? _b : "").includes("gpt-4")) {
                        return [2 /*return*/, server_1.NextResponse.json({
                                error: true,
                                message: "you are not allowed to use gpt-4 model"
                            }, {
                                status: 403
                            })];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _h.sent();
                    console.error("[OpenAI] gpt4 filter", e_1);
                    return [3 /*break*/, 5];
                case 5:
                    if (!req.body) return [3 /*break*/, 26];
                    _h.label = 6;
                case 6:
                    _h.trys.push([6, 25, , 26]);
                    return [4 /*yield*/, req.text()];
                case 7:
                    clonedBody = _h.sent();
                    fetchOptions.body = clonedBody;
                    jsonBody = JSON.parse(clonedBody);
                    console.log("[Check]:", "Check Model!");
                    if (!((_c = jsonBody === null || jsonBody === void 0 ? void 0 : jsonBody.model) !== null && _c !== void 0 ? _c : "").includes("3.5")) return [3 /*break*/, 10];
                    return [4 /*yield*/, fetchParameter("GPT_3_MODEL")];
                case 8:
                    GPT_3_MODEL = _h.sent();
                    return [4 /*yield*/, fetchParameter("OPENAI_API_KEY")];
                case 9:
                    OPENAI_API_KEY = _h.sent();
                    fetchOptions.headers = new Headers(fetchOptions.headers);
                    fetchOptions.headers.set("Authorization", OPENAI_API_KEY);
                    // 如果使用了 GPT-3.5 模型，更改模型名称为 GPT-3.5-turbo-1106
                    jsonBody.model = GPT_3_MODEL;
                    // 更新 fetchOptions.body 为修改后的 jsonBody
                    fetchOptions.body = JSON.stringify(jsonBody);
                    console.log("[Model]:", "Use chatglm_pro model!");
                    _h.label = 10;
                case 10:
                    if (!((_d = jsonBody === null || jsonBody === void 0 ? void 0 : jsonBody.model) !== null && _d !== void 0 ? _d : "").includes("联网版")) return [3 /*break*/, 14];
                    return [4 /*yield*/, fetchParameter("BING_URL")];
                case 11:
                    BING_URL = _h.sent();
                    return [4 /*yield*/, fetchParameter("BING_API_KEY")];
                case 12:
                    BING_API_KEY = _h.sent();
                    return [4 /*yield*/, fetchParameter("BING_ONLINE")];
                case 13:
                    BING_ONLINE = _h.sent();
                    fetchOptions.headers = new Headers(fetchOptions.headers);
                    fetchOptions.headers.set("Authorization", BING_API_KEY);
                    fetchUrl = BING_URL + "/" + openaiPath;
                    jsonBody.model = BING_ONLINE;
                    fetchOptions.body = JSON.stringify(jsonBody);
                    console.log("[Model]:", "Use 联网版 model!");
                    _h.label = 14;
                case 14:
                    if (!((_e = jsonBody === null || jsonBody === void 0 ? void 0 : jsonBody.model) !== null && _e !== void 0 ? _e : "").includes("不联网")) return [3 /*break*/, 18];
                    return [4 /*yield*/, fetchParameter("BING_URL")];
                case 15:
                    BING_URL = _h.sent();
                    return [4 /*yield*/, fetchParameter("BING_API_KEY")];
                case 16:
                    BING_API_KEY = _h.sent();
                    return [4 /*yield*/, fetchParameter("BING_OFFLINE")];
                case 17:
                    BING_OFFLINE = _h.sent();
                    fetchOptions.headers = new Headers(fetchOptions.headers);
                    fetchOptions.headers.set("Authorization", BING_API_KEY);
                    fetchUrl = BING_URL + "/" + openaiPath;
                    jsonBody.model = BING_OFFLINE;
                    fetchOptions.body = JSON.stringify(jsonBody);
                    console.log("[Model]:", "Use 不联网 model!");
                    _h.label = 18;
                case 18:
                    if (!((_f = jsonBody === null || jsonBody === void 0 ? void 0 : jsonBody.model) !== null && _f !== void 0 ? _f : "").includes("gpt-4")) return [3 /*break*/, 22];
                    return [4 /*yield*/, fetchParameter("BING_URL")];
                case 19:
                    BING_URL = _h.sent();
                    return [4 /*yield*/, fetchParameter("BING_API_KEY")];
                case 20:
                    BING_API_KEY = _h.sent();
                    return [4 /*yield*/, fetchParameter("BING_GPT_4")];
                case 21:
                    BING_GPT_4 = _h.sent();
                    fetchOptions.headers = new Headers(fetchOptions.headers);
                    fetchOptions.headers.set("Authorization", BING_API_KEY);
                    fetchUrl = BING_URL + "/" + openaiPath;
                    jsonBody.model = BING_GPT_4;
                    fetchOptions.body = JSON.stringify(jsonBody);
                    console.log("[Model]:", "Use 不联网 model!");
                    _h.label = 22;
                case 22:
                    if (!((_g = jsonBody === null || jsonBody === void 0 ? void 0 : jsonBody.model) !== null && _g !== void 0 ? _g : "").includes("gpt-4-1106-preview")) return [3 /*break*/, 24];
                    return [4 /*yield*/, fetchParameter("BASE_URL")
                        // 默认gpt-4
                    ];
                case 23:
                    GPT4_URL = _h.sent();
                    // 默认gpt-4
                    fetchUrl = GPT4_URL + "/" + openaiPath;
                    jsonBody.model = "gpt-4-1106-preview";
                    fetchOptions.body = JSON.stringify(jsonBody);
                    console.log("[Model]:", "Use gpt-4-1106-preview-2 model!");
                    _h.label = 24;
                case 24: return [3 /*break*/, 26];
                case 25:
                    e_2 = _h.sent();
                    console.error("[Check Model Error:]", e_2);
                    return [3 /*break*/, 26];
                case 26:
                    _h.trys.push([26, , 28, 29]);
                    console.log("[fetchUrl]:", fetchUrl);
                    return [4 /*yield*/, fetch(fetchUrl, fetchOptions)];
                case 27:
                    res = _h.sent();
                    newHeaders = new Headers(res.headers);
                    newHeaders["delete"]("www-authenticate");
                    // 设置头部，禁用 nginx 缓冲
                    newHeaders.set("X-Accel-Buffering", "no");
                    // 返回响应
                    return [2 /*return*/, new Response(res.body, {
                            status: res.status,
                            statusText: res.statusText,
                            headers: newHeaders
                        })];
                case 28:
                    // 清除超时定时器
                    clearTimeout(timeoutId);
                    return [7 /*endfinally*/];
                case 29: return [2 /*return*/];
            }
        });
    });
}
exports.requestOpenai = requestOpenai;
