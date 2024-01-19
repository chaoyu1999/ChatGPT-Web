// 配置和定义应用程序的各种设置和路径等信息
// 配置CF数据相关的常量
export const AUTH_ID = process.env.AUTH_ID;
export const AUTH_KEY = process.env.AUTH_KEY;
export const AUTH_EMAIL = process.env.AUTH_EMAIL;
export const DB_ID = process.env.DB_ID;

// GitHub仓库的所有者和仓库名称
export const OWNER = "Yidadaa";
export const REPO = "ChatGPT-Next-Web";

// GitHub仓库和问题页面的URL
export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
export const ISSUE_URL = `https://github.com/${OWNER}/${REPO}/issues`;

// 更新和发布页面的URL
export const UPDATE_URL = `${REPO_URL}#keep-updated`;
export const RELEASE_URL = `${REPO_URL}/releases`;

// 获取GitHub仓库最新提交和标签的API URL
export const FETCH_COMMIT_URL = `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`;
export const FETCH_TAG_URL = `https://api.github.com/repos/${OWNER}/${REPO}/tags?per_page=1`;

// 在DOM中标记危险运行时配置的标识
export const RUNTIME_CONFIG_DOM = "danger-runtime-config";

// 默认的跨域请求主机和API主机
export const DEFAULT_CORS_HOST = "https://nb.nextweb.fun";
export const DEFAULT_API_HOST = `${DEFAULT_CORS_HOST}/api/proxy`;

// 路径枚举
export enum Path {
  Home = "/", // 主页路径
  Chat = "/chat", // 聊天路径
  Settings = "/settings", // 设置路径
  NewChat = "/new-chat", // 新聊天路径
  Masks = "/masks", // 遮罩路径
  Auth = "/auth", // 认证路径
}

// API路径枚举
export enum ApiPath {
  Cors = "/api/cors", // 跨域API路径
}

// DOM元素槽位枚举
export enum SlotID {
  AppBody = "app-body", // 应用主体槽位
}

// 文件名枚举
export enum FileName {
  Masks = "masks.json", // 遮罩文件名
  Prompts = "prompts.json", // 提示文件名
}

// 存储键枚举
export enum StoreKey {
  Chat = "chat-next-web-store", // 聊天存储键
  Access = "access-control", // 访问控制存储键
  Config = "app-config", // 应用配置存储键
  Mask = "mask-store", // 遮罩存储键
  Prompt = "prompt-store", // 提示存储键
  Update = "chat-update", // 聊天更新存储键
  Sync = "sync", // 同步存储键
}

// 侧边栏宽度常量
export const DEFAULT_SIDEBAR_WIDTH = 300;
export const MAX_SIDEBAR_WIDTH = 500;
export const MIN_SIDEBAR_WIDTH = 200;
export const NARROW_SIDEBAR_WIDTH = 100;

// 访问控制码前缀
export const ACCESS_CODE_PREFIX = "nk-";

// 存储键常量
export const LAST_INPUT_KEY = "last-input";
export const UNFINISHED_INPUT = (id: string) => "unfinished-input-" + id;

// 本地存储键常量
export const STORAGE_KEY = "chatgpt-next-web";

// 请求超时时间
export const REQUEST_TIMEOUT_MS = 100000;

// 导出消息的类名
export const EXPORT_MESSAGE_CLASS_NAME = "export-markdown";

// OpenAI路径常量
export const OpenaiPath = {
  ChatPath: "v1/chat/completions",
  UsagePath: "dashboard/billing/usage",
  SubsPath: "dashboard/billing/subscription",
  ListModelPath: "v1/models",
};

// 默认输入和系统消息模板
export const DEFAULT_INPUT_TEMPLATE = `{{input}}`; // input / time / model / lang
export const DEFAULT_SYSTEM_TEMPLATE = `
You are ChatGPT, a large language model trained by OpenAI.Please answer me with Chinese.
Current model: {{model}}
Current time: {{time}}
Latex inline: $x^2$ Latex block: $$e=mc^2$$
Code inline: \`print("Hello, world!")\` 
Code block: 
\`\`\`python 
print("Hello, world!")
\`\`\`
`;

// 摘要模型名称
export const SUMMARIZE_MODEL = "gpt-3.5-turbo-1106";

// 默认模型配置
export const DEFAULT_MODELS = [
  {
    name: "gpt-4-1106-preview",
    available: true,
  },
  {
    name: "gpt-3.5-turbo",
    available: true,
  },  
  {
    name: "gpt-3.5-turbo-1106",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k",
    available: true,
  },
  {
    name: "bing-联网版",
    available: true,
  },
  {
    name: "bing-不联网",
    available: true,
  },
] as const;

// 聊天页面的分页大小
export const CHAT_PAGE_SIZE = 15;

// 最大渲染消息数量
export const MAX_RENDER_MSG_COUNT = 45;
