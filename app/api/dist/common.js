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
// 定义常量 OPENAI_URL 为 OpenAI API 的基础 URL
exports.OPENAI_URL = "api.openai.com";
// 定义默认协议为 https
var DEFAULT_PROTOCOL = "https";
// 从环境变量中获取协议，若不存在则使用默认协议
var PROTOCOL = process.env.PROTOCOL || DEFAULT_PROTOCOL;
// 从环境变量中获取基础 URL，若不存在则使用 OpenAI 的 URL
var BASE_URL = process.env.BASE_URL || exports.OPENAI_URL;
// 从环境变量中获取 DISABLE_GPT4 变量，若存在则将其转换为布尔值
var DISABLE_GPT4 = !!process.env.DISABLE_GPT4;
var GPT4_URL = process.env.GPT4_URL;
var BING_URL = process.env.BING_URL;
/**
 * 发送请求到 OpenAI API
 * @param req - Next.js 请求对象
 * @returns 返回处理后的响应
 */
function requestOpenai(req) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function () {
        var controller, authValue, openaiPath, baseUrl, timeoutId, fetchUrl, fetchOptions, clonedBody, jsonBody, e_1, clonedBody, jsonBody, e_2, res, newHeaders;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
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
                    if (!(DISABLE_GPT4 && req.body)) return [3 /*break*/, 4];
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, req.text()];
                case 2:
                    clonedBody = _f.sent();
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
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _f.sent();
                    console.error("[OpenAI] gpt4 filter", e_1);
                    return [3 /*break*/, 4];
                case 4:
                    if (!req.body) return [3 /*break*/, 8];
                    _f.label = 5;
                case 5:
                    _f.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, req.text()];
                case 6:
                    clonedBody = _f.sent();
                    fetchOptions.body = clonedBody;
                    jsonBody = JSON.parse(clonedBody);
                    // 检查请求体中是否包含对 GPT-4 模型的请求
                    if (((_c = jsonBody === null || jsonBody === void 0 ? void 0 : jsonBody.model) !== null && _c !== void 0 ? _c : "").includes("gpt-4")) {
                        // 如果使用了 GPT-4 模型，更改请求头和 URL
                        fetchOptions.headers = new Headers(fetchOptions.headers);
                        fetchOptions.headers.set("Authorization", "Bearer " + process.env.GPT4_API_KEY);
                        fetchUrl = GPT4_URL + "/v1/chat/completions";
                        // 默认gpt-4-1106-preview
                        jsonBody.model = "gpt-4-1106-preview";
                        fetchOptions.body = JSON.stringify(jsonBody);
                    }
                    // 检查请求体中是否包含对 GPT-3.5 模型的请求
                    if (((_d = jsonBody === null || jsonBody === void 0 ? void 0 : jsonBody.model) !== null && _d !== void 0 ? _d : "").includes("gpt-3.5")) {
                        // 如果使用了 GPT-3.5 模型，更改模型名称为 GPT-3.5-turbo-1106
                        jsonBody.model = "gpt-3.5-turbo-1106";
                        // 更新 fetchOptions.body 为修改后的 jsonBody
                        fetchOptions.body = JSON.stringify(jsonBody);
                    }
                    // 替换所有模型为free-gpt4模型
                    // 如果使用了 GPT-4 模型，更改请求头和 URL
                    fetchOptions.headers = new Headers(fetchOptions.headers);
                    fetchOptions.headers.set("Authorization", "Bearer " + process.env.GPT4_API_KEY);
                    fetchUrl = GPT4_URL + "/v1/chat/completions";
                    // 默认"free-gpt4"
                    jsonBody.model = "free-gpt4";
                    fetchOptions.body = JSON.stringify(jsonBody);
                    // 检查请求体中是否包含对 bing 模型的请求
                    if (((_e = jsonBody === null || jsonBody === void 0 ? void 0 : jsonBody.model) !== null && _e !== void 0 ? _e : "").includes("g4t")) {
                        // 如果使用了 bing 模型，更改请求头和 URL
                        fetchOptions.headers = new Headers(fetchOptions.headers);
                        fetchUrl = BING_URL + "/api/v1/chat/completions";
                        fetchOptions.body = JSON.stringify(jsonBody);
                    }
                    return [3 /*break*/, 8];
                case 7:
                    e_2 = _f.sent();
                    console.error("[OpenAI] gpt4 check", e_2);
                    return [3 /*break*/, 8];
                case 8:
                    _f.trys.push([8, , 10, 11]);
                    return [4 /*yield*/, fetch(fetchUrl, fetchOptions)];
                case 9:
                    res = _f.sent();
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
                case 10:
                    // 清除超时定时器
                    clearTimeout(timeoutId);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.requestOpenai = requestOpenai;
