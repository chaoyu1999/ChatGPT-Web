"use client";
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
exports.__esModule = true;
exports.Home = exports.useLoadData = exports.useSwitchTheme = exports.Loading = void 0;
require("../polyfill");
var react_1 = require("react");
var home_module_scss_1 = require("./home.module.scss");
var bot_svg_1 = require("../icons/bot.svg");
var three_dots_svg_1 = require("../icons/three-dots.svg");
var utils_1 = require("../utils");
var dynamic_1 = require("next/dynamic");
var constant_1 = require("../constant");
var error_1 = require("./error");
var locales_1 = require("../locales");
var react_router_dom_1 = require("react-router-dom");
var sidebar_1 = require("./sidebar");
var config_1 = require("../store/config");
var auth_1 = require("./auth");
var client_1 = require("../config/client");
var api_1 = require("../client/api");
var store_1 = require("../store");
function Loading(props) {
    return (React.createElement("div", { className: home_module_scss_1["default"]["loading-content"] + " no-dark" },
        !props.noLogo && React.createElement(bot_svg_1["default"], null),
        React.createElement(three_dots_svg_1["default"], null)));
}
exports.Loading = Loading;
var Settings = dynamic_1["default"](function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./settings"); })];
        case 1: return [2 /*return*/, (_a.sent()).Settings];
    }
}); }); }, {
    loading: function () { return React.createElement(Loading, { noLogo: true }); }
});
var Chat = dynamic_1["default"](function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./chat"); })];
        case 1: return [2 /*return*/, (_a.sent()).Chat];
    }
}); }); }, {
    loading: function () { return React.createElement(Loading, { noLogo: true }); }
});
var NewChat = dynamic_1["default"](function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./new-chat"); })];
        case 1: return [2 /*return*/, (_a.sent()).NewChat];
    }
}); }); }, {
    loading: function () { return React.createElement(Loading, { noLogo: true }); }
});
var MaskPage = dynamic_1["default"](function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./mask"); })];
        case 1: return [2 /*return*/, (_a.sent()).MaskPage];
    }
}); }); }, {
    loading: function () { return React.createElement(Loading, { noLogo: true }); }
});
function useSwitchTheme() {
    var config = config_1.useAppConfig();
    react_1.useEffect(function () {
        document.body.classList.remove("light");
        document.body.classList.remove("dark");
        if (config.theme === "dark") {
            document.body.classList.add("dark");
        }
        else if (config.theme === "light") {
            document.body.classList.add("light");
        }
        var metaDescriptionDark = document.querySelector('meta[name="theme-color"][media*="dark"]');
        var metaDescriptionLight = document.querySelector('meta[name="theme-color"][media*="light"]');
        if (config.theme === "auto") {
            metaDescriptionDark === null || metaDescriptionDark === void 0 ? void 0 : metaDescriptionDark.setAttribute("content", "#151515");
            metaDescriptionLight === null || metaDescriptionLight === void 0 ? void 0 : metaDescriptionLight.setAttribute("content", "#fafafa");
        }
        else {
            var themeColor = utils_1.getCSSVar("--theme-color");
            metaDescriptionDark === null || metaDescriptionDark === void 0 ? void 0 : metaDescriptionDark.setAttribute("content", themeColor);
            metaDescriptionLight === null || metaDescriptionLight === void 0 ? void 0 : metaDescriptionLight.setAttribute("content", themeColor);
        }
        config.reset(); // 从服务器拉取配置
    }, [config.theme]);
}
exports.useSwitchTheme = useSwitchTheme;
function useHtmlLang() {
    react_1.useEffect(function () {
        var lang = locales_1.getISOLang();
        var htmlLang = document.documentElement.lang;
        if (lang !== htmlLang) {
            document.documentElement.lang = lang;
        }
    }, []);
}
var useHasHydrated = function () {
    var _a = react_1.useState(false), hasHydrated = _a[0], setHasHydrated = _a[1];
    react_1.useEffect(function () {
        setHasHydrated(true);
    }, []);
    return hasHydrated;
};
var loadAsyncGoogleFont = function () {
    var _a;
    var linkEl = document.createElement("link");
    var proxyFontUrl = "/google-fonts";
    var remoteFontUrl = "https://fonts.googleapis.com";
    var googleFontUrl = ((_a = client_1.getClientConfig()) === null || _a === void 0 ? void 0 : _a.buildMode) === "export" ? remoteFontUrl : proxyFontUrl;
    linkEl.rel = "stylesheet";
    linkEl.href =
        googleFontUrl +
            "/css2?family=" +
            encodeURIComponent("Noto Sans:wght@300;400;700;900") +
            "&display=swap";
    document.head.appendChild(linkEl);
};
function Screen() {
    var _a;
    var config = config_1.useAppConfig();
    var location = react_router_dom_1.useLocation();
    var isHome = location.pathname === constant_1.Path.Home;
    var isAuth = location.pathname === constant_1.Path.Auth;
    var isMobileScreen = utils_1.useMobileScreen();
    var shouldTightBorder = config.tightBorder && !isMobileScreen && !((_a = client_1.getClientConfig()) === null || _a === void 0 ? void 0 : _a.isApp);
    react_1.useEffect(function () {
        loadAsyncGoogleFont();
    }, []);
    return (React.createElement("div", { className: home_module_scss_1["default"].container +
            (" " + (shouldTightBorder ? home_module_scss_1["default"]["tight-container"] : home_module_scss_1["default"].container) + " " + (locales_1.getLang() === "ar" ? home_module_scss_1["default"]["rtl-screen"] : "")) }, isAuth ? (React.createElement(React.Fragment, null,
        React.createElement(auth_1.AuthPage, null))) : (React.createElement(React.Fragment, null,
        React.createElement(sidebar_1.SideBar, { className: isHome ? home_module_scss_1["default"]["sidebar-show"] : "" }),
        React.createElement("div", { className: home_module_scss_1["default"]["window-content"], id: constant_1.SlotID.AppBody },
            React.createElement(react_router_dom_1.Routes, null,
                React.createElement(react_router_dom_1.Route, { path: constant_1.Path.Home, element: React.createElement(Chat, null) }),
                React.createElement(react_router_dom_1.Route, { path: constant_1.Path.NewChat, element: React.createElement(NewChat, null) }),
                React.createElement(react_router_dom_1.Route, { path: constant_1.Path.Masks, element: React.createElement(MaskPage, null) }),
                React.createElement(react_router_dom_1.Route, { path: constant_1.Path.Chat, element: React.createElement(Chat, null) }),
                React.createElement(react_router_dom_1.Route, { path: constant_1.Path.Settings, element: React.createElement(Settings, null) })))))));
}
function useLoadData() {
    var _this = this;
    var config = config_1.useAppConfig();
    react_1.useEffect(function () {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var models;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api_1.api.llm.models()];
                    case 1:
                        models = _a.sent();
                        config.mergeModels(models);
                        return [2 /*return*/];
                }
            });
        }); })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
exports.useLoadData = useLoadData;
function Home() {
    useSwitchTheme();
    useLoadData();
    useHtmlLang();
    react_1.useEffect(function () {
        console.log("[Config] got config from build time", client_1.getClientConfig());
        store_1.useAccessStore.getState().fetch();
    }, []);
    if (!useHasHydrated()) {
        return React.createElement(Loading, null);
    }
    return (React.createElement(error_1.ErrorBoundary, null,
        React.createElement(react_router_dom_1.HashRouter, null,
            React.createElement(Screen, null))));
}
exports.Home = Home;
