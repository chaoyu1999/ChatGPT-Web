// 导入一些常量，如 API 的主机地址，可用的模型列表，请求的超时时间等
import {
  DEFAULT_API_HOST,
  DEFAULT_MODELS,
  OpenaiPath,
  REQUEST_TIMEOUT_MS,
} from "@/app/constant";
// 导入一些应用程序的状态管理器，用于获取和设置配置，聊天记录等
import { useAccessStore, useAppConfig, useChatStore } from "@/app/store";

// 导入一些类型定义，如聊天选项，请求头，API 接口，语言模型，用量等
import { ChatOptions, getHeaders, LLMApi, LLMModel, LLMUsage } from "../api";
// 导入一些本地化的文本，用于支持多种语言
import Locale from "../../locales";
// 导入一个封装了 fetch API 的库，用于发送和接收事件流数据
import {
  EventStreamContentType,
  fetchEventSource,
} from "@fortaine/fetch-event-source";
// 导入一个工具函数，用于格式化对象为可读的字符串
import { prettyObject } from "@/app/utils/format";
// 导入一个函数，用于获取客户端的配置
import { getClientConfig } from "@/app/config/client";

// 定义一个接口，用于描述 OpenAI 的语言模型的响应数据
export interface OpenAIListModelResponse {
  object: string; // 对象类型，一般为 "list"
  data: Array<{ // 一个数组，包含了可用的模型的信息
    id: string; // 模型的 ID，如 "davinci"
    object: string; // 对象类型，一般为 "engine"
    root: string; // 模型的根路径，如 "https://api.openai.com/v1/engines/davinci"
  }>;
}

export class ChatGPTApi implements LLMApi {
  private disableListModels = true;

  path(path: string): string {
    let openaiUrl = useAccessStore.getState().openaiUrl;
    const apiPath = "/api/openai";

    if (openaiUrl.length === 0) {
      const isApp = !!getClientConfig()?.isApp;
      openaiUrl = isApp ? DEFAULT_API_HOST : apiPath;
    }
    if (openaiUrl.endsWith("/")) {
      openaiUrl = openaiUrl.slice(0, openaiUrl.length - 1);
    }
    if (!openaiUrl.startsWith("http") && !openaiUrl.startsWith(apiPath)) {
      openaiUrl = "https://" + openaiUrl;
    }
    return [openaiUrl, path].join("/");
  }

  extractMessage(res: any) {
    return res.choices?.at(0)?.message?.content ?? "";
  }

