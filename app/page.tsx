// 应用程序的入口点

// 导入来自"@vercel/analytics/react"的Analytics组件
import { Analytics } from "@vercel/analytics/react";

// 导入Home组件，可能是应用程序的主页组件
import { Home } from "./components/home";

// 导入getServerSideConfig函数，用于获取服务器端配置
import { getServerSideConfig } from "./config/server";

// 获取服务器端配置
const serverConfig = getServerSideConfig();

// 默认导出的异步函数组件，表示应用程序的主要部分
export default async function App() {
  // 渲染Home组件，显示应用程序的主页内容
  return (
    <>
      <Home />
      {serverConfig?.isVercel && <Analytics />}
    </>
  );
}
