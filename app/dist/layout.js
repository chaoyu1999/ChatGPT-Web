"use strict";
//React组件，通常用于作为应用程序的根布局
/* eslint-disable @next/next/no-page-custom-font */
// 禁用特定规则的eslint检查
exports.__esModule = true;
exports.metadata = void 0;
// 导入全局样式文件
require("./styles/globals.scss");
// 导入Markdown样式文件
require("./styles/markdown.scss");
// 导入代码高亮样式文件
require("./styles/highlight.scss");
// 导入getClientConfig函数，用于获取客户端配置
var client_1 = require("./config/client");
// 定义元数据对象
exports.metadata = {
    title: "CyGPT",
    description: "CyGPT",
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1
    },
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#fafafa" },
        { media: "(prefers-color-scheme: dark)", color: "#151515" },
    ],
    appleWebApp: {
        title: "CyGPT",
        statusBarStyle: "default"
    }
};
// 默认导出RootLayout组件
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { lang: "en" },
        React.createElement("head", null,
            React.createElement("meta", { name: "config", content: JSON.stringify(client_1.getClientConfig()) }),
            React.createElement("link", { rel: "manifest", href: "/site.webmanifest" }),
            React.createElement("script", { src: "/serviceWorkerRegister.js", defer: true })),
        React.createElement("body", null, children)));
}
exports["default"] = RootLayout;
