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
exports.SideBar = void 0;
var react_1 = require("react");
var home_module_scss_1 = require("./home.module.scss");
var iframe_module_scss_1 = require("./iframe.module.scss");
var button_1 = require("./button");
var settings_svg_1 = require("../icons/settings.svg");
var github_svg_1 = require("../icons/github.svg");
var chatgpt_svg_1 = require("../icons/chatgpt.svg");
var add_svg_1 = require("../icons/add.svg");
var close_svg_1 = require("../icons/close.svg");
var mask_svg_1 = require("../icons/mask.svg");
var plugin_svg_1 = require("../icons/plugin.svg");
var drag_svg_1 = require("../icons/drag.svg");
var locales_1 = require("../locales");
var store_1 = require("../store");
var constant_1 = require("../constant");
var react_router_dom_1 = require("react-router-dom");
var utils_1 = require("../utils");
var dynamic_1 = require("next/dynamic");
var ui_lib_1 = require("./ui-lib");
var rainbowTextStyle = {
    background: 'linear-gradient(to right, red, orange, blue, indigo, violet)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    display: 'flex'
};
var rainbowTextStyleContent = {
    background: 'linear-gradient(to right, red, orange, green, blue, indigo, violet)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    display: 'flex',
    fontSize: "17px",
    fontFamily: 'Arial, sans-serif',
    animation: 'rainbow 1s ease infinite'
};
var horizontalLineStyle = {
    borderTop: '2px solid black',
    width: '100%',
    display: 'block'
};
var ChatList = dynamic_1["default"](function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./chat-list"); })];
        case 1: return [2 /*return*/, (_a.sent()).ChatList];
    }
}); }); }, {
    loading: function () { return null; }
});
function useHotKey() {
    var chatStore = store_1.useChatStore();
    react_1.useEffect(function () {
        var onKeyDown = function (e) {
            if (e.altKey || e.ctrlKey) {
                if (e.key === "ArrowUp") {
                    chatStore.nextSession(-1);
                }
                else if (e.key === "ArrowDown") {
                    chatStore.nextSession(1);
                }
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return function () { return window.removeEventListener("keydown", onKeyDown); };
    });
}
function useDragSideBar() {
    var _a;
    var limit = function (x) { return Math.min(constant_1.MAX_SIDEBAR_WIDTH, x); };
    var config = store_1.useAppConfig();
    var startX = react_1.useRef(0);
    var startDragWidth = react_1.useRef((_a = config.sidebarWidth) !== null && _a !== void 0 ? _a : constant_1.DEFAULT_SIDEBAR_WIDTH);
    var lastUpdateTime = react_1.useRef(Date.now());
    var toggleSideBar = function () {
        config.update(function (config) {
            if (config.sidebarWidth < constant_1.MIN_SIDEBAR_WIDTH) {
                config.sidebarWidth = constant_1.DEFAULT_SIDEBAR_WIDTH;
            }
            else {
                config.sidebarWidth = constant_1.NARROW_SIDEBAR_WIDTH;
            }
        });
    };
    var onDragStart = function (e) {
        // Remembers the initial width each time the mouse is pressed
        startX.current = e.clientX;
        startDragWidth.current = config.sidebarWidth;
        var dragStartTime = Date.now();
        var handleDragMove = function (e) {
            if (Date.now() < lastUpdateTime.current + 20) {
                return;
            }
            lastUpdateTime.current = Date.now();
            var d = e.clientX - startX.current;
            var nextWidth = limit(startDragWidth.current + d);
            config.update(function (config) {
                if (nextWidth < constant_1.MIN_SIDEBAR_WIDTH) {
                    config.sidebarWidth = constant_1.MIN_SIDEBAR_WIDTH; // 设置为最小宽度
                }
                else {
                    config.sidebarWidth = nextWidth;
                }
            });
        };
        var handleDragEnd = function () {
            // In useRef the data is non-responsive, so `config.sidebarWidth` can't get the dynamic sidebarWidth
            window.removeEventListener("pointermove", handleDragMove);
            window.removeEventListener("pointerup", handleDragEnd);
            // if user click the drag icon, should toggle the sidebar
            var shouldFireClick = Date.now() - dragStartTime < 300;
            if (shouldFireClick) {
                toggleSideBar();
            }
        };
        window.addEventListener("pointermove", handleDragMove);
        window.addEventListener("pointerup", handleDragEnd);
    };
    var isMobileScreen = utils_1.useMobileScreen();
    var shouldNarrow = !isMobileScreen && config.sidebarWidth < constant_1.MIN_SIDEBAR_WIDTH;
    react_1.useEffect(function () {
        var _a;
        var barWidth = shouldNarrow
            ? constant_1.NARROW_SIDEBAR_WIDTH
            : limit((_a = config.sidebarWidth) !== null && _a !== void 0 ? _a : constant_1.DEFAULT_SIDEBAR_WIDTH);
        var sideBarWidth = isMobileScreen ? "100vw" : barWidth + "px";
        document.documentElement.style.setProperty("--sidebar-width", sideBarWidth);
    }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);
    return {
        onDragStart: onDragStart,
        shouldNarrow: shouldNarrow
    };
}
function SideBar(props) {
    var _this = this;
    /**
     * 添加画图按钮
     */
    var _a = react_1.useState(false), showPopup = _a[0], setShowPopup = _a[1];
    var openPopup = function () {
        setShowPopup(true);
    };
    var closePopup = function () {
        setShowPopup(false);
    };
    var handleButtonClick = function () {
        // 在这里添加按钮点击事件的逻辑
        console.log('按钮被点击了');
    };
    ////////////////////////////////////
    var chatStore = store_1.useChatStore();
    // drag side bar
    var _b = useDragSideBar(), onDragStart = _b.onDragStart, shouldNarrow = _b.shouldNarrow;
    var navigate = react_router_dom_1.useNavigate();
    var config = store_1.useAppConfig();
    return (React.createElement("div", { className: home_module_scss_1["default"].sidebar + " " + props.className + " " + (shouldNarrow && home_module_scss_1["default"]["narrow-sidebar"]) },
        React.createElement("div", { className: home_module_scss_1["default"]["sidebar-header"], "data-tauri-drag-region": true },
            React.createElement("div", { className: home_module_scss_1["default"]["sidebar-title"], "data-tauri-drag-region": true },
                React.createElement("span", { style: __assign({}, rainbowTextStyle) }, "CyGPT")),
            React.createElement("div", { style: horizontalLineStyle }),
            React.createElement("div", { className: home_module_scss_1["default"]["sidebar-sub-title"] },
                React.createElement("style", { jsx: true }, "\n          @keyframes rainbow {\n            0% {background-position: 0%;}\n            100% {background-position: 100%;}\n          }\n        "),
                React.createElement("span", { style: __assign({}, rainbowTextStyleContent) },
                    "\u3010\u63A5\u5165\u4E86bing \u7684 gpt-4 \u6A21\u578B\u3002\u53EF\u5728\u804A\u5929\u8F93\u5165\u6846\u4E0A\u65B9\u70B9\u51FB\"\u673A\u5668\u4EBA\"\u6309\u94AE\u66F4\u6362\u6A21\u578B\u3002\u3011",
                    React.createElement("img", { src: "https://raw.gitmirror.com/onlyfabin/PB_1/main/markdown/model-icon.png", alt: "Bing GPT-4 Icon", style: { transform: 'scale(0.8)' } })),
                React.createElement("span", { style: __assign({}, rainbowTextStyleContent) },
                    "bing-\u8054\u7F51\u7248\uFF1A\u7ED3\u5408\u7F51\u9875\u641C\u7D22\u7ED3\u679C\u56DE\u7B54\uFF0C\u53EF\u641C\u7D22\u6700\u65B0\u95EE\u9898\u3002",
                    React.createElement("br", null),
                    "bing-\u4E0D\u8054\u7F51\uFF1A\u56DE\u7B54\u66F4\u7CBE\u786E\uFF0C\u4F46\u53EA\u80FD\u56DE\u7B542021\u5E74\u4E4B\u524D\u7684\u5185\u5BB9\u3002"),
                React.createElement("button", { onClick: openPopup }, "\u56FE\u7247\u521B\u4F5C"),
                showPopup && (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: iframe_module_scss_1["default"]["overlay"], onClick: closePopup }),
                    React.createElement("div", { className: iframe_module_scss_1["default"]["popup"] },
                        React.createElement("iframe", { src: "https://img-test.onlyyoufabian754.workers.dev/", style: { width: '100%', height: '100%', border: 'none' } }),
                        React.createElement("button", { onClick: closePopup }, "\u5173\u95ED"))))),
            React.createElement("div", { className: home_module_scss_1["default"]["sidebar-logo"] + " no-dark" },
                React.createElement(chatgpt_svg_1["default"], null))),
        React.createElement("div", { className: home_module_scss_1["default"]["sidebar-header-bar"] },
            React.createElement(button_1.IconButton, { icon: React.createElement(mask_svg_1["default"], null), text: shouldNarrow ? undefined : locales_1["default"].Mask.Name, className: home_module_scss_1["default"]["sidebar-bar-button"], onClick: function () {
                    if (config.dontShowMaskSplashScreen !== true) {
                        navigate(constant_1.Path.NewChat, { state: { fromHome: true } });
                    }
                    else {
                        navigate(constant_1.Path.Masks, { state: { fromHome: true } });
                    }
                }, shadow: true }),
            React.createElement(button_1.IconButton, { icon: React.createElement(plugin_svg_1["default"], null), text: shouldNarrow ? undefined : locales_1["default"].Plugin.Name, className: home_module_scss_1["default"]["sidebar-bar-button"], onClick: function () { return ui_lib_1.showToast(locales_1["default"].WIP); }, shadow: true })),
        React.createElement("div", { className: home_module_scss_1["default"]["sidebar-body"], onClick: function (e) {
                if (e.target === e.currentTarget) {
                    navigate(constant_1.Path.Home);
                }
            } },
            React.createElement(ChatList, { narrow: shouldNarrow })),
        React.createElement("div", { className: home_module_scss_1["default"]["sidebar-tail"] },
            React.createElement("div", { className: home_module_scss_1["default"]["sidebar-actions"] },
                React.createElement("div", { className: home_module_scss_1["default"]["sidebar-action"] + " " + home_module_scss_1["default"].mobile },
                    React.createElement(button_1.IconButton, { icon: React.createElement(close_svg_1["default"], null), onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, ui_lib_1.showConfirm(locales_1["default"].Home.DeleteChat)];
                                    case 1:
                                        if (_a.sent()) {
                                            chatStore.deleteSession(chatStore.currentSessionIndex);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); } })),
                React.createElement("div", { className: home_module_scss_1["default"]["sidebar-action"] },
                    React.createElement(react_router_dom_1.Link, { to: constant_1.Path.Settings },
                        React.createElement(button_1.IconButton, { icon: React.createElement(settings_svg_1["default"], null), shadow: true }))),
                React.createElement("div", { className: home_module_scss_1["default"]["sidebar-action"] },
                    React.createElement("a", { href: constant_1.REPO_URL, target: "_blank", rel: "noopener noreferrer" },
                        React.createElement(button_1.IconButton, { icon: React.createElement(github_svg_1["default"], null), shadow: true })))),
            React.createElement("div", null,
                React.createElement(button_1.IconButton, { icon: React.createElement(add_svg_1["default"], null), text: shouldNarrow ? undefined : locales_1["default"].Home.NewChat, onClick: function () {
                        if (config.dontShowMaskSplashScreen) {
                            chatStore.newSession();
                            navigate(constant_1.Path.Chat);
                        }
                        else {
                            navigate(constant_1.Path.NewChat);
                        }
                    }, shadow: true }))),
        React.createElement("div", { className: home_module_scss_1["default"]["sidebar-drag"], onPointerDown: function (e) { return onDragStart(e); } },
            React.createElement(drag_svg_1["default"], null))));
}
exports.SideBar = SideBar;
