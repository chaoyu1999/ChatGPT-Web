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
  backgroundSize: '200% auto', // 添加这一行

  WebkitBackgroundClip: 'text',
  color: 'transparent',
  display: 'flex',
  fontSize: "17px",
  fontFamily: 'Arial, sans-serif',
  animation: 'rainbow 1s ease infinite',
};
const ImgGenerate = {
  background: 'linear-gradient(to right, red, orange, green, blue, indigo, violet)',
  backgroundSize: '200% auto', // 添加这一行

  WebkitBackgroundClip: 'text',
  color: 'transparent',
  display: 'flex',
  fontSize: "20px",
  fontFamily: 'Arial, sans-serif',
  animation: 'rainbow 1s ease infinite',
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
  /**
   * 添加画图按钮
   */
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleButtonClick = () => {
    // 在这里添加按钮点击事件的逻辑
    console.log('按钮被点击了');
  };
  ////////////////////////////////////

  const chatStore = useChatStore();

  // drag side bar
  const { onDragStart, shouldNarrow } = useDragSideBar();
  const navigate = useNavigate();
  const config = useAppConfig();

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

        <div className={styles["sidebar-sub-title"]}>
          <style jsx>{`
          @keyframes rainbow {
            0% {background-position: 0%;}
            100% {background-position: 100%;}
          }
        `}</style>
          <span style={{ ...rainbowTextStyleContent ,border: '1px solid orange', margin:'2px 0px'}}>接入了Bing gpt-4 模型。可在聊天输入框的上方，点击&quot;机器人&quot;图标更换模型。<img src="https://pic.imgdb.cn/item/65bf3bf7871b83018aee2d6c.jpg" alt="Bing GPT-4 Icon" style={{ transform: 'scale(1)' }} /></span>
          <span style={{ ...rainbowTextStyleContent ,border: '1px solid black',}}>bing-联网版：结合网页搜索结果回答，可搜索最新问题。<br />bing-不联网：回答更精确，但只能回答2021年之前的内容。</span>
          <span style={{ ...ImgGenerate , fontWeight: 'bold', alignItems: 'center', justifyContent: 'center'}}>&darr;&darr;&darr;接入绘图功能&darr;&darr;&darr;</span>

          <button onClick={openPopup} className={iStyle["but-sidebar"]}>图片创作</button>
          {showPopup && (
            <>
              <div className={iStyle["overlay"]} onClick={closePopup}></div>
              <div className={iStyle["popup"]}>
                <iframe src="https://img.cygpt.top" style={{ width: '100%', height: '100%', border: 'none' }}></iframe>
                <button onClick={closePopup} className={iStyle["but-close"]}>X</button>
              </div>
            </>
          )}

        </div>

      </div>

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
