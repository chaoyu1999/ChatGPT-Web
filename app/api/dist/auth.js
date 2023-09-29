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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.auth = void 0;
var server_1 = require("../config/server");
var spark_md5_1 = require("spark-md5");
var constant_1 = require("../constant");
function insertMessage(ip, UA, time, message) {
    return __awaiter(this, void 0, Promise, function () {
        var url, data, fetchOptions, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://api.cloudflare.com/client/v4/accounts/" + constant_1.AUTH_ID + "/d1/database/" + constant_1.DB_ID + "/query";
                    data = {
                        'params': [ip, UA, time, message],
                        'sql': 'INSERT INTO messages (ip, UA, time, message) VALUES (?, ?, ?, ?);'
                    };
                    fetchOptions = {
                        method: 'POST',
                        headers: new Headers({
                            Authorization: "Bearer " + constant_1.AUTH_ID,
                            'X-Auth-Key': constant_1.AUTH_KEY !== null && constant_1.AUTH_KEY !== void 0 ? constant_1.AUTH_KEY : '',
                            'X-Auth-Email': constant_1.AUTH_EMAIL !== null && constant_1.AUTH_EMAIL !== void 0 ? constant_1.AUTH_EMAIL : '',
                            'Content-Type': 'application/json'
                        }),
                        body: JSON.stringify(data)
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch(url, fetchOptions)];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        console.log('Message inserted successfully');
                    }
                    else {
                        console.error('Error inserting message:', response.statusText);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error inserting message:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getIP(req) {
    var _a, _b;
    var ip = (_a = req.ip) !== null && _a !== void 0 ? _a : req.headers.get("x-real-ip");
    var forwardedFor = req.headers.get("x-forwarded-for");
    if (!ip && forwardedFor) {
        ip = (_b = forwardedFor.split(",").at(0)) !== null && _b !== void 0 ? _b : "";
    }
    return ip !== null && ip !== void 0 ? ip : "";
}
function getUA(req) {
    var _a;
    return (_a = req.headers.get("user-agent")) !== null && _a !== void 0 ? _a : "";
}
function parseApiKey(bearToken) {
    var token = bearToken.trim().replaceAll("Bearer ", "").trim();
    var isOpenAiKey = !token.startsWith(constant_1.ACCESS_CODE_PREFIX);
    return {
        accessCode: isOpenAiKey ? "" : token.slice(constant_1.ACCESS_CODE_PREFIX.length),
        apiKey: isOpenAiKey ? token : ""
    };
}
function auth(req) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var authToken, _b, accessCode, token, hashedCode, serverConfig, message, apiKey;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    authToken = (_a = req.headers.get("Authorization")) !== null && _a !== void 0 ? _a : "";
                    _b = parseApiKey(authToken), accessCode = _b.accessCode, token = _b.apiKey;
                    hashedCode = spark_md5_1["default"].hash(accessCode !== null && accessCode !== void 0 ? accessCode : "").trim();
                    serverConfig = server_1.getServerSideConfig();
                    console.log("[Auth] allowed hashed codes: ", __spreadArrays(serverConfig.codes));
                    console.log("[Auth] got access code:", accessCode);
                    console.log("[Auth] hashed access code:", hashedCode);
                    console.log("[User IP] ", getIP(req));
                    console.log("[Time] ", new Date().toLocaleString());
                    return [4 /*yield*/, req.clone().json()]; // 获取消息内容
                case 1:
                    message = _c.sent() // 获取消息内容
                    ;
                    message = JSON.stringify(message);
                    insertMessage(getIP(req), getUA(req), new Date().toLocaleString(), message); // 将消息插入数据库
                    if (serverConfig.needCode && !serverConfig.codes.has(hashedCode) && !token) {
                        return [2 /*return*/, {
                                error: true,
                                msg: !accessCode ? "empty access code" : "wrong access code"
                            }];
                    }
                    // if user does not provide an api key, inject system api key
                    if (!token) {
                        apiKey = serverConfig.apiKey;
                        if (apiKey) {
                            console.log("[Auth] use system api key");
                            req.headers.set("Authorization", "Bearer " + apiKey);
                        }
                        else {
                            console.log("[Auth] admin did not provide an api key");
                        }
                    }
                    else {
                        console.log("[Auth] use user api key");
                    }
                    return [2 /*return*/, {
                            error: false
                        }];
            }
        });
    });
}
exports.auth = auth;
