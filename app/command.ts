//使用React和React Router的自定义hook，用于处理命令和聊天命令

// 导入React中的useEffect钩子
import { useEffect } from "react";

// 导入React Router中的useSearchParams钩子
import { useSearchParams } from "react-router-dom";

// 导入locales文件，可能是一个包含本地化文本的模块
import Locale from "./locales";

// 定义一个类型，表示命令函数，它接受一个字符串参数
type Command = (param: string) => void;

// 定义一个接口，表示一组命令函数
interface Commands {
  fill?: Command; // 填充命令
  submit?: Command; // 提交命令
  mask?: Command; // 遮罩命令
  code?: Command; // 代码命令
  settings?: Command; // 设置命令
}

// 自定义hook，用于处理命令
export function useCommand(commands: Commands = {}) {
  // 使用React Router提供的useSearchParams钩子来获取查询参数
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let shouldUpdate = false;
    // 遍历查询参数
    searchParams.forEach((param, name) => {
      const commandName = name as keyof Commands;
      // 如果命令存在于commands对象中
      if (typeof commands[commandName] === "function") {
        // 调用相应的命令函数并传入参数
        commands[commandName]!(param);
        // 删除已处理的查询参数
        searchParams.delete(name);
        shouldUpdate = true;
      }
    });

    // 如果有更新，更新查询参数
    if (shouldUpdate) {
      setSearchParams(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, commands]);
}

// 定义另一个接口，表示聊天命令函数
interface ChatCommands {
  new?: Command; // 新命令
  newm?: Command; // 新消息命令
  next?: Command; // 下一个命令
  prev?: Command; // 上一个命令
  clear?: Command; // 清除命令
  del?: Command; // 删除命令
}

// 定义聊天命令的前缀
export const ChatCommandPrefix = ":";

// 自定义hook，用于处理聊天命令
export function useChatCommand(commands: ChatCommands = {}) {
  // 提取命令前缀后的部分
  function extract(userInput: string) {
    return (
      userInput.startsWith(ChatCommandPrefix) ? userInput.slice(1) : userInput
    ) as keyof ChatCommands;
  }

  // 根据用户输入的命令搜索匹配的命令
  function search(userInput: string) {
    const input = extract(userInput);
    const desc = Locale.Chat.Commands; // 可能是包含命令描述的本地化文本
    return Object.keys(commands)
      .filter((c) => c.startsWith(input))
      .map((c) => ({
        title: desc[c as keyof ChatCommands],
        content: ChatCommandPrefix + c,
      }));
  }

  // 匹配用户输入的命令并返回是否匹配以及对应的命令函数
  function match(userInput: string) {
    const command = extract(userInput);
    const matched = typeof commands[command] === "function";

    return {
      matched,
      invoke: () => matched && commands[command]!(userInput),
    };
  }

  // 返回匹配和搜索函数
  return { match, search };
}
