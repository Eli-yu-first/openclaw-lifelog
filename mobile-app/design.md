# openclaw-lifelog — Mobile App Interface Design

## Brand Identity
- **App Name**: OpenClaw LifeLog
- **Tagline**: 你的 AI 生活与健康管家
- **Design Philosophy**: Apple Health 极简美学 + Bento Box 卡片布局 + 局部毛玻璃（Glassmorphism）

---

## Color System

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| background | #F8F9FB | #0E0F11 | 屏幕背景 |
| surface | #FFFFFF | #1A1B1E | 卡片/面板背景 |
| surface2 | #F2F3F7 | #242629 | 次级卡片背景 |
| foreground | #0D0F12 | #F0F1F3 | 主要文字 |
| muted | #8A8F9A | #5E6370 | 次要文字 |
| primary | #5B6EFF | #7B8FFF | 品牌主色（靛蓝紫） |
| accent | #FF6B9D | #FF8DB5 | 强调色（玫瑰粉） |
| ring1 | #5B6EFF | #7B8FFF | 专注圆环 |
| ring2 | #FF6B9D | #FF8DB5 | 体态圆环 |
| ring3 | #00D4AA | #00E8BB | 水分圆环 |
| border | #E8EAEF | #2A2C31 | 边框/分割线 |
| glass | rgba(255,255,255,0.72) | rgba(20,21,24,0.72) | 毛玻璃背景 |

---

## Screen List

### Tab 1 — 今天 (Today)
- **全息状态岛**: 顶部 1/4，动态 2D 表情 + AI 问候语 + 毛玻璃悬浮效果
- **健康三环**: 专注时长、体态达标率、水分补充（Apple Watch 风格渐变圆环）
- **Bento 卡片流**: 环境与穿搭建议、久坐提醒、快捷微指令
- **Lifelog 时间线**: 垂直时间轴，摄像头捕捉的关键事件

### Tab 2 — 健康 (Health)
- **体态与骨骼肌健康**: 骨骼热力图 + 每日姿势得分柱状图
- **用药与饮水依从性**: 极简打卡日历 + 药品清单
- **眼部疲劳监测**: 趋势折线图 + 20-20-20 提醒
- **情绪与压力波形**: 平滑波浪形图表

### Tab 3 — 洞察 (Insights)
- **行为交叉分析**: 大字号数据卡片 + 对比图表
- **专注力热力图**: GitHub Contributions 风格网格
- **周期性健康周报**: 横向滑动精美卡片流
- **异常状态预警**: 红色/橙色警告卡片

### Tab 4 — 陪伴 (Companion)
- **多模态对话流**: 气泡界面 + 文本/语音输入
- **主动关怀推送**: 非侵入式横幅
- **专属记忆库**: 瀑布流卡片墙

### Tab 5 — 设备 (Device)
- **视觉模型配置**: 带性能预估进度条的选择器
- **绝对隐私屏障**: 安全盾牌图标 + 红绿状态灯
- **表情引擎商店**: 轮播图展示不同表情主题

---

## Key User Flows

### 主流程：查看今日状态
1. 打开 App → Today 页面
2. 顶部表情区域展示 AI 当前状态（观察中/分析中/休眠）
3. 三个健康圆环一目了然
4. 下滑查看 Bento 卡片（环境建议、久坐提醒）
5. 继续下滑查看 Lifelog 时间线

### 健康数据查看
1. 切换到 Health Tab
2. 查看体态热力图
3. 点击用药打卡
4. 查看眼部疲劳趋势

### AI 对话
1. 切换到 Companion Tab
2. 输入文字或语音
3. AI 回复（可引用时间线画面）
4. 收藏高光时刻到记忆库

---

## Layout Principles

- **Bento Box**: 卡片使用 2 列网格，重要卡片跨 2 列
- **呼吸感**: 卡片间距 12px，内边距 16-20px，圆角 16-20px
- **毛玻璃**: 仅用于顶部状态岛和悬浮操作栏，不过度使用
- **阴影**: 轻柔阴影 `shadowColor: #000, shadowOpacity: 0.06, shadowRadius: 12`
- **字体**: SF Pro Display（iOS 系统字体），标题 28px Bold，正文 15px Regular
- **动画**: 圆环渐入 800ms，卡片 stagger 进场 100ms 间隔
