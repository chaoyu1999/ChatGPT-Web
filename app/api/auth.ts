import { NextRequest } from "next/server";
import { getServerSideConfig } from "../config/server";
import md5 from "spark-md5";
import { ACCESS_CODE_PREFIX, AUTH_ID, DB_ID, AUTH_KEY, AUTH_EMAIL } from "../constant";


async function insertMessage(ip: string, UA: string, time: string, message: string): Promise<void> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${AUTH_ID}/d1/database/${DB_ID}/query`;

  const headers = {
    'Authorization': `Bearer ${AUTH_ID}`,
    'X-Auth-Key': AUTH_KEY,
    'X-Auth-Email': AUTH_EMAIL,
    'Content-Type': 'application/json',
  };

  const data = {
    'params': [ip, UA, time, message],
    'sql': 'INSERT INTO chat_messages (ip, UA, time, message) VALUES (?, ?, ?, ?);',
  };

  const fetchOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, fetchOptions);
    if (response.ok) {
      console.log('Message inserted successfully');
    } else {
      console.error('Error inserting message:', response.statusText);
    }
  } catch (error) {
    console.error('Error inserting message:', error);
  }
}





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

export function auth(req: NextRequest) {
  const authToken = req.headers.get("Authorization") ?? "";

  // check if it is openai api key or user token
  const { accessCode, apiKey: token } = parseApiKey(authToken);

  const hashedCode = md5.hash(accessCode ?? "").trim();

  const serverConfig = getServerSideConfig();
  console.log("[Auth] allowed hashed codes: ", [...serverConfig.codes]);
  console.log("[Auth] got access code:", accessCode);
  console.log("[Auth] hashed access code:", hashedCode);
  console.log("[User IP] ", getIP(req));
  console.log("[Time] ", new Date().toLocaleString());

  if (serverConfig.needCode && !serverConfig.codes.has(hashedCode) && !token) {
    return {
      error: true,
      msg: !accessCode ? "empty access code" : "wrong access code",
    };
  }

  // if user does not provide an api key, inject system api key
  if (!token) {
    const apiKey = serverConfig.apiKey;
    if (apiKey) {
      console.log("[Auth] use system api key");
      req.headers.set("Authorization", `Bearer ${apiKey}`);
    } else {
      console.log("[Auth] admin did not provide an api key");
    }
  } else {
    console.log("[Auth] use user api key");
  }

  return {
    error: false,
  };
}
