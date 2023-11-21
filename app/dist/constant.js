"use strict";
exports.__esModule = true;
exports.MAX_RENDER_MSG_COUNT = exports.CHAT_PAGE_SIZE = exports.DEFAULT_MODELS = exports.SUMMARIZE_MODEL = exports.DEFAULT_SYSTEM_TEMPLATE = exports.DEFAULT_INPUT_TEMPLATE = exports.OpenaiPath = exports.EXPORT_MESSAGE_CLASS_NAME = exports.REQUEST_TIMEOUT_MS = exports.STORAGE_KEY = exports.UNFINISHED_INPUT = exports.LAST_INPUT_KEY = exports.ACCESS_CODE_PREFIX = exports.NARROW_SIDEBAR_WIDTH = exports.MIN_SIDEBAR_WIDTH = exports.MAX_SIDEBAR_WIDTH = exports.DEFAULT_SIDEBAR_WIDTH = exports.StoreKey = exports.FileName = exports.SlotID = exports.ApiPath = exports.Path = exports.DEFAULT_API_HOST = exports.DEFAULT_CORS_HOST = exports.RUNTIME_CONFIG_DOM = exports.FETCH_TAG_URL = exports.FETCH_COMMIT_URL = exports.RELEASE_URL = exports.UPDATE_URL = exports.ISSUE_URL = exports.REPO_URL = exports.REPO = exports.OWNER = exports.DB_ID = exports.AUTH_EMAIL = exports.AUTH_KEY = exports.AUTH_ID = void 0;
// 配置和定义应用程序的各种设置和路径等信息
// 配置CF数据相关的常量
exports.AUTH_ID = process.env.AUTH_ID;
exports.AUTH_KEY = process.env.AUTH_KEY;
exports.AUTH_EMAIL = process.env.AUTH_EMAIL;
exports.DB_ID = process.env.DB_ID;
// GitHub仓库的所有者和仓库名称
exports.OWNER = "Yidadaa";
exports.REPO = "ChatGPT-Next-Web";
// GitHub仓库和问题页面的URL
exports.REPO_URL = "https://github.com/" + exports.OWNER + "/" + exports.REPO;
exports.ISSUE_URL = "https://github.com/" + exports.OWNER + "/" + exports.REPO + "/issues";
// 更新和发布页面的URL
exports.UPDATE_URL = exports.REPO_URL + "#keep-updated";
exports.RELEASE_URL = exports.REPO_URL + "/releases";
// 获取GitHub仓库最新提交和标签的API URL
exports.FETCH_COMMIT_URL = "https://api.github.com/repos/" + exports.OWNER + "/" + exports.REPO + "/commits?per_page=1";
exports.FETCH_TAG_URL = "https://api.github.com/repos/" + exports.OWNER + "/" + exports.REPO + "/tags?per_page=1";
// 在DOM中标记危险运行时配置的标识
exports.RUNTIME_CONFIG_DOM = "danger-runtime-config";
// 默认的跨域请求主机和API主机
exports.DEFAULT_CORS_HOST = "https://nb.nextweb.fun";
exports.DEFAULT_API_HOST = exports.DEFAULT_CORS_HOST + "/api/proxy";
// 路径枚举
var Path;
(function (Path) {
    Path["Home"] = "/";
    Path["Chat"] = "/chat";
    Path["Settings"] = "/settings";
    Path["NewChat"] = "/new-chat";
    Path["Masks"] = "/masks";
    Path["Auth"] = "/auth";
})(Path = exports.Path || (exports.Path = {}));
// API路径枚举
var ApiPath;
(function (ApiPath) {
    ApiPath["Cors"] = "/api/cors";
})(ApiPath = exports.ApiPath || (exports.ApiPath = {}));
// DOM元素槽位枚举
var SlotID;
(function (SlotID) {
    SlotID["AppBody"] = "app-body";
})(SlotID = exports.SlotID || (exports.SlotID = {}));
// 文件名枚举
var FileName;
(function (FileName) {
    FileName["Masks"] = "masks.json";
    FileName["Prompts"] = "prompts.json";
})(FileName = exports.FileName || (exports.FileName = {}));
// 存储键枚举
var StoreKey;
(function (StoreKey) {
    StoreKey["Chat"] = "chat-next-web-store";
    StoreKey["Access"] = "access-control";
    StoreKey["Config"] = "app-config";
    StoreKey["Mask"] = "mask-store";
    StoreKey["Prompt"] = "prompt-store";
    StoreKey["Update"] = "chat-update";
    StoreKey["Sync"] = "sync";
})(StoreKey = exports.StoreKey || (exports.StoreKey = {}));
// 侧边栏宽度常量
exports.DEFAULT_SIDEBAR_WIDTH = 300;
exports.MAX_SIDEBAR_WIDTH = 500;
exports.MIN_SIDEBAR_WIDTH = 230;
exports.NARROW_SIDEBAR_WIDTH = 100;
// 访问控制码前缀
exports.ACCESS_CODE_PREFIX = "nk-";
// 存储键常量
exports.LAST_INPUT_KEY = "last-input";
exports.UNFINISHED_INPUT = function (id) { return "unfinished-input-" + id; };
// 本地存储键常量
exports.STORAGE_KEY = "chatgpt-next-web";
// 请求超时时间
exports.REQUEST_TIMEOUT_MS = 30000;
// 导出消息的类名
exports.EXPORT_MESSAGE_CLASS_NAME = "export-markdown";
// OpenAI路径常量
exports.OpenaiPath = {
    ChatPath: "v1/chat/completions",
    UsagePath: "dashboard/billing/usage",
    SubsPath: "dashboard/billing/subscription",
    ListModelPath: "v1/models"
};
// 默认输入和系统消息模板
exports.DEFAULT_INPUT_TEMPLATE = "{{input}}"; // input / time / model / lang
exports.DEFAULT_SYSTEM_TEMPLATE = "\nYou are ChatGPT, a large language model trained by OpenAI.\nKnowledge cutoff: 2021-09\nCurrent model: {{model}}\nCurrent time: {{time}}";
// 摘要模型名称
exports.SUMMARIZE_MODEL = "gpt-3.5-turbo-1106";
// 默认模型配置
exports.DEFAULT_MODELS = [
    {
        name: "gpt-4",
        available: true
    },
    {
        name: "gpt-4-1106-preview",
        available: true
    },
    {
        name: "gpt-3.5-turbo",
        available: true
    },
    {
        name: "gpt-3.5-turbo-1106",
        available: true
    },
    {
        name: "gpt-3.5-turbo-16k",
        available: true
    },
];
// 聊天页面的分页大小
exports.CHAT_PAGE_SIZE = 15;
// 最大渲染消息数量
exports.MAX_RENDER_MSG_COUNT = 45;
