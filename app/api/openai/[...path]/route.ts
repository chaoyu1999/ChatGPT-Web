import { type OpenAIListModelResponse } from "@/app/client/platforms/openai";
import { getServerSideConfig } from "@/app/config/server";
import { OpenaiPath } from "@/app/constant";
import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth";
import { requestOpenai } from "../../common";

// 允许的路径集合
const ALLOWD_PATH = new Set(Object.values(OpenaiPath));

// 从远程模型响应中获取模型列表
function getModels(remoteModelRes: OpenAIListModelResponse) {
  const config = getServerSideConfig();

  // 如果禁用了 GPT-4 模型，过滤掉 GPT-4 相关模型
  if (config.disableGPT4) {
    remoteModelRes.data = remoteModelRes.data.filter(
      (m) => !m.id.startsWith("gpt-4"),
    );
  }

  return remoteModelRes;
}

// 处理请求
async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[OpenAI Route] params ", params);

  // 处理 OPTIONS 请求
  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const subpath = params.path.join("/");

  // 检查请求路径是否在允许的路径集合中
  if (!ALLOWD_PATH.has(subpath)) {
    console.log("[OpenAI Route] forbidden path ", subpath);
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + subpath,
      },
      {
        status: 403,
      },
    );
  }

  // 验证用户身份
  const authResult = auth(req);
  if ((await authResult).error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  try {
    const response = await requestOpenai(req);  // 发送请求到 OpenAI API

    // 如果请求的是模型列表，并且响应状态码为 200，则处理模型列表
    if (subpath === OpenaiPath.ListModelPath && response.status === 200) {
      const resJson = (await response.json()) as OpenAIListModelResponse;
      const availableModels = getModels(resJson);
      return NextResponse.json(availableModels, {
        status: response.status,
      });
    }
    // const resJson = await response.json()
    // console.log("[OpenAI] resJson", resJson);
    return response;
  } catch (e) {
    console.error("[OpenAI] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

// 导出 GET 和 POST 方法的处理函数
export const GET = handle;
export const POST = handle;

// 运行时环境为 edge
export const runtime = "edge";
