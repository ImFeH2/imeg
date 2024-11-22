# ImI

[English](./README.md) | [简体中文](./README.zh.md)

一个无代码内容分享平台（开发中）。

## 项目简介

ImI 是一个去中心化、无代码的内容分享平台，目前处于开发初期，正在完成无代码编辑器部分功能。通过拖拽式编辑，用户可以轻松创建和编辑内容，无需编写代码。

## 当前功能

- 拖拽式页面编辑
- 组件自由放置与调整
- 实时预览
- 属性面板配置
- 支持撤销/重做
- 响应式布局

## 快速开始

首先需要clone项目到本地：

```bash
git clone https://github.com/ImFeH2/imi.git
````

### 前端开发

确保你的开发环境满足以下要求：

- Node.js (v16+)
- npm 或 yarn

```bash
# 进入前端目录
cd imi/frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 后端开发

需要安装 Rust 开发环境：

```bash
# 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 进入后端目录
cd imi/backend

# 编译运行
cargo run
```

## 技术栈

- **前端**
    - React
    - TypeScript
    - Tailwind CSS
    - Vite
- **后端**
    - Rust

## 开发计划

- [ ] 完善编辑器功能
    - [ ] 更多预设组件
    - [ ] 自定义组件
- [ ] 设计数据结构
- [ ] 开发后端 API

## 贡献指南

欢迎提交 Issue 和 Pull Request。

## 作者

ImFeH2 (i@feh2.im)

## 许可证

[Apache-2.0 License](./LICENSE)