  async chat(options: ChatOptions) {
    const messages = options.messages.map((v) => ({
      role: v.role,
      content: v.content,
    }));

    const modelConfig = {
      ...useAppConfig.getState().modelConfig,
      ...useChatStore.getState().currentSession().mask.modelConfig,
      ...{
        model: options.config.model,
      },
    };

    let requestPayload = {
      messages,
      stream: options.config.stream,
      model: modelConfig.model,
      temperature: modelConfig.temperature,
      presence_penalty: modelConfig.presence_penalty,
      frequency_penalty: modelConfig.frequency_penalty,
      top_p: modelConfig.top_p,
    };
    let requestPayloadBing = {
      messages,
      stream: options.config.stream,
      model: "Balanced-g4t",
      temperature: modelConfig.temperature,
      presence_penalty: modelConfig.presence_penalty,
      frequency_penalty: modelConfig.frequency_penalty,
      top_p: modelConfig.top_p,
    };
    console.log("[Request] openai payload: ", requestPayload);

    const shouldStream = !!options.config.stream;
    const controller = new AbortController();
    options.onController?.(controller);
    let chatPayload = {
      method: "POST",
      body: JSON.stringify(requestPayload),
      signal: controller.signal,
      headers: getHeaders(),
    };
    let h: Record<string, string> = {
      "Content-Type": "application/json",
      "x-requested-with": "XMLHttpRequest",
    };
    let chatPayloadBing = {
      method: "POST",
      body: JSON.stringify(requestPayloadBing),
      signal: controller.signal,
      headers: h
    };
    let chatPath = this.path(OpenaiPath.ChatPath);
    try {
      console.log("[chatPath]", chatPath)

      // make a fetch request
      const requestTimeoutId = setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS,
      );

      if (shouldStream) {
        let responseText = "";
        let finished = false;

        const finish = () => {
          if (!finished) {
            options.onFinish(responseText);
            finished = true;
          }
        };

        controller.signal.onabort = finish;


        fetchEventSource(chatPath, {
          ...chatPayload,
          async onopen(res) {
            clearTimeout(requestTimeoutId);
            const contentType = res.headers.get("content-type");
            console.log(
              "[OpenAI] request response content type: ",
              contentType,
            );

            if (contentType?.startsWith("text/plain")) {
              responseText = await res.clone().text();
              return finish();
            }

            if (
              !res.ok ||
              !res.headers
                .get("content-type")
                ?.startsWith(EventStreamContentType) ||
              res.status !== 200
            ) {
              const responseTexts = [responseText];
              let extraInfo = await res.clone().text();
              try {
                const resJson = await res.clone().json();
                extraInfo = prettyObject(resJson);
              } catch { }

              if (res.status === 401) {
                responseTexts.push(Locale.Error.Unauthorized);
              }

              if (extraInfo) {
                responseTexts.push(extraInfo);
              }

              responseText = responseTexts.join("\n\n");

              return finish();
            }
          },
          onmessage(msg) {
            if (msg.data === "[DONE]" || finished) {
              return finish();
            }
            const text = msg.data;
            try {
              const json = JSON.parse(text);
              const delta = json.choices[0].delta.content;
              if (delta) {
                responseText += delta;
                options.onUpdate?.(responseText, delta);
              }
            } catch (e) {
              console.error("[Request] parse error", text, msg);
            }
          },
          onclose() {
            finish();
          },
          onerror(e) {
            options.onError?.(e);
            throw e;
          },
          openWhenHidden: true,
        });
      } else {
        const res = await fetch(chatPath, chatPayload);
        clearTimeout(requestTimeoutId);

        const resJson = await res.json();
        const message = this.extractMessage(resJson);
        options.onFinish(message);
      }
    } catch (e) {
      console.log("[Request] failed to make a chat request", e);
      options.onError?.(e as Error);
    }
  }
  async usage() {
    const formatDate = (d: Date) =>
      `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
        .getDate()
        .toString()
        .padStart(2, "0")}`;
    const ONE_DAY = 1 * 24 * 60 * 60 * 1000;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startDate = formatDate(startOfMonth);
    const endDate = formatDate(new Date(Date.now() + ONE_DAY));

    const [used, subs] = await Promise.all([
      fetch(
        this.path(
          `${OpenaiPath.UsagePath}?start_date=${startDate}&end_date=${endDate}`,
        ),
        {
          method: "GET",
          headers: getHeaders(),
        },
      ),
      fetch(this.path(OpenaiPath.SubsPath), {
        method: "GET",
        headers: getHeaders(),
      }),
    ]);

    if (used.status === 401) {
      throw new Error(Locale.Error.Unauthorized);
    }

    if (!used.ok || !subs.ok) {
      throw new Error("Failed to query usage from openai");
    }

    const response = (await used.json()) as {
      total_usage?: number;
      error?: {
        type: string;
        message: string;
      };
    };

    const total = (await subs.json()) as {
      hard_limit_usd?: number;
    };

    if (response.error && response.error.type) {
      throw Error(response.error.message);
    }

    if (response.total_usage) {
      response.total_usage = Math.round(response.total_usage) / 100;
    }

    if (total.hard_limit_usd) {
      total.hard_limit_usd = Math.round(total.hard_limit_usd * 100) / 100;
    }

    return {
      used: response.total_usage,
      total: total.hard_limit_usd,
    } as LLMUsage;
  }

  async models(): Promise<LLMModel[]> {
    if (this.disableListModels) {
      return DEFAULT_MODELS.slice();
    }

    const res = await fetch(this.path(OpenaiPath.ListModelPath), {
      method: "GET",
      headers: {
        ...getHeaders(),
      },
    });

    const resJson = (await res.json()) as OpenAIListModelResponse;
    const chatModels = resJson.data?.filter((m) => m.id.startsWith("gpt-"));
    console.log("[Models]", chatModels);

    if (!chatModels) {
      return [];
    }

    return chatModels.map((m) => ({
      name: m.id,
      available: true,
    }));
  }
}
export { OpenaiPath };
