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
exports.OpenaiPath = exports.ChatGPTApi = void 0;
// 导入一些常量，如 API 的主机地址，可用的模型列表，请求的超时时间等
var constant_1 = require("@/app/constant");
exports.OpenaiPath = constant_1.OpenaiPath;
// 导入一些应用程序的状态管理器，用于获取和设置配置，聊天记录等
var store_1 = require("@/app/store");
// 导入一些类型定义，如聊天选项，请求头，API 接口，语言模型，用量等
var api_1 = require("../api");
// 导入一些本地化的文本，用于支持多种语言
var locales_1 = require("../../locales");
// 导入一个封装了 fetch API 的库，用于发送和接收事件流数据
var fetch_event_source_1 = require("@fortaine/fetch-event-source");
// 导入一个工具函数，用于格式化对象为可读的字符串
var format_1 = require("@/app/utils/format");
// 导入一个函数，用于获取客户端的配置
var client_1 = require("@/app/config/client");
var ChatGPTApi = /** @class */ (function () {
    function ChatGPTApi() {
        this.disableListModels = true;
    }
    ChatGPTApi.prototype.path = function (path) {
        var _a;
        var openaiUrl = store_1.useAccessStore.getState().openaiUrl;
        var apiPath = "/api/openai";
        if (openaiUrl.length === 0) {
            var isApp = !!((_a = client_1.getClientConfig()) === null || _a === void 0 ? void 0 : _a.isApp);
            openaiUrl = isApp ? constant_1.DEFAULT_API_HOST : apiPath;
        }
        if (openaiUrl.endsWith("/")) {
            openaiUrl = openaiUrl.slice(0, openaiUrl.length - 1);
        }
        if (!openaiUrl.startsWith("http") && !openaiUrl.startsWith(apiPath)) {
            openaiUrl = "https://" + openaiUrl;
        }
        return [openaiUrl, path].join("/");
    };
    ChatGPTApi.prototype.extractMessage = function (res) {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = res.choices) === null || _a === void 0 ? void 0 : _a.at(0)) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) !== null && _d !== void 0 ? _d : "";
    };
    ChatGPTApi.prototype.chat = function (options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var messages, modelConfig, requestPayload, shouldStream, controller, chatPayload, chatPath, requestTimeoutId_1, responseText_1, finished_1, finish_1, res, resJson, message, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        messages = options.messages.map(function (v) { return ({
                            role: v.role,
                            content: v.content
                        }); });
                        modelConfig = __assign(__assign(__assign({}, store_1.useAppConfig.getState().modelConfig), store_1.useChatStore.getState().currentSession().mask.modelConfig), {
                            model: options.config.model
                        });
                        requestPayload = {
                            messages: messages,
                            stream: options.config.stream,
                            model: modelConfig.model,
                            temperature: modelConfig.temperature,
                            presence_penalty: modelConfig.presence_penalty,
                            frequency_penalty: modelConfig.frequency_penalty,
                            top_p: modelConfig.top_p
                        };
                        console.log("[Request] openai payload: ", requestPayload);
                        shouldStream = !!options.config.stream;
                        controller = new AbortController();
                        (_a = options.onController) === null || _a === void 0 ? void 0 : _a.call(options, controller);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, , 7]);
                        chatPayload = {
                            method: "POST",
                            body: JSON.stringify(requestPayload),
                            signal: controller.signal,
                            headers: api_1.getHeaders()
                        };
                        chatPath = void 0;
                        // Check if model contains 'gpt-4'
                        if (requestPayload.model.includes('gpt-4')) {
                            // If it contains 'gpt-4', set chatPath to an empty string
                            chatPath = "https://rao223-rjl9zf.hf.space/v1/chat/completions";
                            chatPayload.headers.Authorization = "sk-9WPhm2kXo3HM0upeFdE963A6E7Db47AaA7EbE9B5Db0c9224";
                        }
                        else {
                            // If it doesn't contain 'gpt-4', set chatPath to OpenaiPath.ChatPath
                            chatPath = this.path(constant_1.OpenaiPath.ChatPath);
                        }
                        // const chatPath = this.path(OpenaiPath.ChatPath);
                        console.log("[chatPath]", chatPath);
                        requestTimeoutId_1 = setTimeout(function () { return controller.abort(); }, constant_1.REQUEST_TIMEOUT_MS);
                        if (!shouldStream) return [3 /*break*/, 2];
                        responseText_1 = "";
                        finished_1 = false;
                        finish_1 = function () {
                            if (!finished_1) {
                                options.onFinish(responseText_1);
                                finished_1 = true;
                            }
                        };
                        controller.signal.onabort = finish_1;
                        fetch_event_source_1.fetchEventSource(chatPath, __assign(__assign({}, chatPayload), { onopen: function (res) {
                                var _a;
                                return __awaiter(this, void 0, void 0, function () {
                                    var contentType, responseTexts, extraInfo, resJson, _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                clearTimeout(requestTimeoutId_1);
                                                contentType = res.headers.get("content-type");
                                                console.log("[OpenAI] request response content type: ", contentType);
                                                if (!(contentType === null || contentType === void 0 ? void 0 : contentType.startsWith("text/plain"))) return [3 /*break*/, 2];
                                                return [4 /*yield*/, res.clone().text()];
                                            case 1:
                                                responseText_1 = _c.sent();
                                                return [2 /*return*/, finish_1()];
                                            case 2:
                                                if (!(!res.ok ||
                                                    !((_a = res.headers
                                                        .get("content-type")) === null || _a === void 0 ? void 0 : _a.startsWith(fetch_event_source_1.EventStreamContentType)) ||
                                                    res.status !== 200)) return [3 /*break*/, 8];
                                                responseTexts = [responseText_1];
                                                return [4 /*yield*/, res.clone().text()];
                                            case 3:
                                                extraInfo = _c.sent();
                                                _c.label = 4;
                                            case 4:
                                                _c.trys.push([4, 6, , 7]);
                                                return [4 /*yield*/, res.clone().json()];
                                            case 5:
                                                resJson = _c.sent();
                                                extraInfo = format_1.prettyObject(resJson);
                                                return [3 /*break*/, 7];
                                            case 6:
                                                _b = _c.sent();
                                                return [3 /*break*/, 7];
                                            case 7:
                                                if (res.status === 401) {
                                                    responseTexts.push(locales_1["default"].Error.Unauthorized);
                                                }
                                                if (extraInfo) {
                                                    responseTexts.push(extraInfo);
                                                }
                                                responseText_1 = responseTexts.join("\n\n");
                                                return [2 /*return*/, finish_1()];
                                            case 8: return [2 /*return*/];
                                        }
                                    });
                                });
                            },
                            onmessage: function (msg) {
                                var _a;
                                if (msg.data === "[DONE]" || finished_1) {
                                    return finish_1();
                                }
                                var text = msg.data;
                                try {
                                    var json = JSON.parse(text);
                                    var delta = json.choices[0].delta.content;
                                    if (delta) {
                                        responseText_1 += delta;
                                        (_a = options.onUpdate) === null || _a === void 0 ? void 0 : _a.call(options, responseText_1, delta);
                                    }
                                }
                                catch (e) {
                                    console.error("[Request] parse error", text, msg);
                                }
                            },
                            onclose: function () {
                                finish_1();
                            },
                            onerror: function (e) {
                                var _a;
                                (_a = options.onError) === null || _a === void 0 ? void 0 : _a.call(options, e);
                                throw e;
                            }, openWhenHidden: true }));
                        return [3 /*break*/, 5];
                    case 2: return [4 /*yield*/, fetch(chatPath, chatPayload)];
                    case 3:
                        res = _c.sent();
                        clearTimeout(requestTimeoutId_1);
                        return [4 /*yield*/, res.json()];
                    case 4:
                        resJson = _c.sent();
                        message = this.extractMessage(resJson);
                        options.onFinish(message);
                        _c.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _c.sent();
                        console.log("[Request] failed to make a chat request", e_1);
                        (_b = options.onError) === null || _b === void 0 ? void 0 : _b.call(options, e_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ChatGPTApi.prototype.usage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var formatDate, ONE_DAY, now, startOfMonth, startDate, endDate, _a, used, subs, response, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        formatDate = function (d) {
                            return d.getFullYear() + "-" + (d.getMonth() + 1).toString().padStart(2, "0") + "-" + d
                                .getDate()
                                .toString()
                                .padStart(2, "0");
                        };
                        ONE_DAY = 1 * 24 * 60 * 60 * 1000;
                        now = new Date();
                        startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                        startDate = formatDate(startOfMonth);
                        endDate = formatDate(new Date(Date.now() + ONE_DAY));
                        return [4 /*yield*/, Promise.all([
                                fetch(this.path(constant_1.OpenaiPath.UsagePath + "?start_date=" + startDate + "&end_date=" + endDate), {
                                    method: "GET",
                                    headers: api_1.getHeaders()
                                }),
                                fetch(this.path(constant_1.OpenaiPath.SubsPath), {
                                    method: "GET",
                                    headers: api_1.getHeaders()
                                }),
                            ])];
                    case 1:
                        _a = _b.sent(), used = _a[0], subs = _a[1];
                        if (used.status === 401) {
                            throw new Error(locales_1["default"].Error.Unauthorized);
                        }
                        if (!used.ok || !subs.ok) {
                            throw new Error("Failed to query usage from openai");
                        }
                        return [4 /*yield*/, used.json()];
                    case 2:
                        response = (_b.sent());
                        return [4 /*yield*/, subs.json()];
                    case 3:
                        total = (_b.sent());
                        if (response.error && response.error.type) {
                            throw Error(response.error.message);
                        }
                        if (response.total_usage) {
                            response.total_usage = Math.round(response.total_usage) / 100;
                        }
                        if (total.hard_limit_usd) {
                            total.hard_limit_usd = Math.round(total.hard_limit_usd * 100) / 100;
                        }
                        return [2 /*return*/, {
                                used: response.total_usage,
                                total: total.hard_limit_usd
                            }];
                }
            });
        });
    };
    ChatGPTApi.prototype.models = function () {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var res, resJson, chatModels;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.disableListModels) {
                            return [2 /*return*/, constant_1.DEFAULT_MODELS.slice()];
                        }
                        return [4 /*yield*/, fetch(this.path(constant_1.OpenaiPath.ListModelPath), {
                                method: "GET",
                                headers: __assign({}, api_1.getHeaders())
                            })];
                    case 1:
                        res = _b.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        resJson = (_b.sent());
                        chatModels = (_a = resJson.data) === null || _a === void 0 ? void 0 : _a.filter(function (m) { return m.id.startsWith("gpt-"); });
                        console.log("[Models]", chatModels);
                        if (!chatModels) {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, chatModels.map(function (m) { return ({
                                name: m.id,
                                available: true
                            }); })];
                }
            });
        });
    };
    return ChatGPTApi;
}());
exports.ChatGPTApi = ChatGPTApi;
