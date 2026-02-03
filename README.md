# OpenClaw LifeLog

基于 [OpenClaw](https://github.com/openclaw/openclaw) 的个人生活记录与智能助理系统。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Compatible-blue.svg)](https://github.com/openclaw/openclaw)

## 功能特性

- 🎥 **摄像头数据采集**：通过 OpenClaw 的 Camera Capture 功能，定时捕获用户行为视频
- 🧠 **AI 行为分析**：集成人类活动识别（HAR）服务，将视频转化为结构化行为数据
- 🤖 **多智能体协作**：分层式 Agent 集群，专业化管理不同生活场景
- 💾 **长期记忆系统**：基于 OpenClaw Memory 的用户习惯存储与语义查询
- ⏰ **主动提醒机制**：基于 Cron Jobs 的智能提醒，如忘记刷牙、出门带钥匙等
- 🎤 **语音唤醒**：支持自定义唤醒词（如 "Siri"），实现免手操作

## 系统架构

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

## 快速开始

### 前置要求

- [OpenClaw](https://github.com/openclaw/openclaw) 已安装并运行
- Docker 和 Docker Compose
- macOS 设备（用于摄像头功能）
- WhatsApp/Telegram 等消息通道配置

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/YOUR_USERNAME/openclaw-lifelog.git
cd openclaw-lifelog
```

2. **部署 HAR 服务**

```bash
cd services/har
docker-compose up -d
```

3. **复制配置文件**

```bash
cp configs/openclaw.json ~/.openclaw/openclaw.json
cp configs/voicewake.json ~/.openclaw/settings/voicewake.json
cp configs/talk.json ~/.openclaw/settings/talk.json
```

4. **创建 Agents**

```bash
./scripts/setup-agents.sh
```

5. **配置 Cron Jobs**

```bash
./scripts/setup-cron.sh
```

6. **重启 OpenClaw Gateway**

```bash
openclaw gateway restart
```

## 目录结构

```
openclaw-lifelog/
├── README.md                 # 项目说明
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
│   └── talk.json             # 对话模式配置
├── services/                 # 外部服务
│   └── har/                  # 人类活动识别服务
│       ├── Dockerfile
│       ├── docker-compose.yml
│       ├── requirements.txt
│       └── har_service.py
├── scripts/                  # 安装脚本
│   ├── setup-agents.sh       # Agent 创建脚本
│   ├── setup-cron.sh         # Cron Job 配置脚本
│   └── install.sh            # 一键安装脚本
└── docs/                     # 文档
    ├── ARCHITECTURE.md       # 架构设计
    ├── CONFIGURATION.md      # 配置指南
    └── TROUBLESHOOTING.md    # 故障排除
```

## 配置说明

### 语音唤醒

编辑 `configs/voicewake.json` 设置唤醒词：

```json
{
  "triggers": ["siri", "openclaw"],
  "sensitivity": 0.5
}
```

### 主动提醒

系统预配置了以下提醒场景：

| 场景 | 触发时间 | 检查内容 |
|------|---------|---------|
| 忘记刷牙 | 每天 9:00 | 早上是否刷牙 |
| 久坐提醒 | 每 2 小时 | 是否长时间坐姿 |
| 出门检查 | 每天 8:00 | 是否带齐物品 |
| 喝水提醒 | 每 2 小时 | 是否有喝水记录 |

### 消息通道

在 `configs/openclaw.json` 中配置消息通道：

```json
{
  "channels": {
    "whatsapp": { "enabled": true },
    "telegram": { "enabled": true }
  }
}
```

## 多智能体系统

### Agent 层级

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

### Agent 通信

Agent 间通过 `sessions_spawn` 工具进行任务分发：

```javascript
sessions_spawn({
  task: "记录刷牙行为：时间 2026-02-03T08:15:30Z，时长 120 秒",
  agentId: "dental-hygiene",
  label: "刷牙记录"
});
```

## 行为分析服务

HAR（Human Activity Recognition）服务负责分析视频中的用户行为。

### 支持的行为类型

- `brushing_teeth` - 刷牙
- `washing_face` - 洗脸
- `drinking_water` - 喝水
- `sitting` - 坐姿
- `standing` - 站立
- `walking` - 行走
- `leaving_home` - 出门

### API 接口

```bash
POST /analyze
Content-Type: application/json

{
  "video": "<base64_encoded_video>",
  "timestamp": "2026-02-03T08:15:30Z"
}
```

响应：

```json
{
  "timestamp": "2026-02-03T08:15:30Z",
  "activity": "brushing_teeth",
  "duration_seconds": 120,
  "confidence": 0.92
}
```

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 致谢

- [OpenClaw](https://github.com/openclaw/openclaw) - 强大的开源 AI 助手框架
- [Picovoice Porcupine](https://picovoice.ai/) - 语音唤醒引擎
- [YOLOv8](https://github.com/ultralytics/ultralytics) - 目标检测和姿态估计

## 联系方式

如有问题或建议，请提交 [Issue](https://github.com/YOUR_USERNAME/openclaw-lifelog/issues)。
