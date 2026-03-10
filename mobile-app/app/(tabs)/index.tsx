/**
 * 今天 (Today) — openclaw-lifelog v2.0
 * Apple Health 级精致设计：毛玻璃面板、精致动画、统一图标、专业排版
 */
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated2, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeInDown,
  FadeIn,
} from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { RingChart } from "@/components/ui/ring-chart";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useAppContext } from "@/lib/app-context";
import { useSettings } from "@/lib/settings-context";
import { Linking } from "react-native";
import Svg, { Circle, Defs, Stop, LinearGradient as SvgGradient } from "react-native-svg";
import type { NomiMood, LifelogEvent } from "@/lib/app-context";

// ─── Apple Health 色彩常量 ──────────────────────────────────────────────────

const AH = {
  pink: "#FF2D55",
  green: "#30D158",
  cyan: "#00C7BE",
  blue: "#007AFF",
  orange: "#FF9500",
  red: "#FF3B30",
  purple: "#AF52DE",
  yellow: "#FFD60A",
  indigo: "#5856D6",
  teal: "#5AC8FA",
};

// ─── Nomi 表情配置 ──────────────────────────────────────────────────────────

const NOMI_CONFIG: Record<NomiMood, { eyes: string; label: string; color: string; gradient: [string, string] }> = {
  observing:  { eyes: "◉ ◉", label: "观察中", color: AH.blue, gradient: ["#007AFF", "#5AC8FA"] },
  analyzing:  { eyes: "◎ ◎", label: "分析中", color: AH.purple, gradient: ["#AF52DE", "#5856D6"] },
  sleeping:   { eyes: "– –", label: "休眠中", color: "#8E8E93", gradient: ["#8E8E93", "#636366"] },
  happy:      { eyes: "◠ ◠", label: "心情愉快", color: AH.green, gradient: ["#30D158", "#34C759"] },
  alert:      { eyes: "◉ ◉", label: "需要关注", color: AH.orange, gradient: ["#FF9500", "#FF3B30"] },
};

// ─── 精致毛玻璃面板 ─────────────────────────────────────────────────────────

function GlassPanel({ children, style, borderRadius = 20 }: {
  children: React.ReactNode;
  style?: any;
  borderRadius?: number;
}) {
  const colors = useThemeColors();
  return (
    <View style={[{ borderRadius, overflow: "hidden", marginBottom: 12 }, style]}>
      {Platform.OS !== "web" ? (
        <BlurView intensity={40} tint="light" style={{ borderRadius, overflow: "hidden" }}>
          <View style={[{
            backgroundColor: `${colors.surface}E6`,
            borderRadius,
            borderWidth: 0.5,
            borderColor: `${colors.border}60`,
          }]}>
            {/* 顶部高光 */}
            <View style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 1,
              backgroundColor: "#FFFFFF30", borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius,
            }} />
            {children}
          </View>
        </BlurView>
      ) : (
        <View style={[{
          backgroundColor: `${colors.surface}F2`,
          borderRadius,
          borderWidth: 0.5,
          borderColor: `${colors.border}40`,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
          elevation: 3,
        }]}>
          <View style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            backgroundColor: "#FFFFFF20", borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius,
          }} />
          {children}
        </View>
      )}
    </View>
  );
}

// ─── 电源开关按钮 ───────────────────────────────────────────────────────────

function PowerButton() {
  const { state, toggleCamera } = useAppContext();
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(state.cameraActive ? 1 : 0.3);

  useEffect(() => {
    glowOpacity.value = withTiming(state.cameraActive ? 1 : 0.3, { duration: 300 });
  }, [state.cameraActive]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.88, { damping: 10 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleCamera();
  };

  const activeColor = state.cameraActive ? AH.green : AH.red;

  return (
    <Pressable onPress={handlePress}>
      <Animated2.View style={animStyle}>
        <View style={[s.powerBtn, { borderColor: `${activeColor}50` }]}>
          <View style={[s.powerGlow, { backgroundColor: activeColor, opacity: state.cameraActive ? 0.15 : 0.08 }]} />
          <IconSymbol name="power" size={16} color={activeColor} />
        </View>
      </Animated2.View>
    </Pressable>
  );
}

// ─── Nomi 精致毛玻璃气泡 ────────────────────────────────────────────────────

function NomiIsland() {
  const colors = useThemeColors();
  const { state } = useAppContext();
  const config = NOMI_CONFIG[state.nomiMood];

  // 呼吸动画
  const breathAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, { toValue: 1.06, duration: 2500, useNativeDriver: true }),
        Animated.timing(breathAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.8, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated2.View entering={FadeInDown.delay(100).duration(600)}>
      <GlassPanel borderRadius={22}>
        <View style={s.nomiContent}>
          {/* Nomi 眼睛动画区 */}
          <Animated.View style={[s.nomiAvatarWrap, { transform: [{ scale: breathAnim }] }]}>
            <LinearGradient
              colors={config.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.nomiAvatarBg}
            >
              <Animated.View style={[s.nomiPulseRing, { borderColor: config.color, opacity: pulseAnim }]} />
              <Text style={s.nomiEyes}>{config.eyes}</Text>
            </LinearGradient>
          </Animated.View>

          {/* 文字区 */}
          <View style={s.nomiTextArea}>
            <View style={s.nomiStatusRow}>
              <View style={[s.nomiDot, { backgroundColor: config.color }]} />
              <Text style={[s.nomiLabel, { color: config.color }]}>
                Nomi · {config.label}
              </Text>
            </View>
            <Text style={[s.nomiGreeting, { color: colors.foreground }]} numberOfLines={2}>
              {state.nomiGreeting}
            </Text>
          </View>
        </View>
      </GlassPanel>
    </Animated2.View>
  );
}

