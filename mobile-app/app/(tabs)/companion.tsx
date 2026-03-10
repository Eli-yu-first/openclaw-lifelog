/**
 * 陪伴 (Companion) — openclaw-lifelog 自然语言交互中心 v1.1
 * 变更：新输入框样式、电话功能（含视频/摄像头选择）、朗读开关、增强动态效果
 */
import React, { useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { GlassView } from "@/components/ui/glass-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColors } from "@/hooks/use-theme-colors";
import Svg, { Path, Circle, Line, Polyline, Rect } from "react-native-svg";

// ─── 类型定义 ─────────────────────────────────────────────────────────────────

type TabType = "chat" | "memories";

interface ChatMessage {
  id: string;
  role: "user" | "nomi";
  content: string;
  time: string;
  attachment?: string;
}

interface MemoryCard {
  id: string;
  date: string;
  title: string;
  desc: string;
  emoji: string;
  color: string;
}

// ─── 初始数据 ─────────────────────────────────────────────────────────────────

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "1", role: "nomi", content: "你好！我是 Nomi 🐾 我一直在陪伴你。今天的专注时长已经达到 68%，你做得很棒！有什么我可以帮你的吗？", time: "09:00" },
  { id: "2", role: "user", content: "我最近总感觉下午很疲惫，有什么建议吗？", time: "09:15" },
  { id: "3", role: "nomi", content: "根据我的观察，你通常在 14:00-15:00 之间压力最高，且这段时间饮水量明显不足。\n\n建议：\n• 在 13:30 提前补充水分\n• 14:00 进行 5 分钟的深呼吸练习\n• 安排较轻松的任务在这个时段\n\n我已经为你设置了下午的温和提醒 ✨", time: "09:15" },
  { id: "4", role: "user", content: "我这个坐姿对不对？", time: "10:45", attachment: "📸 截取当前画面" },
  { id: "5", role: "nomi", content: "我看了一下你当前的坐姿 👀\n\n检测结果：\n✅ 背部基本挺直\n⚠️ 头部略微前倾约 15°\n⚠️ 左肩比右肩低约 5°\n\n建议将显示器上移 3-5cm，可以有效改善颈部前倾问题。你已经连续工作 90 分钟了，现在起来活动一下吧！", time: "10:45" },
];

const MEMORY_CARDS: MemoryCard[] = [
  { id: "1", date: "2026年3月8日", title: "第一次专注达标 🏆", desc: "今天专注时长首次突破 8 小时，Nomi 为你庆祝！", emoji: "🏆", color: "#FFD93D" },
  { id: "2", date: "2026年3月5日", title: "连续用药 30 天", desc: "维生素 D3 服用依从性达到 100%，健康习惯已养成", emoji: "💊", color: "#00D4AA" },
  { id: "3", date: "2026年2月28日", title: "最佳坐姿周", desc: "本周坐姿达标率 92%，颈椎疲劳指数创历史新低", emoji: "🧘", color: "#5B6EFF" },
  { id: "4", date: "2026年2月20日", title: "情绪稳定里程碑", desc: "连续 14 天情绪稳定度评级 A，压力管理能力显著提升", emoji: "😊", color: "#FF6B9D" },
  { id: "5", date: "2026年2月14日", title: "情人节的专注", desc: "在特别的日子里，你依然保持了 6 小时的深度工作", emoji: "❤️", color: "#FF5A5A" },
  { id: "6", date: "2026年2月1日", title: "新月计划启动", desc: "开始了 openclaw-lifelog 的健康记录之旅", emoji: "🌱", color: "#6BCB77" },
];

// ─── 电话功能弹窗 ─────────────────────────────────────────────────────────────

function CallModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const colors = useThemeColors();
  const [callActive, setCallActive] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [cameraSource, setCameraSource] = useState<"device" | "phone">("phone");
  const [callDuration, setCallDuration] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCall = () => {
    setCallActive(true);
    timerRef.current = setInterval(() => {
      setCallDuration((d) => d + 1);
    }, 1000);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const endCall = () => {
    setCallActive(false);
    setCallDuration(0);
    if (timerRef.current) clearInterval(timerRef.current);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onClose();
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.callOverlay}>
        <LinearGradient
          colors={["#1A1A2E", "#16213E", "#0F3460"]}
          style={styles.callSheet}
        >
          {/* Nomi 头像 */}
          <View style={styles.callAvatarWrapper}>
            <LinearGradient colors={["#5B6EFF40", "#FF6B9D30"]} style={styles.callAvatarGlow} />
            <Text style={styles.callAvatar}>🐾</Text>
          </View>
          <Text style={styles.callName}>Nomi</Text>
          <Text style={styles.callStatus}>
            {callActive ? formatDuration(callDuration) : "AI 健康伴侣"}
          </Text>

          {/* 视频开关 */}
          {callActive && (
            <View style={styles.callVideoSection}>
              <Pressable
                style={[styles.callVideoBtn, { backgroundColor: videoEnabled ? "#5B6EFF30" : "#FFFFFF15" }]}
                onPress={() => {
                  setVideoEnabled(!videoEnabled);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={styles.callVideoBtnIcon}>{videoEnabled ? "📹" : "📷"}</Text>
                <Text style={styles.callVideoBtnText}>{videoEnabled ? "关闭视频" : "开启视频"}</Text>
              </Pressable>

              {videoEnabled && (
                <View style={styles.cameraSourceRow}>
                  <Text style={styles.cameraSourceLabel}>摄像头来源：</Text>
                  {(["phone", "device"] as const).map((src) => (
                    <Pressable
                      key={src}
                      style={[
                        styles.cameraSourceBtn,
                        { backgroundColor: cameraSource === src ? "#5B6EFF" : "#FFFFFF20" },
                      ]}
                      onPress={() => {
                        setCameraSource(src);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <Text style={styles.cameraSourceBtnText}>
                        {src === "phone" ? "📱 手机" : "📡 设备"}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* 操作按钮 */}
          <View style={styles.callActions}>
            {!callActive ? (
              <Pressable
                style={[styles.callActionBtn, { backgroundColor: "#00D4AA" }]}
                onPress={startCall}
              >
                <Text style={styles.callActionIcon}>📞</Text>
                <Text style={styles.callActionText}>接通</Text>
              </Pressable>
            ) : (
              <Pressable
                style={[styles.callActionBtn, { backgroundColor: "#FF5A5A" }]}
                onPress={endCall}
              >
                <Text style={styles.callActionIcon}>📵</Text>
                <Text style={styles.callActionText}>挂断</Text>
              </Pressable>
            )}
            {!callActive && (
              <Pressable
                style={[styles.callActionBtn, { backgroundColor: "#FFFFFF20" }]}
                onPress={onClose}
              >
                <Text style={styles.callActionIcon}>✕</Text>
                <Text style={styles.callActionText}>取消</Text>
              </Pressable>
            )}
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

// ─── 主动关怀横幅 ─────────────────────────────────────────────────────────────

function CareBanner() {
  const colors = useThemeColors();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Animated.View entering={FadeInDown.springify()}>
      <LinearGradient colors={["#5B6EFF18", "#FF6B9D12"]} style={styles.careBanner}>
        <Text style={styles.careBannerEmoji}>🌤️</Text>
        <View style={styles.careBannerContent}>
          <Text style={[styles.careBannerTitle, { color: colors.foreground }]}>天气提醒</Text>
          <Text style={[styles.careBannerDesc, { color: colors.muted }]}>今日气温下降 8°C，出门记得带外套</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.careBannerClose, pressed && { opacity: 0.6 }]}
          onPress={() => setVisible(false)}
        >
          <IconSymbol name="xmark" size={14} color={colors.muted} />
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
}

// ─── 对话气泡 ─────────────────────────────────────────────────────────────────

function ChatBubble({ message }: { message: ChatMessage }) {
  const colors = useThemeColors();
  const isNomi = message.role === "nomi";

  return (
    <Animated.View entering={FadeInDown.springify()} style={[styles.bubbleRow, isNomi ? styles.bubbleRowNomi : styles.bubbleRowUser]}>
      {isNomi && (
        <View style={styles.nomiAvatar}>
          <Text style={styles.nomiAvatarEmoji}>🐾</Text>
        </View>
      )}
      <View style={styles.bubbleContent}>
        {message.attachment && (
          <View style={[styles.attachmentBadge, { backgroundColor: colors.surface2 }]}>
            <Text style={[styles.attachmentText, { color: colors.muted }]}>{message.attachment}</Text>
          </View>
        )}
        <View style={[styles.bubble, isNomi ? [styles.bubbleNomi, { backgroundColor: colors.surface }] : [styles.bubbleUser, { backgroundColor: "#5B6EFF" }]]}>
          <Text style={[styles.bubbleText, { color: isNomi ? colors.foreground : "#FFFFFF" }]}>
            {message.content}
          </Text>
        </View>
        <Text style={[styles.bubbleTime, { color: colors.muted }]}>{message.time}</Text>
      </View>
    </Animated.View>
  );
}

// ─── 新版输入栏（对应用户上传的样式）────────────────────────────────────────

function NewInputBar({ onSend }: { onSend: (text: string) => void }) {
  const colors = useThemeColors();
  const [inputText, setInputText] = useState("");
  const sendScale = useSharedValue(1);

  const sendAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendScale.value }],
  }));

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSend(inputText);
    setInputText("");
    sendScale.value = withSpring(0.85, { damping: 10 }, () => {
      sendScale.value = withSpring(1, { damping: 12 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.newInputWrapper, { backgroundColor: colors.background }]}>
      {/* 快捷提问 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickQuestionsRow}
      >
        {["我今天状态怎么样？", "帮我分析坐姿", "给我放松建议", "今日健康总结"].map((q) => (
          <Pressable
            key={q}
            style={({ pressed }) => [
              styles.quickQuestion,
              { backgroundColor: colors.surface2 },
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => setInputText(q)}
          >
            <Text style={[styles.quickQuestionText, { color: colors.muted }]}>{q}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* 主输入栏 — 对应用户上传的样式 */}
      <View style={[styles.newInputBar, { backgroundColor: colors.surface, shadowColor: "#000" }]}>
        {/* 左侧图片图标 */}
        <Pressable
          style={({ pressed }) => [styles.inputSideIcon, pressed && { opacity: 0.6 }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="3" width="18" height="18" rx="3" stroke={colors.muted} strokeWidth={1.5} />
            <Circle cx="8.5" cy="8.5" r="1.5" fill={colors.muted} />
            <Path d="M3 15L8 10L12 14L16 10L21 15" stroke={colors.muted} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>

        {/* 麦克风图标 */}
        <Pressable
          style={({ pressed }) => [styles.inputSideIcon, pressed && { opacity: 0.6 }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Rect x="9" y="2" width="6" height="11" rx="3" stroke={colors.muted} strokeWidth={1.5} />
            <Path d="M5 10C5 14.4 8.1 18 12 18C15.9 18 19 14.4 19 10" stroke={colors.muted} strokeWidth={1.5} strokeLinecap="round" />
            <Line x1="12" y1="18" x2="12" y2="22" stroke={colors.muted} strokeWidth={1.5} strokeLinecap="round" />
            <Line x1="9" y1="22" x2="15" y2="22" stroke={colors.muted} strokeWidth={1.5} strokeLinecap="round" />
          </Svg>
        </Pressable>

        {/* 文本输入 */}
        <TextInput
          style={[styles.newInput, { color: colors.foreground }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="问问你的健康管家..."
          placeholderTextColor={colors.muted}
          multiline
          maxLength={500}
          returnKeyType="done"
          onSubmitEditing={handleSend}
        />

        {/* 发送按钮 */}
        <Animated.View style={sendAnimStyle}>
          <Pressable
            style={({ pressed }) => [
              styles.newSendBtn,
              { backgroundColor: inputText.trim() ? "#5B6EFF18" : "transparent" },
              pressed && { opacity: 0.7 },
            ]}
            onPress={handleSend}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M22 2L11 13"
                stroke={inputText.trim() ? "#5B6EFF" : colors.muted}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M22 2L15 22L11 13L2 9L22 2Z"
                stroke={inputText.trim() ? "#5B6EFF" : colors.muted}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

// ─── 聊天界面 ─────────────────────────────────────────────────────────────────

function ChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    };
    const nomiReply: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "nomi",
      content: "收到你的消息了！我正在分析你的生活数据，为你提供个性化建议... ✨",
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg, nomiReply]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.chatContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={120}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      <NewInputBar onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}

// ─── 记忆库 ───────────────────────────────────────────────────────────────────

function MemoriesTab() {
  const colors = useThemeColors();

  return (
    <ScrollView
      style={styles.memoriesScroll}
      contentContainerStyle={styles.memoriesContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.memoriesGrid}>
        {MEMORY_CARDS.map((card, index) => (
          <Pressable
            key={card.id}
            style={({ pressed }) => [
              styles.memoryCard,
              {
                backgroundColor: colors.surface,
                borderColor: `${card.color}40`,
                flex: index % 3 === 0 ? undefined : 1,
                width: index % 3 === 0 ? "100%" : undefined,
              },
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
          >
            <LinearGradient colors={[`${card.color}20`, "transparent"]} style={styles.memoryCardGradient}>
              <Text style={styles.memoryEmoji}>{card.emoji}</Text>
              <Text style={[styles.memoryDate, { color: colors.muted }]}>{card.date}</Text>
              <Text style={[styles.memoryTitle, { color: colors.foreground }]}>{card.title}</Text>
              <Text style={[styles.memoryDesc, { color: colors.muted }]}>{card.desc}</Text>
            </LinearGradient>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── 主页面 ───────────────────────────────────────────────────────────────────

export default function CompanionScreen() {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [callVisible, setCallVisible] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(false);

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* 页面标题 + 电话 + 朗读 */}
      <View style={[styles.pageHeader, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.pageTitle, { color: colors.foreground }]}>陪伴</Text>
          <Text style={[styles.pageSubtitle, { color: colors.muted }]}>Nomi · 你的 AI 伙伴</Text>
        </View>
        <View style={styles.headerActions}>
          {/* 朗读开关 */}
          <Pressable
            style={({ pressed }) => [
              styles.headerIconBtn,
              { backgroundColor: speakEnabled ? "#5B6EFF18" : colors.surface2 },
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => {
              setSpeakEnabled(!speakEnabled);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M11 5L6 9H2V15H6L11 19V5Z"
                stroke={speakEnabled ? "#5B6EFF" : colors.muted}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={speakEnabled ? "#5B6EFF30" : "none"}
              />
              {speakEnabled ? (
                <>
                  <Path d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53" stroke="#5B6EFF" strokeWidth={1.8} strokeLinecap="round" />
                  <Path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="#5B6EFF" strokeWidth={1.8} strokeLinecap="round" />
                </>
              ) : (
                <Line x1="23" y1="9" x2="17" y2="15" stroke={colors.muted} strokeWidth={1.8} strokeLinecap="round" />
              )}
            </Svg>
          </Pressable>

          {/* 电话按钮 */}
          <Pressable
            style={({ pressed }) => [
              styles.headerIconBtn,
              { backgroundColor: "#00D4AA18" },
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => {
              setCallVisible(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M22 16.92V19.92C22 20.4835 21.7893 21.0235 21.4142 21.4142C21.0391 21.8049 20.5304 22.0435 19.97 22.07C16.4 22.3 12.97 21.17 10.22 18.78C7.68 16.59 5.77 13.68 4.93 10.42C4.65 9.23 4.65 7.99 4.93 6.8C5.21 5.61 5.93 4.57 6.95 3.9L9.95 2.1C10.4 1.83 10.94 1.83 11.39 2.1L14.39 3.9C14.84 4.17 15.12 4.65 15.12 5.17V8.17C15.12 8.69 14.84 9.17 14.39 9.44L12.89 10.34C13.5 11.82 14.48 13.12 15.72 14.12L16.62 12.62C16.89 12.17 17.37 11.89 17.89 11.89H20.89C21.41 11.89 21.89 12.17 22.16 12.62L22.16 16.92Z"
                stroke="#00D4AA"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="#00D4AA20"
              />
            </Svg>
          </Pressable>

          {/* 在线状态 */}
          <View style={styles.nomiStatusBadge}>
            <View style={styles.nomiStatusDot} />
            <Text style={[styles.nomiStatusText, { color: "#00D4AA" }]}>在线</Text>
          </View>
        </View>
      </View>

      {/* 关怀横幅 */}
      <View style={styles.bannerWrapper}>
        <CareBanner />
      </View>

      {/* Tab 切换 */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface2 }]}>
        {(["chat", "memories"] as TabType[]).map((tab) => (
          <Pressable
            key={tab}
            style={({ pressed }) => [
              styles.tabBtn,
              activeTab === tab && [styles.tabBtnActive, { backgroundColor: colors.surface }],
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => {
              setActiveTab(tab);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={[styles.tabBtnText, { color: activeTab === tab ? colors.foreground : colors.muted }]}>
              {tab === "chat" ? "💬 对话" : "✨ 记忆库"}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* 内容区 */}
      {activeTab === "chat" ? <ChatTab /> : <MemoriesTab />}

      {/* 电话弹窗 */}
      <CallModal visible={callVisible} onClose={() => setCallVisible(false)} />
    </ScreenContainer>
  );
}

// ─── 样式 ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pageTitle: { fontSize: 32, fontWeight: "800", letterSpacing: -1 },
  pageSubtitle: { fontSize: 14, marginTop: 2 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  nomiStatusBadge: { flexDirection: "row", alignItems: "center", gap: 6 },
  nomiStatusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#00D4AA" },
  nomiStatusText: { fontSize: 13, fontWeight: "600" },

  bannerWrapper: { paddingHorizontal: 16, paddingTop: 10 },
  careBanner: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 14 },
  careBannerEmoji: { fontSize: 24 },
  careBannerContent: { flex: 1 },
  careBannerTitle: { fontSize: 13, fontWeight: "600" },
  careBannerDesc: { fontSize: 14, marginTop: 2 },
  careBannerClose: { padding: 4 },

  tabBar: { flexDirection: "row", marginHorizontal: 16, marginTop: 10, borderRadius: 12, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  tabBtnActive: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  tabBtnText: { fontSize: 13, fontWeight: "600" },

  // 聊天
  chatContainer: { flex: 1 },
  chatList: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  bubbleRow: { flexDirection: "row", gap: 8 },
  bubbleRowNomi: { alignItems: "flex-start" },
  bubbleRowUser: { flexDirection: "row-reverse" },
  nomiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#5B6EFF18", alignItems: "center", justifyContent: "center", marginTop: 4 },
  nomiAvatarEmoji: { fontSize: 16 },
  bubbleContent: { maxWidth: "75%", gap: 4 },
  attachmentBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, marginBottom: 4 },
  attachmentText: { fontSize: 12 },
  bubble: { borderRadius: 18, padding: 12 },
  bubbleNomi: { borderTopLeftRadius: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  bubbleUser: { borderTopRightRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTime: { fontSize: 13, alignSelf: "flex-end" },

  // 新版输入栏
  newInputWrapper: { paddingBottom: 8 },
  quickQuestionsRow: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  quickQuestion: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  quickQuestionText: { fontSize: 14, fontWeight: "500" },

  newInputBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 28,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  inputSideIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  newInput: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    maxHeight: 100,
    paddingVertical: 0,
  },
  newSendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  // 记忆库
  memoriesScroll: { flex: 1 },
  memoriesContent: { padding: 16 },
  memoriesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  memoryCard: { borderRadius: 16, overflow: "hidden", borderWidth: 1, minHeight: 120 },
  memoryCardGradient: { padding: 14, gap: 4 },
  memoryEmoji: { fontSize: 28, marginBottom: 4 },
  memoryDate: { fontSize: 13, fontWeight: "500" },
  memoryTitle: { fontSize: 14, fontWeight: "700" },
  memoryDesc: { fontSize: 14, lineHeight: 17 },

  // 电话弹窗
  callOverlay: { flex: 1, backgroundColor: "#00000060", justifyContent: "flex-end" },
  callSheet: { borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 32, paddingBottom: 48, alignItems: "center" },
  callAvatarWrapper: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center", marginBottom: 16, overflow: "hidden" },
  callAvatarGlow: { position: "absolute", width: 100, height: 100, borderRadius: 50 },
  callAvatar: { fontSize: 52 },
  callName: { fontSize: 24, fontWeight: "700", color: "#FFFFFF", marginBottom: 6 },
  callStatus: { fontSize: 15, color: "#FFFFFF80", marginBottom: 24 },
  callVideoSection: { width: "100%", marginBottom: 24, gap: 12 },
  callVideoBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 12, borderRadius: 16 },
  callVideoBtnIcon: { fontSize: 20 },
  callVideoBtnText: { fontSize: 15, color: "#FFFFFF", fontWeight: "600" },
  cameraSourceRow: { flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "center" },
  cameraSourceLabel: { fontSize: 13, color: "#FFFFFF80" },
  cameraSourceBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  cameraSourceBtnText: { fontSize: 13, color: "#FFFFFF", fontWeight: "600" },
  callActions: { flexDirection: "row", gap: 16 },
  callActionBtn: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", gap: 4 },
  callActionIcon: { fontSize: 28 },
  callActionText: { fontSize: 14, color: "#FFFFFF", fontWeight: "600" },
});
