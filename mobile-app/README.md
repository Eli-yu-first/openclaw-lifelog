# openclaw-lifelog · Mobile App

> AI 生活与健康管家移动端应用 — openclaw 生态系统的软件展示层

## 项目简介

这是 [openclaw-lifelog](https://github.com/Eli-yu-first/openclaw-lifelog) 开源项目的**移动端 App**，配合桌面智能摄像头（带动态情绪表情）使用，提供 AI 驱动的生活记录与健康管理体验。

UI 风格对标 **Apple Health**，采用极简高级感设计、Bento Box 卡片式布局和局部毛玻璃（Glassmorphism）效果。

## 五大核心模块

| 模块 | 功能 |
|------|------|
| **今天 Today** | Nomi 动态表情岛 · 健康三环 · 四宫格 Bento 卡片 · Lifelog 时间线 |
| **健康 Health** | 体态柱状图 · 用药打卡日历 · 眼部折线图 · 情绪压力波形 |
| **洞察 Insights** | 行为交叉分析 · GitHub 风格热力图 · 健康周报 · 智能预警 |
| **陪伴 Companion** | 多模态气泡对话 · 主动关怀横幅 · 专属记忆库瀑布流 |
| **我的 My** | ViT 模型配置 · 隐私屏障状态灯 · 表情商店 · 语言/风格设置 |

## 技术栈

- **框架**: Expo SDK 54 + React Native 0.81
- **路由**: Expo Router 6
- **样式**: NativeWind 4 (Tailwind CSS)
- **动画**: React Native Reanimated 4
- **语言**: TypeScript 5.9

## 快速开始

```bash
cd mobile-app
pnpm install
pnpm dev
```

扫描终端中的二维码，在 Expo Go 中预览。

## 目录结构

```
mobile-app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        # 今天
│   │   ├── health.tsx       # 健康
│   │   ├── insights.tsx     # 洞察
│   │   ├── companion.tsx    # 陪伴
│   │   └── device.tsx       # 我的
│   └── lifelog.tsx          # 生活记录日志页
├── components/ui/           # 核心 UI 组件库
├── lib/                     # 全局状态、主题、设置
└── hooks/                   # 自定义 Hooks
```

## 与硬件端的关系

本目录（`mobile-app/`）是纯软件展示层，独立于仓库根目录的硬件代理系统（`agents/`、`configs/`、`services/` 等）。两者通过 API 接口通信，互不干扰。

## License

MIT © openclaw contributors
