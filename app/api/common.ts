import { NextRequest } from "next/server";

const OPENAI_URL = "api.openai.com";
const DEFAULT_PROTOCOL = "https";
const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
const BASE_URL = process.env.BASE_URL ?? OPENAI_URL;
const authValue = process.env.API_KEYS ?? "";

function getClientInfo(req: NextRequest): {
  ip: string;
  userAgent: string;
  forwardedFor: string;
} {
  const clientInfo = {
    // 获取IP地址，优先使用req.ip，其次使用x-real-ip头部
    ip: req.ip ?? req.headers.get("x-real-ip") ?? "",
    // 获取User-Agent头部
    userAgent: req.headers.get("user-agent") ?? "",
    // 获取X-Forwarded-For头部
    forwardedFor: req.headers.get("x-forwarded-for") ?? "",
  };
  if (!clientInfo.ip &&clientInfo.forwardedFor) {
    // 如果存在X-Forwarded-For头部，则使用第一个IP地址作为客户端IP地址
    clientInfo.ip = clientInfo.forwardedFor.split(",").at(0) ?? "";
  }
  return clientInfo;
}

export async function requestOpenai(req: NextRequest, keyIndex: number) {
  let req_copy = req.clone();
  const makeBearer = (token: string) => `Bearer ${token.trim()}`;
  let keysArray = authValue.split(',');
  let randomKey = makeBearer(keysArray[keyIndex]);
  
  let ClientInfo = getClientInfo(req);
  console.log("[ClientInfo ]", ClientInfo);
  if(req.method == 'POST'){
    const jsonData = await req_copy.json()
    console.log("[messages ] ", jsonData['messages']);

    const openaiPath = `${req.nextUrl.pathname}${req.nextUrl.search}`.replaceAll(
      "/api/openai/",
      "",
    );

    let baseUrl = BASE_URL;

    if (!baseUrl.startsWith("http")) {
      baseUrl = `${PROTOCOL}://${baseUrl}`;
    }

    console.log("[Proxy] ", openaiPath);
    console.log("[Base Url]", baseUrl);

    if (process.env.OPENAI_ORG_ID) {
      console.log("[Org ID]", process.env.OPENAI_ORG_ID);
    }

    if (!randomKey || !randomKey.startsWith("Bearer ")) {
      console.error("[OpenAI Request] invalid api key provided", authValue);
    }

    return fetch(`${baseUrl}/${openaiPath}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: randomKey,
        ...(process.env.OPENAI_ORG_ID && {
          "OpenAI-Organization": process.env.OPENAI_ORG_ID,
        }),
        'Client-Info': JSON.stringify(ClientInfo)
      },
      cache: "no-store",
      method: req.method,
      body: JSON.stringify(jsonData),
    });
  }else{
    const openaiPath = `${req.nextUrl.pathname}${req.nextUrl.search}`.replaceAll(
      "/api/openai/",
      "",
    );

    let baseUrl = BASE_URL;

    if (!baseUrl.startsWith("http")) {
      baseUrl = `${PROTOCOL}://${baseUrl}`;
    }

    console.log("[Proxy] ", openaiPath);
    console.log("[Base Url]", baseUrl);

    if (process.env.OPENAI_ORG_ID) {
      console.log("[Org ID]", process.env.OPENAI_ORG_ID);
    }

    if (!randomKey || !randomKey.startsWith("Bearer ")) {
      console.error("[OpenAI Request] invalid api key provided", authValue);
    }

    
    return fetch(`${baseUrl}/${openaiPath}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: randomKey,
        ...(process.env.OPENAI_ORG_ID && {
          "OpenAI-Organization": process.env.OPENAI_ORG_ID,
        }),
        'Client-Info': JSON.stringify(ClientInfo)
      },
      cache: "no-store",
      method: req.method,
    });
    
  }
}
