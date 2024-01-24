import { NextRequest, NextResponse } from "next/server";

// 定义常量 OPENAI_URL 为 OpenAI API 的基础 URL
export const OPENAI_URL = "api.openai.com";
// 定义默认协议为 https
const DEFAULT_PROTOCOL = "https";
// 从环境变量中获取协议，若不存在则使用默认协议
const PROTOCOL = process.env.PROTOCOL || DEFAULT_PROTOCOL;
// 从环境变量中获取基础 URL，若不存在则使用 OpenAI 的 URL
const BASE_URL = process.env.BASE_URL || OPENAI_URL;
// 从环境变量中获取 DISABLE_GPT4 变量，若存在则将其转换为布尔值
const DISABLE_GPT4 = !!process.env.DISABLE_GPT4;
const GPT4_URL = process.env.GPT4_URL
const BING_URL = process.env.BING_URL
/**
 * 发送请求到 OpenAI API
 * @param req - Next.js 请求对象
 * @returns 返回处理后的响应
 */
export async function requestOpenai(req: NextRequest) {
  // 创建一个中止控制器，用于控制请求超时
  const controller = new AbortController();
  // 从请求头中获取 Authorization，若不存在则为空字符串
  const authValue = req.headers.get("Authorization") ?? "";
  // 获取 OpenAI API 的路径
  const openaiPath = `${req.nextUrl.pathname}${req.nextUrl.search}`.replaceAll(
    "/api/openai/",
    "",
  );

  // 确保 baseUrl 是完整的 URL
  let baseUrl = BASE_URL;
  if (!baseUrl.startsWith("http")) {
    baseUrl = `${PROTOCOL}://${baseUrl}`;
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

  // 设置超时定时器，10分钟后中止请求
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10 * 60 * 1000);

  // 构建完整的请求 URL
  let fetchUrl = `${baseUrl}/${openaiPath}`;
  // 设置请求选项
  let fetchOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      Authorization: authValue,
      // 如果设置了 OPENAI_ORG_ID 环境变量，添加到请求头中
      ...(process.env.OPENAI_ORG_ID && {
        "OpenAI-Organization": process.env.OPENAI_ORG_ID,
      }),
    },
    method: req.method, // 请求方法
    body: req.body, // 请求体
    // 设置重定向策略为手动处理
    redirect: "manual",
    // 设置请求为半双工模式
    // @ts-ignore
    duplex: "half",
    // 设置中止信号
    signal: controller.signal,
  };


  // 如果禁用了 GPT-4 模型，检查请求体中是否包含对 GPT-4 的请求
  if (DISABLE_GPT4 && req.body) {
    try {
      const clonedBody = await req.text();
      fetchOptions.body = clonedBody;

      const jsonBody = JSON.parse(clonedBody);

      // 如果请求体中包含对 GPT-4 模型的请求，返回 403 状态码
      if ((jsonBody?.model ?? "").includes("gpt-4")) {
        return NextResponse.json(
          {
            error: true,
            message: "you are not allowed to use gpt-4 model",
          },
          {
            status: 403,
          },
        );
      }
    } catch (e) {
      console.error("[OpenAI] gpt4 filter", e);
    }
  }

  // 在发送请求之前检查是否使用了 GPT-4 模型, 如果使用了 GPT-4 模型，更改请求头和 URL；如果使用了 GPT-3.5 模型，更改请求体中的模型名称为 GPT-3.5-turbo-1106
  if (req.body) {
    try {
      const clonedBody = await req.text();
      fetchOptions.body = clonedBody;

      const jsonBody = JSON.parse(clonedBody);

      // 检查请求体中是否包含对 GPT-4 模型的请求
      if ((jsonBody?.model ?? "").includes("gpt-4")) {
        // 如果使用了 GPT-4 模型，更改请求头和 URL
        fetchOptions.headers = new Headers(fetchOptions.headers);
        fetchOptions.headers.set("Authorization", "Bearer " + process.env.GPT4_API_KEY);
        fetchUrl = GPT4_URL + "/v1/chat/completions"

        // 默认gpt-4-1106-preview
        jsonBody.model = "gpt-4-1106-preview";
        fetchOptions.body = JSON.stringify(jsonBody);
      }

      // 检查请求体中是否包含对 GPT-3.5 模型的请求
      if ((jsonBody?.model ?? "").includes("gpt-3.5")) {
        // 如果使用了 GPT-3.5 模型，更改模型名称为 GPT-3.5-turbo-1106
        jsonBody.model = "gpt-3.5-turbo-1106";
        // 更新 fetchOptions.body 为修改后的 jsonBody
        fetchOptions.body = JSON.stringify(jsonBody);
      }
      // if ((jsonBody?.model ?? "").includes("gpt")) {
      //   // 替换所有模型为free-gpt4模型      //   // 如果使用了 GPT-4 模型，更改请求头和 URL
      //   fetchOptions.headers = new Headers(fetchOptions.headers);
      //   fetchOptions.headers.set("Authorization", "Bearer " + process.env.GPT4_API_KEY);
      //   fetchUrl = GPT4_URL + "/v1/chat/completions"

      //   // 默认"free-gpt4"
      //   jsonBody.model = "free-gpt4";
      //   fetchOptions.body = JSON.stringify(jsonBody);
      // }

      if ((jsonBody?.model ?? "").includes("bing-联网版")) {
        // 如果使用了 bing 模型，更改请求头和 URL
        jsonBody.model = "Precise-g4t";

        fetchOptions.headers = new Headers(fetchOptions.headers);
        fetchUrl = BING_URL + "/api/v1/chat/completions"
        fetchOptions.body = JSON.stringify(jsonBody);
      }
      jsonBody.model = "Phind Model";
      fetchOptions.headers = new Headers(fetchOptions.headers);
      fetchUrl = BING_URL + "/v1/chat/completions"
      fetchOptions.body = JSON.stringify(jsonBody);
    } catch (e) {
      console.error("[OpenAI] gpt4 check", e);
    }
  }

  try {
    // 发送请求到 OpenAI API
    const res = await fetch(fetchUrl, fetchOptions);

    // 为了防止浏览器弹出认证提示，删除 'www-authenticate' 头
    const newHeaders = new Headers(res.headers);
    newHeaders.delete("www-authenticate");
    // 设置头部，禁用 nginx 缓冲
    newHeaders.set("X-Accel-Buffering", "no");

    // 返回响应
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    });
  } finally {
    // 清除超时定时器
    clearTimeout(timeoutId);
  }
}