// ─── Apple Watch 风格健康环 ──────────────────────────────────────────────────

function PremiumRing({ progress, size, color, gradientEnd, label, value, detail }: {
  progress: number; size: number; color: string; gradientEnd: string;
  label: string; value: string; detail: string;
}) {
  const colors = useThemeColors();
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ width: size, height: size, position: "relative" }}>
        <Svg width={size} height={size}>
          <Defs>
            <SvgGradient id={`grad-${label}`} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={color} />
              <Stop offset="100%" stopColor={gradientEnd} />
            </SvgGradient>
          </Defs>
          {/* 轨道 */}
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={`${colors.border}40`}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* 进度 */}
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={`url(#grad-${label})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        {/* 中心数值 */}
        <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>
          <Text style={[s.ringCenterValue, { color: colors.foreground }]}>{value}</Text>
        </View>
      </View>
      <Text style={[s.ringLabel, { color }]}>{label}</Text>
      <Text style={[s.ringDetail, { color: colors.muted }]}>{detail}</Text>
    </View>
  );
}

function HealthRingsCard() {
  const { state } = useAppContext();
  const { t } = useSettings();
  const colors = useThemeColors();
  const { focus, posture, hydration } = state.healthRings;

  return (
    <Animated2.View entering={FadeInDown.delay(200).duration(600)}>
      <GlassPanel>
        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: colors.foreground }]}>{t("health_rings")}</Text>
          <Text style={[s.sectionSub, { color: colors.muted }]}>{t("realtime_data")}</Text>
        </View>
        <View style={s.ringsRow}>
          <PremiumRing
            progress={focus} size={90} color={AH.pink} gradientEnd={AH.red}
            label={t("focus")} value={`${Math.round(focus * 100)}%`} detail={`${Math.round(focus * 8)}h`}
          />
          <PremiumRing
            progress={posture} size={90} color={AH.green} gradientEnd={AH.cyan}
            label={t("posture")} value={`${Math.round(posture * 100)}%`} detail={`${Math.round(posture * 100)}%`}
          />
          <PremiumRing
            progress={hydration} size={90} color={AH.cyan} gradientEnd={AH.blue}
            label={t("hydration")} value={`${Math.round(hydration * 100)}%`} detail={`${Math.round(hydration * 2000)}ml`}
          />
        </View>
      </GlassPanel>
    </Animated2.View>
  );
}

// ─── 四宫格快捷卡片（统一扁平系统图标）─────────────────────────────────────

function QuadBentoGrid() {
  const colors = useThemeColors();
  const { state } = useAppContext();
  const { t } = useSettings();

  const openWeather = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL("weather://").catch(() =>
      Linking.openURL("https://weather.com")
    );
  };

  const openCalendar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL("calshow://").catch(() =>
      Linking.openURL("content://com.android.calendar/time/").catch(() => {})
    );
  };

  const cards = [
    { key: "env", icon: "cloud.sun.fill" as const, color: AH.orange, title: t("env_advice"), value: "24°C", onPress: openWeather },
    { key: "posture", icon: "figure.stand" as const, color: AH.pink, title: t("posture_alert"), value: `${state.postureScore}${t("score")}`, onPress: null },
    { key: "schedule", icon: "calendar" as const, color: AH.blue, title: t("today_schedule"), value: `3${t("items")}`, onPress: openCalendar },
    { key: "exercise", icon: "flame.fill" as const, color: AH.green, title: t("exercise_advice"), value: "6,240", onPress: null },
  ];

  return (
    <Animated2.View entering={FadeInDown.delay(300).duration(600)}>
      <View style={s.quadRow}>
        {cards.map((card, i) => (
          <Pressable
            key={card.key}
            style={({ pressed }) => [
              s.quadCard,
              { backgroundColor: `${colors.surface}F2` },
              pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
            ]}
            onPress={card.onPress ?? undefined}
          >
            {/* 顶部高光线 */}
            <View style={[s.quadHighlight, { backgroundColor: `${card.color}10` }]} />
            <View style={[s.quadIconWrap, { backgroundColor: `${card.color}14` }]}>
              <IconSymbol name={card.icon} size={18} color={card.color} />
            </View>
            <Text style={[s.quadTitle, { color: colors.muted }]} numberOfLines={1}>{card.title}</Text>
            <Text style={[s.quadValue, { color: colors.foreground }]} numberOfLines={1} adjustsFontSizeToFit>{card.value}</Text>
          </Pressable>
        ))}
      </View>
    </Animated2.View>
  );
}

// ─── 精致时间线 ─────────────────────────────────────────────────────────────

const TAG_COLORS: Record<LifelogEvent["tag"], string> = {
  work: AH.blue, meal: AH.orange, health: AH.pink, rest: AH.green, activity: AH.purple,
};

const TAG_LABELS: Record<LifelogEvent["tag"], string> = {
  work: "工作", meal: "饮食", health: "健康", rest: "休息", activity: "活动",
};

const HABIT_EVENTS: LifelogEvent[] = [
  { id: "h1", time: "06:45", title: "起床", description: "检测到起床活动，比昨天早 15 分钟", tag: "activity", icon: "🌅" },
  { id: "h2", time: "07:00", title: "照镜子 · 护肤", description: "晨间护肤流程完成，检测到洗脸、涂防晒动作", tag: "health", icon: "🪞" },
  { id: "h3", time: "07:15", title: "出门检查", description: "✅ 钥匙 ✅ 手机 ✅ 钱包 — 出门前习惯良好", tag: "activity", icon: "🗝️" },
  { id: "h4", time: "07:45", title: "早餐", description: "检测到进食行为，用餐时间约 15 分钟", tag: "meal", icon: "🥣" },
];

function LifelogTimeline() {
  const colors = useThemeColors();
  const { state } = useAppContext();
  const { t } = useSettings();

  const allEvents = [...HABIT_EVENTS, ...state.lifelogEvents].sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  const handleViewAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/lifelog" as any);
  };

  return (
    <Animated2.View entering={FadeInDown.delay(400).duration(600)}>
      {/* Section Header */}
      <View style={s.timelineSectionHeader}>
        <View>
          <Text style={[s.sectionTitle, { color: colors.foreground }]}>{t("life_log")}</Text>
          <Text style={[s.sectionSub, { color: colors.muted }]}>{t("today_timeline")}</Text>
        </View>
        <Pressable
          onPress={handleViewAll}
          style={({ pressed }) => [pressed && { opacity: 0.6 }]}
        >
          <Text style={[s.viewAllBtn, { color: AH.blue }]}>{t("view_all")}</Text>
        </Pressable>
      </View>

      {/* 时间线条目 */}
      {allEvents.slice(0, 6).map((event, index) => (
        <Animated2.View key={event.id} entering={FadeInDown.delay(450 + index * 60).duration(400)}>
          <View style={s.tlItem}>
            {/* 左侧时间 + 连接线 */}
            <View style={s.tlLeft}>
              <Text style={[s.tlTime, { color: colors.muted }]}>{event.time}</Text>
              <View style={s.tlDotLine}>
                <View style={[s.tlDot, { backgroundColor: TAG_COLORS[event.tag] }]}>
                  <View style={[s.tlDotInner, { backgroundColor: colors.surface }]} />
                </View>
                {index < Math.min(allEvents.length, 6) - 1 && (
                  <View style={[s.tlConnector, { backgroundColor: `${colors.border}60` }]} />
                )}
              </View>
            </View>

            {/* 右侧卡片 */}
            <Pressable
              style={({ pressed }) => [
                s.tlCard,
                { backgroundColor: `${colors.surface}F2`, borderColor: `${colors.border}30` },
                pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
              ]}
            >
              <View style={s.tlCardHeader}>
                <Text style={s.tlEmoji}>{event.icon}</Text>
                <Text style={[s.tlTitle, { color: colors.foreground }]}>{event.title}</Text>
                <View style={[s.tlTag, { backgroundColor: `${TAG_COLORS[event.tag]}12` }]}>
                  <Text style={[s.tlTagText, { color: TAG_COLORS[event.tag] }]}>
                    {TAG_LABELS[event.tag]}
                  </Text>
                </View>
              </View>
              {event.description && (
                <Text style={[s.tlDesc, { color: colors.muted }]}>{event.description}</Text>
              )}
            </Pressable>
          </View>
        </Animated2.View>
      ))}
    </Animated2.View>
  );
}

// ─── 主页面 ─────────────────────────────────────────────────────────────────

export default function TodayScreen() {
  const colors = useThemeColors();
  const { t } = useSettings();

  const weekday = new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" });

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        style={[s.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 页面标题 */}
        <Animated2.View entering={FadeIn.duration(500)} style={s.header}>
          <View>
            <Text style={[s.title, { color: colors.foreground }]}>{t("today")}</Text>
            <Text style={[s.subtitle, { color: colors.muted }]}>{weekday}</Text>
          </View>
          <View style={s.headerActions}>
            <PowerButton />
            <View style={[s.avatarBtn, { backgroundColor: `${colors.surface2}` }]}>
              <Text style={s.avatarEmoji}>🐾</Text>
            </View>
          </View>
        </Animated2.View>

        <NomiIsland />
        <HealthRingsCard />
        <QuadBentoGrid />
        <LifelogTimeline />

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── 样式 ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },

  // Header
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  title: { fontSize: 34, fontWeight: "800", letterSpacing: -0.8 },
  subtitle: { fontSize: 15, fontWeight: "400", marginTop: 2, letterSpacing: 0.1 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatarBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  avatarEmoji: { fontSize: 18 },

  // Power
  powerBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, overflow: "hidden",
    backgroundColor: "transparent",
  },
  powerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
  },

  // Nomi
  nomiContent: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  nomiAvatarWrap: { width: 56, height: 56 },
  nomiAvatarBg: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  nomiPulseRing: {
    position: "absolute", width: 56, height: 56, borderRadius: 28,
    borderWidth: 2, opacity: 0.4,
  },
  nomiEyes: { fontSize: 18, color: "#FFFFFF", fontWeight: "900", letterSpacing: 4 },
  nomiTextArea: { flex: 1 },
  nomiStatusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  nomiDot: { width: 6, height: 6, borderRadius: 3 },
  nomiLabel: { fontSize: 13, fontWeight: "600", letterSpacing: 0.3 },
  nomiGreeting: { fontSize: 15, fontWeight: "500", lineHeight: 22, letterSpacing: 0.1 },

  // Section Header
  sectionHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  sectionTitle: { fontSize: 20, fontWeight: "700", letterSpacing: -0.3 },
  sectionSub: { fontSize: 13, fontWeight: "400", marginTop: 2, letterSpacing: 0.1 },

  // Health Rings
  ringsRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 12, paddingBottom: 16 },
  ringCenterValue: { fontSize: 15, fontWeight: "700", letterSpacing: -0.3 },
  ringLabel: { fontSize: 12, fontWeight: "600", marginTop: 8, letterSpacing: 0.2 },
  ringDetail: { fontSize: 12, fontWeight: "400", marginTop: 2 },

  // Quad Grid
  quadRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  quadCard: {
    flex: 1, borderRadius: 16, padding: 12, minWidth: 0,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 12, elevation: 2,
    overflow: "hidden", position: "relative",
  },
  quadHighlight: {
    position: "absolute", top: 0, left: 0, right: 0, height: 3,
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
  },
  quadIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  quadTitle: { fontSize: 11, fontWeight: "600", marginBottom: 2, letterSpacing: 0.2 },
  quadValue: { fontSize: 17, fontWeight: "800", letterSpacing: -0.5 },

  // Timeline Section Header
  timelineSectionHeader: {
    flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
    marginBottom: 16,
  },
  viewAllBtn: { fontSize: 15, fontWeight: "600" },

  // Timeline
  tlItem: { flexDirection: "row", marginBottom: 4, gap: 12 },
  tlLeft: { width: 50, alignItems: "flex-end" },
  tlTime: { fontSize: 13, fontWeight: "500", marginTop: 12, fontVariant: ["tabular-nums"] },
  tlDotLine: { alignItems: "center", flex: 1, marginTop: 6 },
  tlDot: {
    width: 12, height: 12, borderRadius: 6,
    alignItems: "center", justifyContent: "center",
  },
  tlDotInner: { width: 4, height: 4, borderRadius: 2 },
  tlConnector: { width: 1.5, flex: 1, marginTop: 2, minHeight: 24 },
  tlCard: {
    flex: 1, borderRadius: 14, padding: 14,
    borderWidth: 0.5,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
    marginBottom: 8,
  },
  tlCardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  tlEmoji: { fontSize: 16 },
  tlTitle: { flex: 1, fontSize: 15, fontWeight: "600", letterSpacing: -0.1 },
  tlTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tlTagText: { fontSize: 11, fontWeight: "600", letterSpacing: 0.2 },
  tlDesc: { fontSize: 13, lineHeight: 19, marginTop: 6, letterSpacing: 0.1 },
});
