import { NextRequest } from "next/server";
import { getServerSideConfig } from "../config/server";
import md5 from "spark-md5";
import { ACCESS_CODE_PREFIX } from "../constant";

const serverConfig = getServerSideConfig();
 
function getIP(req: NextRequest) {
  let ip = req.ip ?? req.headers.get("x-real-ip");
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? "";
  }

  return ip;
}

function parseApiKey(bearToken: string) {
  const token = bearToken.trim().replaceAll("Bearer ", "").trim();
  const isOpenAiKey = !token.startsWith(ACCESS_CODE_PREFIX);

  return {
    accessCode: isOpenAiKey ? "" : token.slice(ACCESS_CODE_PREFIX.length),
    apiKey: isOpenAiKey ? token : "",
  };
}

export async function auth(req: NextRequest) {
  const authToken = req.headers.get("Authorization") ?? "";
  // let req_copy = req.clone();
  // check if it is openai api key or user token
  const { accessCode, apiKey: token } = parseApiKey(authToken);



  const hashedCode = md5.hash(accessCode ?? "").trim();
  console.log("[Auth] allowed hashed codes: ", [...serverConfig.codes]);
  console.log("[Auth] got access code:", accessCode);
  console.log("[Auth] hashed access code:", hashedCode);
  console.log("[User IP] ", getIP(req));
  console.log("[Time] ", new Date().toLocaleString());

  const jsonData = await req.json()
  console.log("[model]:", jsonData['model']);
  
  if (jsonData['model'].includes('gpt-4')) {
    console.log('使用GPT-4模型。');
    if (hashedCode != "1b73003a103440820de1757efcf54af4") {
      console.log('GPT-4专属访问权不匹配!');
      return {
        error: true,
        needAccessCode: true,
        msg: "Please go settings page and fill your access code.",
      };
    }
  }else{
    if (!serverConfig.codes.has(hashedCode)) {
      console.log("[Codes!=] ", "Code not match");
      return {
        error: true,
        needAccessCode: true,
        msg: "Please go settings page and fill your access code.",
      };
    }
  }

  // if user does not provide an api key, inject system api key
  // const apiKey = serverConfig.apiKey;
  // if (apiKey) {
  //   console.log("[Auth] use system api key");
  //   req.headers.set("Authorization", `Bearer ${apiKey}`);
  // } else {
  //   console.log("[Auth] admin did not provide an api key");
  //   return {
  //     error: true,
  //     msg: "Empty Api Key",
  //   };
  // }


  return {
    error: false,
  };
}
