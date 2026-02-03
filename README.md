# OpenClaw LifeLog

[English](#english) | [中文](#中文)

---

<a name="english"></a>
## English

A personal life recording and intelligent assistant system based on [OpenClaw](https://github.com/openclaw/openclaw).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Compatible-blue.svg)](https://github.com/openclaw/openclaw)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22-green.svg)](https://nodejs.org/)

### Features

| Feature | Description | OpenClaw Component |
|---------|-------------|-------------------|
| 🎥 Camera Capture | Periodically capture user behavior video | Camera Capture |
| 🧠 AI Behavior Analysis | Convert video to structured behavior data | HAR Service |
| 🤖 Multi-Agent Collaboration | Hierarchical agent cluster for different life scenarios | Multi-Agent Routing |
| 💾 Long-term Memory | Store and query user habit data | Memory System |
| ⏰ Proactive Reminders | Smart reminders based on habits | Cron Jobs |
| 🎤 Voice Wake | Custom wake words (e.g., "Siri") | Voice Wake |
| 💬 Multi-Channel | WhatsApp, Telegram, Discord support | Channels |

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Interaction Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Voice Wake  │  │   Channels   │  │  Reminders   │          │
│  │   (Siri)     │  │  (WhatsApp)  │  │   (Cron)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                   Multi-Agent Collaboration Layer                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  MasterHabitAgent                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│       │              │              │              │            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │ Morning │  │ Dental  │  │  Work   │  │Departure│          │
│  │ Agent   │  │ Agent   │  │ Agent   │  │ Agent   │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Data Processing Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Camera     │  │  Behavior    │  │   Memory     │          │
│  │  Capture     │  │  Analysis    │  │   System     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Quick Start

#### Prerequisites

- [OpenClaw](https://github.com/openclaw/openclaw) installed and running
- Node.js >= 22
- Docker and Docker Compose (for HAR service)
- macOS/iOS/Android device (for camera features)

#### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Eli-yu-first/openclaw-lifelog.git
cd openclaw-lifelog

# 2. One-click installation
./scripts/install.sh

# 3. Verify installation
./scripts/verify.sh
```

#### Manual Setup

```bash
# Deploy HAR service
cd services/har
docker-compose up -d

# Copy configuration files
cp configs/openclaw.json ~/.openclaw/openclaw.json
cp configs/voicewake.json ~/.openclaw/settings/voicewake.json
cp configs/talk.json ~/.openclaw/settings/talk.json

# Create agents
./scripts/setup-agents.sh

# Configure cron jobs
./scripts/setup-cron.sh

# Restart OpenClaw Gateway
openclaw gateway restart
```

### Project Structure

```
openclaw-lifelog/
├── README.md                 # Project documentation (bilingual)
├── LICENSE                   # MIT License
├── agents/                   # Agent definitions
│   ├── master-habit/         # Master Habit Agent
│   ├── morning-routine/      # Morning Routine Agent
│   ├── dental-hygiene/       # Dental Hygiene Agent
│   ├── work-life/            # Work Life Agent
│   └── departure/            # Departure Agent
├── configs/                  # Configuration files
│   ├── openclaw.json         # Main OpenClaw config
│   ├── voicewake.json        # Voice wake config
│   ├── talk.json             # Talk mode config
│   ├── camera.json           # Camera capture config
│   ├── browser.json          # Browser tools config
│   ├── skills.json           # Skills config
│   └── webhooks.json         # Webhooks config
├── skills/                   # Custom skills
│   ├── lifelog-capture/      # Behavior capture skill
│   ├── habit-tracker/        # Habit tracking skill
│   └── smart-reminder/       # Smart reminder skill
├── services/                 # External services
│   └── har/                  # Human Activity Recognition
│       ├── har_service.py    # Flask API service
│       ├── Dockerfile
│       └── docker-compose.yml
├── scripts/                  # Installation scripts
│   ├── install.sh            # One-click install
│   ├── setup-agents.sh       # Agent creation
│   ├── setup-cron.sh         # Cron job setup
│   ├── verify.sh             # Verification script
│   └── test-har.sh           # HAR service test
└── docs/                     # Documentation
    ├── ARCHITECTURE.md       # Architecture design
    └── CONFIGURATION.md      # Configuration guide
```

### Configuration

#### Voice Wake

Edit `configs/voicewake.json` to set wake words:

```json
{
  "triggers": ["siri", "openclaw", "hey assistant"],
  "sensitivity": 0.5
}
```

#### Proactive Reminders

Pre-configured reminder scenarios:

| Scenario | Trigger Time | Check Content |
|----------|--------------|---------------|
| Forgot to brush | 9:00 AM | Morning brushing record |
| Sedentary | Every 2 hours | Activity record |
| Departure check | 8:00 AM | Items carried |
| Hydration | Every 2 hours | Drinking record |

#### Message Channels

Configure channels in `configs/openclaw.json`:

```json
{
  "channels": {
    "whatsapp": { "enabled": true },
    "telegram": { "enabled": true },
    "discord": { "enabled": false }
  }
}
```

### Multi-Agent System

#### Agent Hierarchy

```
MasterHabitAgent (Main Habit Management)
├── MorningRoutineAgent (Morning Habits)
│   ├── Wake time recording
│   ├── Grooming tracking
│   └── Breakfast analysis
├── DentalHygieneAgent (Dental Health)
│   ├── Brushing frequency
│   ├── Brushing duration
│   └── Flossing tracking
├── WorkLifeAgent (Work-Life Balance)
│   ├── Work hours analysis
│   ├── Break reminders
│   └── Hydration habits
└── DepartureAgent (Departure Management)
    ├── Leave time recording
    ├── Item checklist
    └── Transportation analysis
```

### HAR Service API

The Human Activity Recognition service provides REST APIs for behavior analysis.

#### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/activities` | GET | List supported activities |
| `/analyze` | POST | Analyze video for activities |
| `/analyze/image` | POST | Analyze single image |

#### Example Request

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "video": "<base64_encoded_video>",
    "timestamp": "2026-02-03T08:15:30Z"
  }'
```

### Skills

#### LifeLog Capture

Automatically captures and analyzes user behavior:

```
capture my current activity
watch me for the next hour
```

#### Habit Tracker

Tracks and analyzes daily habits:

```
What are my brushing habits this week?
Show my habit statistics for today
```

#### Smart Reminder

Sends intelligent reminders:

```
Remind me to brush my teeth every morning
What reminders do I have today?
```

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Acknowledgments

- [OpenClaw](https://github.com/openclaw/openclaw) - The powerful open-source AI assistant framework
- [Picovoice Porcupine](https://picovoice.ai/) - Voice wake engine
- [YOLOv8](https://github.com/ultralytics/ultralytics) - Object detection and pose estimation

---

<a name="中文"></a>
## 中文

基于 [OpenClaw](https://github.com/openclaw/openclaw) 的个人生活记录与智能助理系统。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Compatible-blue.svg)](https://github.com/openclaw/openclaw)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22-green.svg)](https://nodejs.org/)

### 功能特性

| 功能 | 描述 | OpenClaw 组件 |
|------|------|--------------|
| 🎥 摄像头采集 | 定时捕获用户行为视频 | Camera Capture |
| 🧠 AI 行为分析 | 将视频转化为结构化行为数据 | HAR 服务 |
| 🤖 多智能体协作 | 分层式 Agent 集群管理不同生活场景 | Multi-Agent Routing |
| 💾 长期记忆 | 存储和查询用户习惯数据 | Memory System |
| ⏰ 主动提醒 | 基于习惯的智能提醒 | Cron Jobs |
| 🎤 语音唤醒 | 自定义唤醒词（如 "Siri"） | Voice Wake |
| 💬 多通道支持 | WhatsApp、Telegram、Discord | Channels |

### 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户交互层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  语音唤醒    │  │  消息通道    │  │  主动提醒    │          │
│  │  (Siri)     │  │  (WhatsApp)  │  │  (Cron)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                     多智能体协作层                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  MasterHabitAgent                        │  │
│  │              (主习惯管理智能体)                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│       │              │              │              │            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │ 晨间    │  │ 口腔    │  │ 工作    │  │ 出行    │          │
│  │ Agent   │  │ Agent   │  │ Agent   │  │ Agent   │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      数据处理层                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  摄像头采集  │  │  行为分析    │  │  长期记忆    │          │
│  │  (Camera)   │  │  (HAR)      │  │  (Memory)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### 快速开始

#### 前置要求

- [OpenClaw](https://github.com/openclaw/openclaw) 已安装并运行
- Node.js >= 22
- Docker 和 Docker Compose（用于 HAR 服务）
- macOS/iOS/Android 设备（用于摄像头功能）

#### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/Eli-yu-first/openclaw-lifelog.git
cd openclaw-lifelog

# 2. 一键安装
./scripts/install.sh

# 3. 验证安装
./scripts/verify.sh
```

#### 手动安装

```bash
# 部署 HAR 服务
cd services/har
docker-compose up -d

# 复制配置文件
cp configs/openclaw.json ~/.openclaw/openclaw.json
cp configs/voicewake.json ~/.openclaw/settings/voicewake.json
cp configs/talk.json ~/.openclaw/settings/talk.json

# 创建 Agents
./scripts/setup-agents.sh

# 配置 Cron Jobs
./scripts/setup-cron.sh

# 重启 OpenClaw Gateway
openclaw gateway restart
```

### 项目结构

```
openclaw-lifelog/
├── README.md                 # 项目说明（双语）
├── LICENSE                   # MIT 许可证
├── agents/                   # Agent 定义文件
│   ├── master-habit/         # 主习惯管理 Agent
│   ├── morning-routine/      # 晨间习惯 Agent
│   ├── dental-hygiene/       # 口腔健康 Agent
│   ├── work-life/            # 工作生活 Agent
│   └── departure/            # 出行管理 Agent
├── configs/                  # 配置文件
│   ├── openclaw.json         # OpenClaw 主配置
│   ├── voicewake.json        # 语音唤醒配置
│   ├── talk.json             # 对话模式配置
│   ├── camera.json           # 摄像头配置
│   ├── browser.json          # 浏览器工具配置
│   ├── skills.json           # 技能配置
│   └── webhooks.json         # Webhooks 配置
├── skills/                   # 自定义技能
│   ├── lifelog-capture/      # 行为采集技能
│   ├── habit-tracker/        # 习惯追踪技能
│   └── smart-reminder/       # 智能提醒技能
├── services/                 # 外部服务
│   └── har/                  # 人类活动识别服务
│       ├── har_service.py    # Flask API 服务
│       ├── Dockerfile
│       └── docker-compose.yml
├── scripts/                  # 安装脚本
│   ├── install.sh            # 一键安装
│   ├── setup-agents.sh       # Agent 创建
│   ├── setup-cron.sh         # Cron Job 配置
│   ├── verify.sh             # 验证脚本
│   └── test-har.sh           # HAR 服务测试
└── docs/                     # 文档
    ├── ARCHITECTURE.md       # 架构设计
    └── CONFIGURATION.md      # 配置指南
```

### 配置说明

#### 语音唤醒

编辑 `configs/voicewake.json` 设置唤醒词：

```json
{
  "triggers": ["siri", "openclaw", "小助手"],
  "sensitivity": 0.5
}
```

#### 主动提醒

预配置的提醒场景：

| 场景 | 触发时间 | 检查内容 |
|------|---------|---------|
| 忘记刷牙 | 每天 9:00 | 早上刷牙记录 |
| 久坐提醒 | 每 2 小时 | 活动记录 |
| 出门检查 | 每天 8:00 | 物品携带 |
| 喝水提醒 | 每 2 小时 | 喝水记录 |

#### 消息通道

在 `configs/openclaw.json` 中配置消息通道：

```json
{
  "channels": {
    "whatsapp": { "enabled": true },
    "telegram": { "enabled": true },
    "discord": { "enabled": false }
  }
}
```

### 多智能体系统

#### Agent 层级

```
MasterHabitAgent (主习惯管理)
├── MorningRoutineAgent (晨间习惯)
│   ├── 起床时间记录
│   ├── 洗漱流程追踪
│   └── 早餐习惯分析
├── DentalHygieneAgent (口腔健康)
│   ├── 刷牙频率记录
│   ├── 刷牙时长统计
│   └── 牙线使用追踪
├── WorkLifeAgent (工作生活)
│   ├── 工作时段分析
│   ├── 休息提醒
│   └── 喝水习惯
└── DepartureAgent (出行管理)
    ├── 出门时间记录
    ├── 物品携带检查
    └── 交通方式分析
```

### HAR 服务 API

人类活动识别服务提供 REST API 进行行为分析。

#### 接口列表

| 接口 | 方法 | 描述 |
|------|------|------|
| `/health` | GET | 健康检查 |
| `/activities` | GET | 列出支持的活动类型 |
| `/analyze` | POST | 分析视频中的活动 |
| `/analyze/image` | POST | 分析单张图片 |

#### 请求示例

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "video": "<base64编码的视频>",
    "timestamp": "2026-02-03T08:15:30Z"
  }'
```

### 技能

#### LifeLog Capture（生活记录采集）

自动捕获和分析用户行为：

```
capture my current activity
watch me for the next hour
```

#### Habit Tracker（习惯追踪）

追踪和分析日常习惯：

```
这周我的刷牙习惯怎么样？
显示今天的习惯统计
```

#### Smart Reminder（智能提醒）

发送智能提醒：

```
每天早上提醒我刷牙
今天有什么提醒？
```

### 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

### 致谢

- [OpenClaw](https://github.com/openclaw/openclaw) - 强大的开源 AI 助手框架
- [Picovoice Porcupine](https://picovoice.ai/) - 语音唤醒引擎
- [YOLOv8](https://github.com/ultralytics/ultralytics) - 目标检测和姿态估计

---

## Contact / 联系方式

If you have any questions or suggestions, please submit an [Issue](https://github.com/Eli-yu-first/openclaw-lifelog/issues).

如有问题或建议，请提交 [Issue](https://github.com/Eli-yu-first/openclaw-lifelog/issues)。
