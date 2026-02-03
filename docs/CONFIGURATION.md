# OpenClaw LifeLog 配置指南

## 配置文件概览

| 文件 | 位置 | 用途 |
|------|------|------|
| openclaw.json | ~/.openclaw/ | 主配置文件 |
| voicewake.json | ~/.openclaw/settings/ | 语音唤醒配置 |
| talk.json | ~/.openclaw/settings/ | 对话模式配置 |

## 主配置文件 (openclaw.json)

### Agent 配置

```json
{
  "agents": {
    "defaults": {
      "model": "anthropic/claude-sonnet-4-5",
      "memorySearch": {
        "enabled": true,
        "provider": "openai",
        "model": "text-embedding-3-small"
      }
    },
    "list": [
      {
        "id": "master-habit",
        "default": true,
        "name": "Master Habit Agent",
        "workspace": "~/.openclaw/workspace-master"
      }
    ]
  }
}
```

**参数说明**:
- `model`: 使用的 LLM 模型
- `memorySearch.enabled`: 是否启用记忆搜索
- `workspace`: Agent 工作目录

### 消息通道配置

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true
    },
    "telegram": {
      "enabled": true
    }
  }
}
```

### Agent 绑定配置

```json
{
  "bindings": [
    {
      "agentId": "master-habit",
      "match": { "channel": "whatsapp" }
    }
  ]
}
```

## 语音唤醒配置 (voicewake.json)

```json
{
  "triggers": ["siri", "openclaw", "hey assistant"],
  "sensitivity": 0.5,
  "updatedAtMs": 1738540800000
}
```

**参数说明**:
- `triggers`: 唤醒词列表
- `sensitivity`: 灵敏度 (0-1)，值越高越灵敏

### 自定义唤醒词

1. 编辑 `~/.openclaw/settings/voicewake.json`
2. 修改 `triggers` 数组
3. 重启 OpenClaw Gateway

```bash
# 示例：添加 "小助手" 作为唤醒词
{
  "triggers": ["siri", "openclaw", "小助手"],
  "sensitivity": 0.5
}
```

## 对话模式配置 (talk.json)

```json
{
  "enabled": true,
  "tts": {
    "provider": "elevenlabs",
    "voice": "rachel",
    "model": "eleven_multilingual_v2"
  },
  "stt": {
    "provider": "whisper",
    "model": "whisper-1"
  },
  "interruptible": true,
  "streamingResponse": true,
  "silenceThresholdMs": 1500
}
```

**参数说明**:
- `tts.provider`: 文字转语音提供商 (elevenlabs/openai)
- `stt.provider`: 语音转文字提供商 (whisper/deepgram)
- `interruptible`: 是否允许打断
- `silenceThresholdMs`: 静音检测阈值（毫秒）

## 时区配置

系统默认使用 `Asia/Shanghai` 时区。修改方法：

1. **全局修改**: 在 Cron Job 创建时指定 `--tz` 参数
2. **环境变量**: 设置 `TIMEZONE` 环境变量

```bash
# 使用美国东部时区
TIMEZONE=America/New_York ./scripts/setup-cron.sh
```

## 提醒配置

### 修改提醒时间

编辑 `scripts/setup-cron.sh` 中的 cron 表达式：

```bash
# 原配置：9:00 AM 检查刷牙
add_cron_job "Morning Toothbrush Check" "0 9 * * *" ...

# 修改为 8:30 AM
add_cron_job "Morning Toothbrush Check" "30 8 * * *" ...
```

### 添加新提醒

```bash
openclaw cron add \
  --name "Custom Reminder" \
  --cron "0 12 * * *" \
  --tz "Asia/Shanghai" \
  --session isolated \
  --agentId master-habit \
  --message "你的自定义提醒内容"
```

### 删除提醒

```bash
# 列出所有 cron jobs
openclaw cron list

# 删除指定 job
openclaw cron remove <job-id>
```

## HAR 服务配置

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| PORT | 5000 | 服务端口 |
| DEBUG | false | 调试模式 |

### Docker Compose 配置

编辑 `services/har/docker-compose.yml`:

```yaml
services:
  har-service:
    environment:
      - PORT=5000
      - DEBUG=false
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
```

## 故障排除

### 语音唤醒不工作

1. 检查麦克风权限
2. 调高 `sensitivity` 值
3. 确认唤醒词拼写正确

### Cron Job 不执行

1. 检查时区设置
2. 确认 Gateway 正在运行
3. 查看日志: `openclaw logs`

### Agent 通信失败

1. 检查 `agentToAgent.allow` 配置
2. 确认 Agent 已创建
3. 重启 Gateway
