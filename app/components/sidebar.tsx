import { useEffect, useRef, useCallback, useState } from "react";

import styles from "./home.module.scss";
import iStyle from "./iframe.module.scss";

import { IconButton } from "./button";
import SettingsIcon from "../icons/settings.svg";
import GithubIcon from "../icons/github.svg";
import ChatGptIcon from "../icons/chatgpt.svg";
import AddIcon from "../icons/add.svg";
import CloseIcon from "../icons/close.svg";
import MaskIcon from "../icons/mask.svg";
import PluginIcon from "../icons/plugin.svg";
import DragIcon from "../icons/drag.svg";

import Locale from "../locales";

import { useAppConfig, useChatStore } from "../store";

import {
  DEFAULT_SIDEBAR_WIDTH,
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  NARROW_SIDEBAR_WIDTH,
  Path,
  REPO_URL,
} from "../constant";

import { Link, useNavigate } from "react-router-dom";
import { useMobileScreen } from "../utils";
import dynamic from "next/dynamic";
import { showConfirm, showToast } from "./ui-lib";


const rainbowTextStyleContent = {
  background: 'linear-gradient(to right, red, orange, green, blue, indigo, violet)',
  backgroundSize: '200% auto',

  WebkitBackgroundClip: 'text',
  color: 'transparent',
  display: 'flex',
  fontSize: "20px",
  fontFamily: 'Arial, sans-serif',
  animation: 'rainbow 3s ease infinite',
};
const ImgGenerate = {
  background: 'linear-gradient(to right, red, orange, green, blue, indigo, violet)',
  backgroundSize: '200% auto', // 添加这一行

  WebkitBackgroundClip: 'text',
  color: 'transparent',
  display: 'flex',
  fontSize: "20px",
  fontFamily: 'Arial, sans-serif',
  animation: 'rainbow 3s ease infinite',
  alignItems: 'center', // 居中
  fontWeight: 'bold', // 加粗
};

const horizontalLineStyle = {
  borderTop: '2px solid black',
  width: '100%',
  display: 'block'
};

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => null,
});

function useHotKey() {
  const chatStore = useChatStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey) {
        if (e.key === "ArrowUp") {
          chatStore.nextSession(-1);
        } else if (e.key === "ArrowDown") {
          chatStore.nextSession(1);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
}

function useDragSideBar() {
  const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x);

  const config = useAppConfig();
  const startX = useRef(0);
  const startDragWidth = useRef(config.sidebarWidth ?? DEFAULT_SIDEBAR_WIDTH);
  const lastUpdateTime = useRef(Date.now());

  const toggleSideBar = () => {
    config.update((config) => {
      if (config.sidebarWidth < MIN_SIDEBAR_WIDTH) {
        config.sidebarWidth = DEFAULT_SIDEBAR_WIDTH;
      } else {
        config.sidebarWidth = NARROW_SIDEBAR_WIDTH;
      }
    });
  };

  const onDragStart = (e: MouseEvent) => {
    // Remembers the initial width each time the mouse is pressed
    startX.current = e.clientX;
    startDragWidth.current = config.sidebarWidth;
    const dragStartTime = Date.now();

    const handleDragMove = (e: MouseEvent) => {
      if (Date.now() < lastUpdateTime.current + 20) {
        return;
      }
      lastUpdateTime.current = Date.now();
      const d = e.clientX - startX.current;
      const nextWidth = limit(startDragWidth.current + d);
      config.update((config) => {
        if (nextWidth < MIN_SIDEBAR_WIDTH) {
          config.sidebarWidth = MIN_SIDEBAR_WIDTH; // 设置为最小宽度
        } else {
          config.sidebarWidth = nextWidth;
        }
      });
    };

    const handleDragEnd = () => {
      // In useRef the data is non-responsive, so `config.sidebarWidth` can't get the dynamic sidebarWidth
      window.removeEventListener("pointermove", handleDragMove);
      window.removeEventListener("pointerup", handleDragEnd);

      // if user click the drag icon, should toggle the sidebar
      const shouldFireClick = Date.now() - dragStartTime < 300;
      if (shouldFireClick) {
        toggleSideBar();
      }
    };

    window.addEventListener("pointermove", handleDragMove);
    window.addEventListener("pointerup", handleDragEnd);
  };

  const isMobileScreen = useMobileScreen();
  const shouldNarrow =
    !isMobileScreen && config.sidebarWidth < MIN_SIDEBAR_WIDTH;

  useEffect(() => {
    const barWidth = shouldNarrow
      ? NARROW_SIDEBAR_WIDTH
      : limit(config.sidebarWidth ?? DEFAULT_SIDEBAR_WIDTH);
    const sideBarWidth = isMobileScreen ? "100vw" : `${barWidth}px`;
    document.documentElement.style.setProperty("--sidebar-width", sideBarWidth);
  }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);

  return {
    onDragStart,
    shouldNarrow,
  };
}

