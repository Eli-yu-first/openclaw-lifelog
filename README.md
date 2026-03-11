# OpenClaw LifeLog

[English](#english) | [中文](#中文)

---

<a name="english"></a>
## English

A comprehensive personal life recording and intelligent assistant system based on [OpenClaw](https://github.com/openclaw/openclaw). This system records and learns **ALL** user behaviors and habits across **14 life scenarios** with **120+ activity types**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Compatible-blue.svg)](https://github.com/openclaw/openclaw)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22-green.svg)](https://nodejs.org/)
[![GitHub](https://img.shields.io/badge/GitHub-LifeClaw-181717?logo=github)](https://github.com/Eli-yu-first/LifeClaw)
[![GitHub](https://img.shields.io/badge/GitHub-LifeClaw%20Mobile-181717?logo=github)](https://github.com/Eli-yu-first/openclaw-lifelog-app)

### Features

| Feature | Description | OpenClaw Component |
|---------|-------------|-------------------|
| 🎥 Camera Capture | Continuously capture user behavior video | Camera Capture |
| 🧠 AI Behavior Analysis | Recognize 120+ activities using HAR | HAR Service |
| 🤖 16 Specialized Agents | Complete coverage of all life scenarios | Multi-Agent Routing |
| 💾 Long-term Memory | Store and learn from all user habits | Memory System |
| ⏰ Proactive Reminders | Context-aware smart reminders | Cron Jobs |
| 🎤 Voice Wake | Custom wake words (e.g., "Siri") | Voice Wake |
| 💬 Multi-Channel | WhatsApp, Telegram, Discord support | Channels |
| 🧬 Digital Twin | Create a digital replica of user habits | All Components |

### Life Scenario Coverage (14 Categories)

| Category | Agent | Activities Tracked |
|----------|-------|-------------------|
| 🏃 Health & Fitness | health-fitness | Exercise, walking, running, yoga, sports |
| 🍽️ Nutrition & Diet | nutrition-diet | Meals, drinking, cooking, snacking |
| 😴 Sleep & Rest | sleep-rest | Sleep patterns, napping, rest quality |
| 💬 Social & Communication | social-communication | Calls, meetings, social media |
| 🎮 Entertainment & Leisure | entertainment-leisure | TV, games, hobbies, reading |
| 📚 Learning & Education | learning-education | Study, courses, online learning |
| 💰 Finance & Shopping | finance-shopping | Shopping, bills, banking |
| 🏠 Home & Environment | home-environment | Cleaning, organizing, pet care |
| 🚗 Transportation & Travel | transportation-travel | Commuting, driving, traveling |
| 🧴 Personal Care | personal-care | Hygiene, grooming, medical |
| 💼 Productivity & Focus | productivity-focus | Work, meetings, deep focus |
| 🧘 Emotional Wellness | emotional-wellness | Meditation, mood, stress |
| 🌅 Morning Routine | morning-routine | Morning habits |
| 🚪 Departure | departure | Leaving home, item checking |

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        User Interaction Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  Voice Wake  │  │   Channels   │  │  Reminders   │  │  Talk Mode │  │
│  │   (Siri)     │  │  (WhatsApp)  │  │   (Cron)     │  │   (Voice)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                    Multi-Agent Collaboration Layer                       │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                      MasterHabitAgent                             │  │
│  │              (Coordinates 16 specialized agents)                  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│       │         │         │         │         │         │         │     │
│  ┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌──────┐  │
│  │Health  ││Nutri-  ││Sleep   ││Social  ││Enter-  ││Learn-  ││ ...  │  │
│  │Fitness ││tion    ││Rest    ││Comm    ││tain   ││ing     ││(+8)  │  │
│  └────────┘└────────┘└────────┘└────────┘└────────┘└────────┘└──────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                       Data Processing Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │   Camera     │  │  HAR Service │  │   Memory     │  │  Webhooks  │  │
│  │  Capture     │  │ (120+ acts)  │  │   System     │  │  & Skills  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
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

### Complete Activity List (120+)

<details>
<summary>Click to expand all activities</summary>

#### Health & Fitness (10)
exercising, walking, running, cycling, swimming, yoga, stretching, weight_training, sports, climbing_stairs

#### Nutrition & Diet (10)
eating_breakfast, eating_lunch, eating_dinner, snacking, drinking_water, drinking_coffee, drinking_tea, drinking_alcohol, cooking, ordering_food

#### Sleep & Rest (8)
going_to_bed, falling_asleep, waking_up, getting_out_of_bed, napping, resting, insomnia, night_waking

#### Social & Communication (10)
phone_calling, video_calling, texting, meeting_people, attending_party, family_time, dating, networking, online_chatting, social_media

#### Entertainment & Leisure (13)
watching_tv, watching_movie, playing_games, listening_music, reading_book, browsing_internet, watching_video, photography, drawing_painting, playing_instrument, gardening, crafting, collecting

#### Learning & Education (12)
studying, attending_class, online_learning, reading_textbook, doing_homework, taking_notes, reviewing, practicing, researching, writing_paper, coding_learning, language_learning

#### Finance & Shopping (10)
shopping_online, shopping_offline, grocery_shopping, paying_bills, banking, investing, budgeting, comparing_prices, returning_items, using_coupons

#### Home & Environment (13)
cleaning, vacuuming, mopping, doing_laundry, folding_clothes, ironing, washing_dishes, organizing, taking_out_trash, watering_plants, pet_care, home_repair, decorating

#### Transportation & Travel (12)
commuting, driving, taking_bus, taking_subway, taking_taxi, riding_bike, riding_scooter, walking_commute, flying, taking_train, traveling, business_trip

#### Personal Care (16)
brushing_teeth, flossing, mouthwash, washing_face, showering, bathing, washing_hair, skincare, shaving, makeup, nail_care, hair_styling, getting_haircut, medical_checkup, taking_medicine, using_toilet

#### Productivity & Focus (13)
working, computer_work, typing, writing, meeting, presenting, brainstorming, planning, emailing, phone_work, deep_work, break_time, procrastinating

#### Emotional Wellness (11)
meditating, deep_breathing, journaling, therapy_session, relaxing, crying, laughing, stress_relief, gratitude_practice, self_reflection, mood_tracking

</details>

### Proactive Reminder Examples

| Scenario | Trigger | Action |
|----------|---------|--------|
| Forgot to brush teeth | No brushing by 9:00 AM | "Don't forget to brush your teeth!" |
| Sedentary alert | Sitting for 2+ hours | "Time to stretch and move!" |
| Departure check | Leaving home detected | "Keys, phone, wallet?" |
| Hydration | No drinking for 2 hours | "Stay hydrated!" |
| Sleep reminder | 11:00 PM | "Time to prepare for bed" |
| Medication | Scheduled time | "Time to take your medication" |

### Digital Twin Concept

This system aims to create a **digital twin** of the user by:

1. **Recording** all behaviors through camera capture
2. **Analyzing** activities using AI (HAR service)
3. **Learning** patterns and preferences over time
4. **Predicting** needs and providing proactive assistance
5. **Replicating** the user's habits in a digital model

---

<a name="中文"></a>
## 中文

基于 [OpenClaw](https://github.com/openclaw/openclaw) 的全面个人生活记录与智能助理系统。该系统记录和学习用户在 **14 个生活场景** 中的 **所有行为习惯**，支持 **120+ 种活动类型**。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Compatible-blue.svg)](https://github.com/openclaw/openclaw)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22-green.svg)](https://nodejs.org/)

### 功能特性

| 功能 | 描述 | OpenClaw 组件 |
|------|------|--------------|
| 🎥 摄像头采集 | 持续捕获用户行为视频 | Camera Capture |
| 🧠 AI 行为分析 | 使用 HAR 识别 120+ 种活动 | HAR 服务 |
| 🤖 16 个专业智能体 | 全面覆盖所有生活场景 | Multi-Agent Routing |
| 💾 长期记忆 | 存储和学习所有用户习惯 | Memory System |
| ⏰ 主动提醒 | 基于上下文的智能提醒 | Cron Jobs |
| 🎤 语音唤醒 | 自定义唤醒词（如 "Siri"） | Voice Wake |
| 💬 多通道支持 | WhatsApp、Telegram、Discord | Channels |
| 🧬 数字孪生 | 创建用户习惯的数字副本 | 所有组件 |

### 生活场景覆盖（14 个类别）

| 类别 | 智能体 | 追踪的活动 |
|------|--------|-----------|
| 🏃 健康健身 | health-fitness | 运动、步行、跑步、瑜伽、球类 |
| 🍽️ 饮食营养 | nutrition-diet | 三餐、饮水、烹饪、零食 |
| 😴 睡眠休息 | sleep-rest | 睡眠模式、午休、休息质量 |
| 💬 社交沟通 | social-communication | 通话、会面、社交媒体 |
| 🎮 娱乐休闲 | entertainment-leisure | 电视、游戏、爱好、阅读 |
| 📚 学习教育 | learning-education | 学习、课程、在线学习 |
| 💰 财务购物 | finance-shopping | 购物、账单、银行业务 |
| 🏠 家居环境 | home-environment | 清洁、整理、宠物护理 |
| 🚗 交通出行 | transportation-travel | 通勤、驾驶、旅行 |
| 🧴 个人护理 | personal-care | 卫生、美容、医疗 |
| 💼 工作效率 | productivity-focus | 工作、会议、深度专注 |
| 🧘 情绪健康 | emotional-wellness | 冥想、情绪、减压 |
| 🌅 晨间习惯 | morning-routine | 晨间习惯 |
| 🚪 出门准备 | departure | 出门、物品检查 |

### 系统架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          用户交互层                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  语音唤醒    │  │  消息通道    │  │  主动提醒    │  │  对话模式  │  │
│  │   (Siri)     │  │  (WhatsApp)  │  │   (Cron)     │  │   (语音)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                        多智能体协作层                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                      MasterHabitAgent                             │  │
│  │                  (协调 16 个专业智能体)                            │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│       │         │         │         │         │         │         │     │
│  ┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌──────┐  │
│  │健康    ││饮食    ││睡眠    ││社交    ││娱乐    ││学习    ││ ...  │  │
│  │健身    ││营养    ││休息    ││沟通    ││休闲    ││教育    ││(+8)  │  │
│  └────────┘└────────┘└────────┘└────────┘└────────┘└────────┘└──────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                          数据处理层                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  摄像头采集  │  │  HAR 服务    │  │  记忆系统    │  │  Webhooks  │  │
│  │  (Camera)    │  │ (120+ 活动)  │  │  (Memory)    │  │  & Skills  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
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

### 完整活动列表（120+）

<details>
<summary>点击展开所有活动</summary>

#### 健康健身 (10)
锻炼、步行、跑步、骑行、游泳、瑜伽、拉伸、力量训练、球类运动、爬楼梯

#### 饮食营养 (10)
早餐、午餐、晚餐、零食、喝水、喝咖啡、喝茶、饮酒、烹饪、点外卖

#### 睡眠休息 (8)
上床、入睡、醒来、起床、午睡、休息、失眠、夜间醒来

#### 社交沟通 (10)
打电话、视频通话、发消息、见面、聚会、家庭时光、约会、社交网络、在线聊天、社交媒体

#### 娱乐休闲 (13)
看电视、看电影、玩游戏、听音乐、读书、上网浏览、看视频、摄影、绘画、演奏乐器、园艺、手工、收藏

#### 学习教育 (12)
学习、上课、在线学习、阅读教材、做作业、做笔记、复习、练习、研究、写论文、编程学习、语言学习

#### 财务购物 (10)
网购、线下购物、买菜、缴费、银行业务、投资、预算、比价、退换货、使用优惠券

#### 家居环境 (13)
打扫、吸尘、拖地、洗衣服、叠衣服、熨烫、洗碗、整理、倒垃圾、浇花、宠物护理、家居维修、装饰

#### 交通出行 (12)
通勤、开车、乘公交、乘地铁、打车、骑自行车、骑电动车、步行出行、乘飞机、乘火车、旅行、出差

#### 个人护理 (16)
刷牙、牙线、漱口水、洗脸、洗澡、泡澡、洗头、护肤、剃须、化妆、指甲护理、发型整理、理发、体检、服药、如厕

#### 工作效率 (13)
工作、电脑工作、打字、写作、开会、演示、头脑风暴、计划、处理邮件、工作电话、深度工作、休息、拖延

#### 情绪健康 (11)
冥想、深呼吸、写日记、心理咨询、放松、哭泣、大笑、减压、感恩练习、自我反思、情绪记录

</details>

### 主动提醒示例

| 场景 | 触发条件 | 提醒内容 |
|------|---------|---------|
| 忘记刷牙 | 9:00 前无刷牙记录 | "别忘了刷牙！" |
| 久坐提醒 | 坐着超过 2 小时 | "该起来活动一下了！" |
| 出门检查 | 检测到出门动作 | "钥匙、手机、钱包带了吗？" |
| 喝水提醒 | 2 小时无喝水记录 | "记得喝水！" |
| 睡眠提醒 | 晚上 11:00 | "该准备休息了" |
| 服药提醒 | 预设时间 | "该吃药了" |

### 数字孪生概念

该系统旨在通过以下方式创建用户的**数字孪生**：

1. **记录**：通过摄像头采集所有行为
2. **分析**：使用 AI（HAR 服务）识别活动
3. **学习**：随时间学习模式和偏好
4. **预测**：预测需求并提供主动帮助
5. **复制**：在数字模型中复制用户习惯

### 项目结构

```
openclaw-lifelog/
├── README.md                 # 项目说明（双语）
├── LICENSE                   # MIT 许可证
├── agents/                   # 16 个 Agent 定义
│   ├── master-habit/         # 主习惯管理
│   ├── health-fitness/       # 健康健身
│   ├── nutrition-diet/       # 饮食营养
│   ├── sleep-rest/           # 睡眠休息
│   ├── social-communication/ # 社交沟通
│   ├── entertainment-leisure/# 娱乐休闲
│   ├── learning-education/   # 学习教育
│   ├── finance-shopping/     # 财务购物
│   ├── home-environment/     # 家居环境
│   ├── transportation-travel/# 交通出行
│   ├── personal-care/        # 个人护理
│   ├── productivity-focus/   # 工作效率
│   ├── emotional-wellness/   # 情绪健康
│   ├── morning-routine/      # 晨间习惯
│   ├── departure/            # 出门准备
│   └── ...
├── configs/                  # 配置文件
├── skills/                   # 自定义技能
├── services/har/             # HAR 服务 (120+ 活动)
├── scripts/                  # 安装脚本
└── docs/                     # 文档
```

### 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

---

## Contact / 联系方式

If you have any questions or suggestions, please submit an [Issue](https://github.com/Eli-yu-first/openclaw-lifelog/issues).

如有问题或建议，请提交 [Issue](https://github.com/Eli-yu-first/openclaw-lifelog/issues)。
