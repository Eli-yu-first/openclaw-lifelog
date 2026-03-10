/**
 * 陪伴 (Companion) — openclaw-lifelog v2.0
 * Apple Health 级精致设计：毛玻璃面板、精致动画、统一图标、专业排版
 */
import React, { useRef, useState } from "react";
import {
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
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useSettings } from "@/lib/settings-context";
import Svg, { Path, Circle, Line, Rect } from "react-native-svg";

const AH = {
  pink: "#FF2D55", green: "#30D158", cyan: "#00C7BE", blue: "#007AFF",
  orange: "#FF9500", red: "#FF3B30", purple: "#AF52DE", yellow: "#FFD60A",
  indigo: "#5856D6", teal: "#5AC8FA",
};

// ─── 类型定义 ────────────────────────────────────────────────────────────────

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

// ─── 初始数据 ────────────────────────────────────────────────────────────────

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "1", role: "nomi", content: "你好！我是 Nomi 🐾 我一直在陪伴你。今天的专注时长已经达到 68%，你做得很棒！有什么我可以帮你的吗？", time: "09:00" },
  { id: "2", role: "user", content: "我最近总感觉下午很疲惫，有什么建议吗？", time: "09:15" },
  { id: "3", role: "nomi", content: "根据我的观察，你通常在 14:00-15:00 之间压力最高，且这段时间饮水量明显不足。\n\n建议：\n• 在 13:30 提前补充水分\n• 14:00 进行 5 分钟的深呼吸练习\n• 安排较轻松的任务在这个时段\n\n我已经为你设置了下午的温和提醒 ✨", time: "09:15" },
  { id: "4", role: "user", content: "我这个坐姿对不对？", time: "10:45", attachment: "📸 截取当前画面" },
  { id: "5", role: "nomi", content: "我看了一下你当前的坐姿 👀\n\n检测结果：\n✅ 背部基本挺直\n⚠️ 头部略微前倾约 15°\n⚠️ 左肩比右肩低约 5°\n\n建议将显示器上移 3-5cm，可以有效改善颈部前倾问题。你已经连续工作 90 分钟了，现在起来活动一下吧！", time: "10:45" },
];

const MEMORY_CARDS: MemoryCard[] = [
  { id: "1", date: "2026年3月8日", title: "第一次专注达标 🏆", desc: "今天专注时长首次突破 8 小时，Nomi 为你庆祝！", emoji: "🏆", color: AH.yellow },
  { id: "2", date: "2026年3月5日", title: "连续用药 30 天", desc: "维生素 D3 服用依从性达到 100%，健康习惯已养成", emoji: "💊", color: AH.green },
  { id: "3", date: "2026年2月28日", title: "最佳坐姿周", desc: "本周坐姿达标率 92%，颈椎疲劳指数创历史新低", emoji: "🧘", color: AH.blue },
  { id: "4", date: "2026年2月20日", title: "情绪稳定里程碑", desc: "连续 14 天情绪稳定度评级 A，压力管理能力显著提升", emoji: "😊", color: AH.pink },
  { id: "5", date: "2026年2月14日", title: "情人节的专注", desc: "在特别的日子里，你依然保持了 6 小时的深度工作", emoji: "❤️", color: AH.red },
  { id: "6", date: "2026年2月1日", title: "新月计划启动", desc: "开始了 openclaw-lifelog 的健康记录之旅", emoji: "🌱", color: AH.green },
];

// ─── GlassPanel ─────────────────────────────────────────────────────────────

function GlassPanel({ children, style }: { children: React.ReactNode; style?: any }) {
  const colors = useThemeColors();
  const inner = (
    <View style={[{
      backgroundColor: Platform.OS !== "web" ? `${colors.surface}E6` : `${colors.surface}F2`,
      borderRadius: 20, borderWidth: 0.5, borderColor: `${colors.border}40`,
      shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05, shadowRadius: 16, elevation: 3,
    }, style]}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: "#FFFFFF20", borderTopLeftRadius: 20, borderTopRightRadius: 20 }} />
      {children}
    </View>
  );
  if (Platform.OS !== "web") {
    return (
      <View style={{ borderRadius: 20, overflow: "hidden", marginBottom: 12 }}>
        <BlurView intensity={40} tint="light" style={{ borderRadius: 20, overflow: "hidden" }}>
          {inner}
        </BlurView>
      </View>
    );
  }
  return <View style={{ marginBottom: 12 }}>{inner}</View>;
}