export function SideBar(props: { className?: string }) {
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };



  const chatStore = useChatStore();

  // drag side bar
  const { onDragStart, shouldNarrow } = useDragSideBar();
  const navigate = useNavigate();
  const config = useAppConfig();
  const [gptSrc, setGptSrc] = useState("https://bing.cygpt.top");

  // 添加定时器来每60秒刷新新的iframe
  useEffect(() => {
    const interval = setInterval(() => {
      // 直接设置一个新的URL，确保每次刷新都是一个新的请求
      setGptSrc("https://bing.cygpt.top?refresh=" + new Date().getTime());
    }, 600000); // 60000毫秒 = 60秒

    // 清理函数，组件卸载时清除定时器
    return () => clearInterval(interval);
  }, []); // 空数组意味着这个useEffect只在组件挂载时运行一次

  return (
    <div
      className={`${styles.sidebar} ${props.className} ${shouldNarrow && styles["narrow-sidebar"]
        }`}
    >
      <div className={styles["sidebar-header"]} data-tauri-drag-region>
        <div className={styles["sidebar-title"]} data-tauri-drag-region>
          <span className={iStyle["rainbow-text-style"]}>CyGPT
          </span>
        </div>
        <div style={horizontalLineStyle}></div>

        <div className={styles["sidebar-notice"]} 
             style={{ 
               textAlign: 'center',
               margin: '8px 0',
               fontSize: '0.9em',
               color: '#4CAF50', // 使用与绿色边框协调的颜色
               fontWeight: 'bold',
               opacity: 0.8
             }}>
              🚀 已接入地表最强 DeepSeek模型
              <br />  {/* 换行显示 */}
              <span style={{ fontSize: '0.85em' }}>
                [ 模型对应关系：GPT-3 → DeepSeek-V3(不深度思考，反应快) | GPT-4 → DeepSeek-R1(深度思考，反应慢) ]
              </span>
        </div>

        <div className={styles["sidebar-sub-title"]} style={{ border: '3px solid green', margin: '2px 2px', textAlign: 'center' }}>
          <style jsx>{`
            @keyframes rainbow {
              0% { background-position: 0%; }
              100% { background-position: 100%; }
            }
          `}</style>
          <span style={{ ...rainbowTextStyleContent }}>快速链接：</span>
          <a href="https://yuanbao.tencent.com/chat" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'rgba(128, 128, 128, 0.5)', display: 'block', margin: 'auto', fontSize: '1.5em' }}>腾讯元宝</a>
          <a href="https://ai.dangbei.com/chat" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'rgba(128, 128, 128, 0.4)', display: 'block', margin: 'auto', fontSize: '1.5em' }}>当贝AI</a>
          <a href="https://www.wenxiaobai.com/chat/200006" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'rgba(128, 128, 128, 0.35)', display: 'block', margin: 'auto', fontSize: '1.5em' }}>问小白</a>
          <a href="https://cloud.infini-ai.com/genstudio/model" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'rgba(128, 128, 128, 0.32)', display: 'block', margin: 'auto', fontSize: '1.5em' }}>无问苍穹</a>
          <a href="https://cloud.siliconflow.cn/playground/chat" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'rgba(128, 128, 128, 0.28)', display: 'block', margin: 'auto', fontSize: '1.5em' }}>硅基流动</a>
          <a href="https://www.doubao.com/" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'rgba(128, 128, 128, 0.25)', display: 'block', margin: 'auto', fontSize: '1.5em' }}>字节豆包</a>
          <a href="https://tongyi.aliyun.com/" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'rgba(128, 128, 128, 0.23)', display: 'block', margin: 'auto', fontSize: '1.5em' }}>阿里通义</a>
          <a href="https://chat.deepseek.com/" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'rgba(128, 128, 128, 0.2)', display: 'block', margin: 'auto', fontSize: '1.5em' }}>DeepSeek</a>
          <a href="https://kimi.moonshot.cn/" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'rgba(128, 128, 128, 0.15)', display: 'block', margin: 'auto', fontSize: '1.5em' }}>Kimi</a>
          <a href="https://chatglm.cn/main/alltoolsdetail" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'rgba(128, 128, 128, 0.1)', display: 'block', margin: 'auto', fontSize: '1.5em' }}>清华智谱</a>
        </div>


      </div>
      <iframe src={gptSrc} style={{ width: '0%', height: '0%', border: 'none' }}></iframe>

      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<MaskIcon />}
          text={shouldNarrow ? undefined : Locale.Mask.Name}
          className={styles["sidebar-bar-button"]}
          onClick={() => {
            if (config.dontShowMaskSplashScreen !== true) {
              navigate(Path.NewChat, { state: { fromHome: true } });
            } else {
              navigate(Path.Masks, { state: { fromHome: true } });
            }
          }}
          shadow
        />
        <IconButton
          icon={<PluginIcon />}
          text={shouldNarrow ? undefined : Locale.Plugin.Name}
          className={styles["sidebar-bar-button"]}
          onClick={() => showToast(Locale.WIP)}
          shadow
        />
      </div>

      <div
        className={styles["sidebar-body"]}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            navigate(Path.Home);
          }
        }}
      >
        <ChatList narrow={shouldNarrow} />
      </div>

      <div className={styles["sidebar-tail"]}>
        <div className={styles["sidebar-actions"]}>
          <div className={styles["sidebar-action"] + " " + styles.mobile}>
            <IconButton
              icon={<CloseIcon />}
              onClick={async () => {
                if (await showConfirm(Locale.Home.DeleteChat)) {
                  chatStore.deleteSession(chatStore.currentSessionIndex);
                }
              }}
            />
          </div>
          <div className={styles["sidebar-action"]}>
            <Link to={Path.Settings}>
              <IconButton icon={<SettingsIcon />} shadow />
            </Link>
          </div>
          <div className={styles["sidebar-action"]}>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              <IconButton icon={<GithubIcon />} shadow />
            </a>
          </div>
        </div>
        <div>
          <IconButton
            icon={<AddIcon />}
            text={shouldNarrow ? undefined : Locale.Home.NewChat}
            onClick={() => {
              if (config.dontShowMaskSplashScreen) {
                chatStore.newSession();
                navigate(Path.Chat);
              } else {
                navigate(Path.NewChat);
              }
            }}
            shadow
          />
        </div>
      </div>

      <div
        className={styles["sidebar-drag"]}
        onPointerDown={(e) => onDragStart(e as any)}
      >
        <DragIcon />
      </div>
    </div>
  );
}
