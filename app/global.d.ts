//使用TypeScript的声明文件，用于声明模块导入和全局变量的类型

// 声明可以导入任何后缀为.jpg的文件
declare module "*.jpg";

// 声明可以导入任何后缀为.png的文件
declare module "*.png";

// 声明可以导入任何后缀为.woff2的文件
declare module "*.woff2";

// 声明可以导入任何后缀为.woff的文件
declare module "*.woff";

// 声明可以导入任何后缀为.ttf的文件
declare module "*.ttf";

// 声明可以导入任何后缀为.scss的文件
declare module "*.scss" {
  const content: Record<string, string>; // 声明一个名为content的常量，类型为Record<string, string>
  export default content; // 导出content常量作为默认导出
}

// 声明可以导入任何后缀为.svg的文件
declare module "*.svg";

// 声明全局变量window中的__TAURI__属性
declare interface Window {
  __TAURI__?: {
    writeText(text: string): Promise<void>;
  };
}
