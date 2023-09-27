//React组件，通常用于作为应用程序的根布局
/* eslint-disable @next/next/no-page-custom-font */
// 禁用特定规则的eslint检查

// 导入全局样式文件
import "./styles/globals.scss";

// 导入Markdown样式文件
import "./styles/markdown.scss";

// 导入代码高亮样式文件
import "./styles/highlight.scss";

// 导入getClientConfig函数，用于获取客户端配置
import { getClientConfig } from "./config/client";

// 导入Metadata类型，可能是用于设置页面元数据的类型
import { type Metadata } from "next";

// 定义元数据对象
export const metadata: Metadata = {
  title: "Cy' GPT", // 页面标题
  description: "Cy' GPT", // 页面描述
  viewport: {
    width: "device-width", // 视口宽度
    initialScale: 1, // 初始缩放比例
    maximumScale: 1, // 最大缩放比例
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" }, // 浅色主题颜色
    { media: "(prefers-color-scheme: dark)", color: "#151515" }, // 深色主题颜色
  ],
  appleWebApp: {
    title: "Cy' GPT", // Apple Web App的标题
    statusBarStyle: "default", // 状态栏样式
  },
};

// 默认导出RootLayout组件
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="config" content={JSON.stringify(getClientConfig())} />
        <link rel="manifest" href="/site.webmanifest"></link>
        <script src="/serviceWorkerRegister.js" defer></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