// ─── 电话功能弹窗 ────────────────────────────────────────────────────────────

function CallModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const colors = useThemeColors();
  const [callActive, setCallActive] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [cameraSource, setCameraSource] = useState<"device" | "phone">("phone");
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCall = () => {
    setCallActive(true);
    timerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const endCall = () => {
    setCallActive(false);
    setCallDuration(0);
    if (timerRef.current) clearInterval(timerRef.current);
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onClose();
  };

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.callOverlay}>
        <LinearGradient colors={["#0A1628", "#0F2847", "#162D50"]} style={s.callSheet}>
          <View style={s.callAvatarWrap}>
            <LinearGradient colors={[`${AH.blue}40`, `${AH.purple}30`]} style={s.callAvatarGlow} />
            <Text style={s.callAvatar}>🐾</Text>
          </View>
          <Text style={s.callName}>Nomi</Text>
          <Text style={s.callStatus}>{callActive ? fmt(callDuration) : "AI 健康伴侣"}</Text>

          {callActive && (
            <Animated.View entering={FadeInUp.duration(300)} style={s.callVideoSection}>
              <Pressable
                style={({ pressed }) => [s.callVideoBtn, { backgroundColor: videoEnabled ? `${AH.blue}30` : "#FFFFFF12" }, pressed && { opacity: 0.7 }]}
                onPress={() => { setVideoEnabled(!videoEnabled); if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              >
                <IconSymbol name={videoEnabled ? "video.fill" as any : "video.slash.fill" as any} size={20} color="#FFF" />
                <Text style={s.callVideoBtnText}>{videoEnabled ? "关闭视频" : "开启视频"}</Text>
              </Pressable>
              {videoEnabled && (
                <View style={s.cameraSourceRow}>
                  <Text style={s.cameraSourceLabel}>摄像头来源：</Text>
                  {(["phone", "device"] as const).map((src) => (
                    <Pressable key={src} style={[s.cameraSourceBtn, { backgroundColor: cameraSource === src ? AH.blue : "#FFFFFF18" }]}
                      onPress={() => { setCameraSource(src); if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
                      <Text style={s.cameraSourceBtnText}>{src === "phone" ? "📱 手机" : "📡 设备"}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </Animated.View>
          )}

          <View style={s.callActions}>
            {!callActive ? (
              <>
                <Pressable style={[s.callActionBtn, { backgroundColor: AH.green }]} onPress={startCall}>
                  <IconSymbol name="phone.fill" size={28} color="#FFF" />
                  <Text style={s.callActionText}>接通</Text>
                </Pressable>
                <Pressable style={[s.callActionBtn, { backgroundColor: "#FFFFFF18" }]} onPress={onClose}>
                  <IconSymbol name="xmark" size={24} color="#FFF" />
                  <Text style={s.callActionText}>取消</Text>
                </Pressable>
              </>
            ) : (
              <Pressable style={[s.callActionBtn, { backgroundColor: AH.red }]} onPress={endCall}>
                <IconSymbol name="phone.down.fill" size={28} color="#FFF" />
                <Text style={s.callActionText}>挂断</Text>
              </Pressable>
            )}
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

// ─── 主动关怀横幅 ────────────────────────────────────────────────────────────

function CareBanner() {
  const colors = useThemeColors();
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <Animated.View entering={FadeInDown.duration(500)}>
      <GlassPanel style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14 }}>
        <View style={[s.bannerIconWrap, { backgroundColor: `${AH.orange}14` }]}>
          <IconSymbol name="cloud.sun.fill" size={18} color={AH.orange} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.bannerTitle, { color: colors.foreground }]}>天气提醒</Text>
          <Text style={[s.bannerDesc, { color: colors.muted }]}>今日气温下降 8°C，出门记得带外套</Text>
        </View>
        <Pressable style={({ pressed }) => [s.bannerClose, pressed && { opacity: 0.5 }]} onPress={() => setVisible(false)}>
          <IconSymbol name="xmark" size={12} color={colors.muted} />
        </Pressable>
      </GlassPanel>
    </Animated.View>
  );
}

// ─── 对话气泡 ────────────────────────────────────────────────────────────────

function ChatBubble({ message }: { message: ChatMessage }) {
  const colors = useThemeColors();
  const isNomi = message.role === "nomi";

  return (
    <Animated.View entering={FadeInDown.duration(400)} style={[s.bubbleRow, isNomi ? s.bubbleRowNomi : s.bubbleRowUser]}>
      {isNomi && (
        <View style={s.nomiAvatar}>
          <LinearGradient colors={[`${AH.blue}20`, `${AH.purple}15`]} style={StyleSheet.absoluteFill} />
          <Text style={s.nomiAvatarEmoji}>🐾</Text>
        </View>
      )}
      <View style={s.bubbleContent}>
        {message.attachment && (
          <View style={[s.attachBadge, { backgroundColor: `${colors.surface}E6` }]}>
            <Text style={[s.attachText, { color: colors.muted }]}>{message.attachment}</Text>
          </View>
        )}
        <View style={[
          s.bubble,
          isNomi
            ? { backgroundColor: `${colors.surface}F2`, borderTopLeftRadius: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }
            : { backgroundColor: AH.blue, borderTopRightRadius: 6 },
        ]}>
          <Text style={[s.bubbleText, { color: isNomi ? colors.foreground : "#FFFFFF" }]}>
            {message.content}
          </Text>
        </View>
        <Text style={[s.bubbleTime, { color: colors.muted }]}>{message.time}</Text>
      </View>
    </Animated.View>
  );
}

// ─── 精致输入栏 ──────────────────────────────────────────────────────────────

function InputBar({ onSend }: { onSend: (text: string) => void }) {
  const colors = useThemeColors();
  const [inputText, setInputText] = useState("");
  const sendScale = useSharedValue(1);
  const sendAnimStyle = useAnimatedStyle(() => ({ transform: [{ scale: sendScale.value }] }));

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSend(inputText);
    setInputText("");
    sendScale.value = withSpring(0.85, { damping: 10 }, () => { sendScale.value = withSpring(1, { damping: 12 }); });
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={s.inputWrapper}>
      {/* 快捷提问 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.quickRow}>
        {["我今天状态怎么样？", "帮我分析坐姿", "给我放松建议", "今日健康总结"].map((q) => (
          <Pressable key={q} style={({ pressed }) => [s.quickChip, { backgroundColor: `${colors.surface}F2`, borderColor: `${colors.border}40` }, pressed && { opacity: 0.7 }]}
            onPress={() => setInputText(q)}>
            <Text style={[s.quickChipText, { color: colors.muted }]}>{q}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* 主输入栏 — 浮岛风格 */}
      <View style={[s.inputBar, {
        backgroundColor: `${colors.surface}F8`,
        shadowColor: "#000",
        borderColor: `${colors.border}30`,
      }]}>
        <Pressable style={({ pressed }) => [s.inputIcon, pressed && { opacity: 0.5 }]}
          onPress={() => { if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="3" width="18" height="18" rx="3" stroke={colors.muted} strokeWidth={1.5} />
            <Circle cx="8.5" cy="8.5" r="1.5" fill={colors.muted} />
            <Path d="M3 15L8 10L12 14L16 10L21 15" stroke={colors.muted} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>

        <Pressable style={({ pressed }) => [s.inputIcon, pressed && { opacity: 0.5 }]}
          onPress={() => { if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Rect x="9" y="2" width="6" height="11" rx="3" stroke={colors.muted} strokeWidth={1.5} />
            <Path d="M5 10C5 14.4 8.1 18 12 18C15.9 18 19 14.4 19 10" stroke={colors.muted} strokeWidth={1.5} strokeLinecap="round" />
            <Line x1="12" y1="18" x2="12" y2="22" stroke={colors.muted} strokeWidth={1.5} strokeLinecap="round" />
            <Line x1="9" y1="22" x2="15" y2="22" stroke={colors.muted} strokeWidth={1.5} strokeLinecap="round" />
          </Svg>
        </Pressable>

        <TextInput
          style={[s.input, { color: colors.foreground }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="问问你的健康管家..."
          placeholderTextColor={`${colors.muted}80`}
          multiline
          maxLength={500}
          returnKeyType="done"
          onSubmitEditing={handleSend}
        />

        <Animated.View style={sendAnimStyle}>
          <Pressable style={({ pressed }) => [s.sendBtn, { backgroundColor: inputText.trim() ? `${AH.blue}14` : "transparent" }, pressed && { opacity: 0.6 }]}
            onPress={handleSend}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M22 2L11 13" stroke={inputText.trim() ? AH.blue : colors.muted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={inputText.trim() ? AH.blue : colors.muted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

// ─── 聊天界面 ────────────────────────────────────────────────────────────────

function ChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = (text: string) => {
    const now = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text, time: now };
    const nomiReply: ChatMessage = { id: (Date.now() + 1).toString(), role: "nomi", content: "收到你的消息了！我正在分析你的生活数据，为你提供个性化建议... ✨", time: now };
    setMessages((prev) => [...prev, userMsg, nomiReply]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView style={s.chatContainer} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={120}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={s.chatList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      <InputBar onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}

// ─── 记忆库 ──────────────────────────────────────────────────────────────────

function MemoriesTab() {
  const colors = useThemeColors();

  return (
    <ScrollView style={s.memScroll} contentContainerStyle={s.memContent} showsVerticalScrollIndicator={false}>
      <View style={s.memGrid}>
        {MEMORY_CARDS.map((card, index) => (
          <Pressable key={card.id} style={({ pressed }) => [pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}>
            <Animated.View entering={FadeInDown.delay(index * 80).duration(500)}>
              <GlassPanel style={{
                padding: 16,
                width: index % 3 === 0 ? "100%" : undefined,
                borderLeftWidth: 3,
                borderLeftColor: card.color,
              }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <View style={[s.memEmojiWrap, { backgroundColor: `${card.color}14` }]}>
                    <Text style={s.memEmoji}>{card.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.memTitle, { color: colors.foreground }]}>{card.title}</Text>
                    <Text style={[s.memDate, { color: colors.muted }]}>{card.date}</Text>
                  </View>
                </View>
                <Text style={[s.memDesc, { color: colors.muted }]}>{card.desc}</Text>
              </GlassPanel>
            </Animated.View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── 主页面 ──────────────────────────────────────────────────────────────────

export default function CompanionScreen() {
  const colors = useThemeColors();
  const { t } = useSettings();
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [callVisible, setCallVisible] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(false);

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* 页面标题 */}
      <View style={[s.pageHeader, { borderBottomColor: `${colors.border}30` }]}>
        <Animated.View entering={FadeInDown.duration(500)}>
          <Text style={[s.pageTitle, { color: colors.foreground }]}>{t("companion")}</Text>
          <Text style={[s.pageSub, { color: colors.muted }]}>Nomi · 你的 AI 伙伴</Text>
        </Animated.View>
        <View style={s.headerActions}>
          {/* 朗读开关 */}
          <Pressable
            style={({ pressed }) => [s.headerBtn, { backgroundColor: speakEnabled ? `${AH.blue}14` : `${colors.surface}E6` }, pressed && { opacity: 0.7 }]}
            onPress={() => { setSpeakEnabled(!speakEnabled); if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M11 5L6 9H2V15H6L11 19V5Z" stroke={speakEnabled ? AH.blue : colors.muted} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill={speakEnabled ? `${AH.blue}30` : "none"} />
              {speakEnabled ? (
                <>
                  <Path d="M15.54 8.46C16.48 9.4 17 10.67 17 12C17 13.32 16.48 14.59 15.54 15.53" stroke={AH.blue} strokeWidth={1.8} strokeLinecap="round" />
                  <Path d="M19.07 4.93C20.94 6.81 22 9.35 22 12C22 14.65 20.94 17.19 19.07 19.07" stroke={AH.blue} strokeWidth={1.8} strokeLinecap="round" />
                </>
              ) : (
                <Line x1="23" y1="9" x2="17" y2="15" stroke={colors.muted} strokeWidth={1.8} strokeLinecap="round" />
              )}
            </Svg>
          </Pressable>

          {/* 电话按钮 */}
          <Pressable
            style={({ pressed }) => [s.headerBtn, { backgroundColor: `${AH.green}14` }, pressed && { opacity: 0.7 }]}
            onPress={() => { setCallVisible(true); if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
            <IconSymbol name="phone.fill" size={18} color={AH.green} />
          </Pressable>

          {/* 在线状态 */}
          <View style={s.statusBadge}>
            <View style={[s.statusDot, { backgroundColor: AH.green }]} />
            <Text style={[s.statusText, { color: AH.green }]}>在线</Text>
          </View>
        </View>
      </View>

      {/* 关怀横幅 */}
      <View style={s.bannerWrap}>
        <CareBanner />
      </View>

      {/* Tab 切换 — 精致分段控件 */}
      <View style={[s.segmentWrap, { backgroundColor: `${colors.surface}80` }]}>
        {(["chat", "memories"] as TabType[]).map((tab) => (
          <Pressable key={tab}
            style={({ pressed }) => [
              s.segmentBtn,
              activeTab === tab && [s.segmentBtnActive, { backgroundColor: colors.background, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 }],
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => { setActiveTab(tab); if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
            <Text style={[s.segmentText, { color: activeTab === tab ? colors.foreground : colors.muted }]}>
              {tab === "chat" ? "💬 对话" : "✨ 记忆库"}
            </Text>
          </Pressable>
        ))}
      </View>

      {activeTab === "chat" ? <ChatTab /> : <MemoriesTab />}
      <CallModal visible={callVisible} onClose={() => setCallVisible(false)} />
    </ScreenContainer>
  );
}

// ─── 样式 ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  pageHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  pageTitle: { fontSize: 34, fontWeight: "800", letterSpacing: -0.8 },
  pageSub: { fontSize: 15, marginTop: 2, letterSpacing: 0.1 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: "600" },

  bannerWrap: { paddingHorizontal: 16, paddingTop: 10 },
  bannerIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  bannerTitle: { fontSize: 14, fontWeight: "600" },
  bannerDesc: { fontSize: 13, marginTop: 2, letterSpacing: 0.1 },
  bannerClose: { padding: 6 },

  segmentWrap: { flexDirection: "row", marginHorizontal: 16, marginTop: 10, borderRadius: 12, padding: 3 },
  segmentBtn: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  segmentBtnActive: {},
  segmentText: { fontSize: 14, fontWeight: "600" },

  // Chat
  chatContainer: { flex: 1 },
  chatList: { paddingHorizontal: 16, paddingVertical: 12, gap: 14 },
  bubbleRow: { flexDirection: "row", gap: 10 },
  bubbleRowNomi: { alignItems: "flex-start" },
  bubbleRowUser: { flexDirection: "row-reverse" },
  nomiAvatar: { width: 34, height: 34, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 4, overflow: "hidden" },
  nomiAvatarEmoji: { fontSize: 16 },
  bubbleContent: { maxWidth: "75%", gap: 4 },
  attachBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, marginBottom: 4 },
  attachText: { fontSize: 12 },
  bubble: { borderRadius: 18, padding: 14 },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  bubbleTime: { fontSize: 11, alignSelf: "flex-end", letterSpacing: 0.2 },

  // Input
  inputWrapper: { paddingBottom: 8 },
  quickRow: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  quickChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 0.5 },
  quickChipText: { fontSize: 13, fontWeight: "500" },
  inputBar: { flexDirection: "row", alignItems: "center", marginHorizontal: 16, marginBottom: 8, borderRadius: 28, paddingHorizontal: 12, paddingVertical: 10, gap: 8, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4, borderWidth: 0.5 },
  inputIcon: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  input: { flex: 1, fontSize: 15, lineHeight: 20, maxHeight: 100, paddingVertical: 0 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },

  // Memories
  memScroll: { flex: 1 },
  memContent: { padding: 16 },
  memGrid: { gap: 0 },
  memEmojiWrap: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  memEmoji: { fontSize: 22 },
  memTitle: { fontSize: 16, fontWeight: "700", letterSpacing: -0.2 },
  memDate: { fontSize: 12, marginTop: 1, letterSpacing: 0.1 },
  memDesc: { fontSize: 13, lineHeight: 19 },

  // Call
  callOverlay: { flex: 1, backgroundColor: "#00000060", justifyContent: "flex-end" },
  callSheet: { borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 32, paddingBottom: 48, alignItems: "center" },
  callAvatarWrap: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center", marginBottom: 16, overflow: "hidden" },
  callAvatarGlow: { position: "absolute", width: 100, height: 100, borderRadius: 50 },
  callAvatar: { fontSize: 52 },
  callName: { fontSize: 24, fontWeight: "700", color: "#FFFFFF", marginBottom: 6 },
  callStatus: { fontSize: 15, color: "#FFFFFF80", marginBottom: 24 },
  callVideoSection: { width: "100%", marginBottom: 24, gap: 12 },
  callVideoBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 12, borderRadius: 16 },
  callVideoBtnText: { fontSize: 15, color: "#FFFFFF", fontWeight: "600" },
  cameraSourceRow: { flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "center" },
  cameraSourceLabel: { fontSize: 13, color: "#FFFFFF80" },
  cameraSourceBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  cameraSourceBtnText: { fontSize: 13, color: "#FFFFFF", fontWeight: "600" },
  callActions: { flexDirection: "row", gap: 16 },
  callActionBtn: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", gap: 4 },
  callActionText: { fontSize: 12, color: "#FFFFFF", fontWeight: "600" },
});
