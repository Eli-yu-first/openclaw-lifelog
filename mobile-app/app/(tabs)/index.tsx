/**
 * 今天 (Today) — openclaw-lifelog 主仪表盘 v1.1
 * 变更：移除快捷指令、添加电源开关、增强动态效果、日历卡片、生活习惯时间线
 */
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated2, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeInDown,
} from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { BentoCard } from "@/components/ui/bento-card";
import { RingChart } from "@/components/ui/ring-chart";
import { SectionHeader } from "@/components/ui/section-header";
import { GlassView } from "@/components/ui/glass-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useAppContext } from "@/lib/app-context";
import { useSettings } from "@/lib/settings-context";
import { Linking } from "react-native";
import type { NomiMood, LifelogEvent } from "@/lib/app-context";

// ─── Nomi 表情配置 ────────────────────────────────────────────────────────────

const NOMI_CONFIG: Record<NomiMood, { emoji: string; label: string; color: string }> = {
  observing:  { emoji: "👀", label: "观察中", color: "#5B6EFF" },
  analyzing:  { emoji: "🔍", label: "分析中", color: "#FF6B9D" },
  sleeping:   { emoji: "😴", label: "休眠中", color: "#8A8F9A" },
  happy:      { emoji: "😊", label: "心情愉快", color: "#00D4AA" },
  alert:      { emoji: "⚠️", label: "需要关注", color: "#FFB347" },
};

// ─── 电源开关按钮 ─────────────────────────────────────────────────────────────

function PowerButton() {
  const { state, toggleCamera } = useAppContext();
  const colors = useThemeColors();
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(state.cameraActive ? 1 : 0.3);

  useEffect(() => {
    glowOpacity.value = withTiming(state.cameraActive ? 1 : 0.3, { duration: 300 });
  }, [state.cameraActive]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePress = () => {
    scale.value = withSpring(0.88, { damping: 10 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleCamera();
  };

  const activeColor = state.cameraActive ? "#00D4AA" : "#FF5A5A";

  return (
    <Pressable onPress={handlePress} style={{ marginLeft: 8 }}>
      <Animated2.View style={animStyle}>
        <View style={[styles.powerBtn, { backgroundColor: `${activeColor}18`, borderColor: `${activeColor}40` }]}>
          <Animated2.View style={[styles.powerGlow, { backgroundColor: activeColor }, glowStyle]} />
          <IconSymbol name="power" size={18} color={activeColor} />
        </View>
      </Animated2.View>
    </Pressable>
  );
}

// ─── 全息状态岛组件 ────────────────────────────────────────────────────────────

function NomiIsland() {
  const colors = useThemeColors();
  const { state } = useAppContext();
  const config = NOMI_CONFIG[state.nomiMood];

  const breathAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, { toValue: 1.08, duration: 2000, useNativeDriver: true }),
        Animated.timing(breathAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    );
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.6, duration: 1500, useNativeDriver: true }),
      ])
    );
    breathLoop.start();
    glowLoop.start();
    return () => { breathLoop.stop(); glowLoop.stop(); };
  }, []);

  return (
    <Animated2.View entering={FadeInDown.delay(100).springify()}>
      <LinearGradient
        colors={["#5B6EFF22", "#FF6B9D11", "transparent"]}
        style={styles.nomiIslandGradient}
      >
        <GlassView style={styles.nomiIsland} borderRadius={24} intensity={50}>
          <View style={styles.nomiContent}>
            <Animated.View style={[styles.nomiEmojiWrapper, { transform: [{ scale: breathAnim }] }]}>
              <Animated.View style={[styles.nomiGlow, { backgroundColor: config.color, opacity: glowAnim }]} />
              <Text style={styles.nomiEmoji}>{config.emoji}</Text>
            </Animated.View>
            <View style={styles.nomiTextArea}>
              <View style={styles.nomiStatusRow}>
                <View style={[styles.nomiStatusDot, { backgroundColor: config.color }]} />
                <Text style={[styles.nomiStatusLabel, { color: config.color }]}>
                  Nomi · {config.label}
                </Text>
              </View>
              <Text style={[styles.nomiGreeting, { color: colors.foreground }]} numberOfLines={2}>
                {state.nomiGreeting}
              </Text>
            </View>
          </View>
        </GlassView>
      </LinearGradient>
    </Animated2.View>
  );
}

// ─── 健康三环组件 ─────────────────────────────────────────────────────────────

function HealthRingsCard() {
  const colors = useThemeColors();
  const { state } = useAppContext();
  const { t } = useSettings();
  const { focus, posture, hydration } = state.healthRings;

  const rings = [
    { label: t("focus"), value: `${Math.round(focus * 100)}%`, progress: focus, colorStart: "#5B6EFF", colorEnd: "#9B6EFF", detail: `${Math.round(focus * 8)}h` },
    { label: t("posture"), value: `${Math.round(posture * 100)}%`, progress: posture, colorStart: "#FF6B9D", colorEnd: "#FF9B6B", detail: `${Math.round(posture * 100)}%` },
    { label: t("hydration"), value: `${Math.round(hydration * 100)}%`, progress: hydration, colorStart: "#00D4AA", colorEnd: "#00A8D4", detail: `${Math.round(hydration * 2000)}ml` },
  ];

  return (
    <Animated2.View entering={FadeInDown.delay(200).springify()}>
      <BentoCard>
        <SectionHeader title={t("health_rings")} subtitle={t("realtime_data")} />
        <View style={styles.ringsRow}>
          {rings.map((ring) => (
            <View key={ring.label} style={styles.ringItem}>
              <RingChart
                progress={ring.progress}
                size={80}
                strokeWidth={8}
                colorStart={ring.colorStart}
                colorEnd={ring.colorEnd}
                value={ring.value}
                label={ring.label}
                trackColor={colors.surface2}
              />
              <Text style={[styles.ringDetail, { color: colors.muted }]}>{ring.detail}</Text>
            </View>
          ))}
        </View>
      </BentoCard>
    </Animated2.View>
  );
}

// ─── 四宫格 Bento 卡片（环境/体态/行程/运动）────────────────────────────────

function QuadBentoGrid() {
  const colors = useThemeColors();
  const { state } = useAppContext();
  const { t } = useSettings();

  // 打开系统天气 App
  const openWeather = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const weatherUrls = [
      "weather://",
      "com.apple.weather://",
      "https://weather.com",
    ];
    Linking.openURL(weatherUrls[0]).catch(() =>
      Linking.openURL(weatherUrls[1]).catch(() =>
        Linking.openURL(weatherUrls[2])
      )
    );
  };

  // 打开系统日历 App
  const openCalendar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const calendarUrls = [
      "calshow://",
      "com.apple.mobilecal://",
      "content://com.android.calendar/time/",
    ];
    Linking.openURL(calendarUrls[0]).catch(() =>
      Linking.openURL(calendarUrls[1]).catch(() =>
        Linking.openURL(calendarUrls[2]).catch(() => {})
      )
    );
  };

  const cards = [
    {
      key: "env",
      icon: "🌤️",
      iconBg: "#FFB34720",
      title: t("env_advice"),
      value: "24°C",
      valueColor: "#FFB347",
      sub: t("recommend_wear"),
      onPress: openWeather,
    },
    {
      key: "posture",
      icon: "🧘",
      iconBg: "#FF6B9D20",
      title: t("posture_alert"),
      value: `${state.postureScore}${t("score")}`,
      valueColor: "#FF6B9D",
      sub: t("posture_good"),
      onPress: null,
    },
    {
      key: "schedule",
      icon: "📅",
      iconBg: "#5B6EFF20",
      title: t("today_schedule"),
      value: `3 ${t("items")}`,
      valueColor: "#5B6EFF",
      sub: t("tap_to_view"),
      onPress: openCalendar,
    },
    {
      key: "exercise",
      icon: "🏃",
      iconBg: "#00D4AA20",
      title: t("exercise_advice"),
      value: "6,240",
      valueColor: "#00D4AA",
      sub: t("steps_today"),
      onPress: null,
    },
  ];

  return (
    <Animated2.View entering={FadeInDown.delay(300).springify()}>
      <View style={styles.quadGrid}>
        {cards.map((card) => (
          <Pressable
            key={card.key}
            style={({ pressed }) => [
              styles.quadCard,
              { backgroundColor: colors.surface },
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
            onPress={card.onPress ?? undefined}
          >
            <View style={[styles.bentoIconBg, { backgroundColor: card.iconBg }]}>
              <Text style={styles.bentoCardEmoji}>{card.icon}</Text>
            </View>
            <Text style={[styles.quadCardTitle, { color: colors.foreground }]} numberOfLines={2}>{card.title}</Text>
            <Text style={[styles.quadCardValue, { color: card.valueColor }]} numberOfLines={1} adjustsFontSizeToFit>{card.value}</Text>
          </Pressable>
        ))}
      </View>
    </Animated2.View>
  );
}

// ─── Lifelog 时间线（含生活习惯）────────────────────────────────────────────

const TAG_COLORS: Record<LifelogEvent["tag"], string> = {
  work:     "#5B6EFF",
  meal:     "#FFB347",
  health:   "#FF6B9D",
  rest:     "#00D4AA",
  activity: "#9B6EFF",
};

const TAG_LABELS: Record<LifelogEvent["tag"], string> = {
  work: "工作", meal: "饮食", health: "健康", rest: "休息", activity: "活动",
};

// 扩展的生活习惯事件（含细节习惯）
const HABIT_EVENTS: LifelogEvent[] = [
  { id: "h1", time: "06:45", title: "起床", description: "检测到起床活动，比昨天早 15 分钟 ⏰", tag: "activity", icon: "🌅" },
  { id: "h2", time: "07:00", title: "照镜子 · 护肤", description: "晨间护肤流程完成，检测到洗脸、涂防晒动作", tag: "health", icon: "🪞" },
  { id: "h3", time: "07:15", title: "出门检查", description: "✅ 钥匙 ✅ 手机 ✅ 钱包 — 出门前习惯良好", tag: "activity", icon: "🗝️" },
  { id: "h4", time: "07:45", title: "早餐", description: "检测到进食行为，用餐时间约 15 分钟", tag: "meal", icon: "🥣" },
];

function LifelogTimeline() {
  const colors = useThemeColors();
  const { state } = useAppContext();

  // 合并习惯事件和常规事件
  const allEvents = [...HABIT_EVENTS, ...state.lifelogEvents].sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  const handleViewAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/lifelog" as any);
  };

  return (
    <Animated2.View entering={FadeInDown.delay(400).springify()}>
      <SectionHeader
        title="生活记录"
        subtitle="今日时间轴"
        actionLabel="查看全部"
        onAction={handleViewAll}
      />
      {allEvents.slice(0, 6).map((event, index) => (
        <View key={event.id} style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <Text style={[styles.timelineTime, { color: colors.muted }]}>{event.time}</Text>
            <View style={styles.timelineLine}>
              <View style={[styles.timelineDot, { backgroundColor: TAG_COLORS[event.tag] }]} />
              {index < 5 && (
                <View style={[styles.timelineConnector, { backgroundColor: colors.border }]} />
              )}
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.timelineContent,
              { backgroundColor: colors.surface },
              pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
            ]}
          >
            <View style={styles.timelineHeader}>
              <Text style={styles.timelineEmoji}>{event.icon}</Text>
              <Text style={[styles.timelineTitle, { color: colors.foreground }]}>{event.title}</Text>
              <View style={[styles.timelineTag, { backgroundColor: `${TAG_COLORS[event.tag]}20` }]}>
                <Text style={[styles.timelineTagText, { color: TAG_COLORS[event.tag] }]}>
                  {TAG_LABELS[event.tag]}
                </Text>
              </View>
            </View>
            {event.description && (
              <Text style={[styles.timelineDesc, { color: colors.muted }]}>{event.description}</Text>
            )}
          </Pressable>
        </View>
      ))}
    </Animated2.View>
  );
}

// ─── 主页面 ───────────────────────────────────────────────────────────────────

export default function TodayScreen() {
  const colors = useThemeColors();
  const { t } = useSettings();

  return (
    <ScreenContainer containerClassName="bg-background">
        <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 页面标题 + 电源开关 */}
        <View style={styles.pageHeader}>
          <View>
            <Text style={[styles.pageTitle, { color: colors.foreground }]}>{t("today")}</Text>
            <Text style={[styles.pageSubtitle, { color: colors.muted }]}>
              {new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" })}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <PowerButton />
            <Pressable style={[styles.avatarBtn, { backgroundColor: colors.surface2 }]}>
              <Text style={styles.avatarEmoji}>🐾</Text>
            </Pressable>
          </View>
        </View>

        {/* Nomi 全息状态岛 */}
        <NomiIsland />

        {/* 健康三环 */}
        <HealthRingsCard />

        {/* 四宫格 Bento 卡片（环境/体态/行程/运动） */}
        <QuadBentoGrid />

        {/* Lifelog 时间线（含生活习惯） */}
        <LifelogTimeline />
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── 样式 ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  pageTitle: { fontSize: 34, fontWeight: "800", letterSpacing: -1 },
  pageSubtitle: { fontSize: 15, fontWeight: "400", marginTop: 2 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  avatarBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  avatarEmoji: { fontSize: 20 },

  // 电源按钮
  powerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    overflow: "hidden",
  },
  powerGlow: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.15,
  },

  // Nomi 状态岛
  nomiIslandGradient: { borderRadius: 24, marginBottom: 12 },
  nomiIsland: { padding: 16 },
  nomiContent: { flexDirection: "row", alignItems: "center", gap: 14 },
  nomiEmojiWrapper: { width: 64, height: 64, alignItems: "center", justifyContent: "center", position: "relative" },
  nomiGlow: { position: "absolute", width: 64, height: 64, borderRadius: 32, opacity: 0.3 },
  nomiEmoji: { fontSize: 38 },
  nomiTextArea: { flex: 1 },
  nomiStatusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  nomiStatusDot: { width: 6, height: 6, borderRadius: 3 },
  nomiStatusLabel: { fontSize: 14, fontWeight: "600", letterSpacing: 0.2 },
  nomiGreeting: { fontSize: 14, fontWeight: "500", lineHeight: 20 },

  // 健康三环
  ringsRow: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 8 },
  ringItem: { alignItems: "center", gap: 8 },
  ringDetail: { fontSize: 13, fontWeight: "500" },

  // Bento 双列
  bentoRow: { flexDirection: "row", marginBottom: 12 },
  halfCardMargin: { marginRight: 6, marginBottom: 0 },
  halfCardMarginLeft: { marginLeft: 6, marginBottom: 0 },
  bentoCardInner: { gap: 6 },
  bentoIconBg: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  bentoCardEmoji: { fontSize: 20 },
  bentoCardTitle: { fontSize: 13, fontWeight: "600" },
  bentoCardValue: { fontSize: 22, fontWeight: "700", letterSpacing: -0.5 },
  bentoCardSub: { fontSize: 14, fontWeight: "400" },
  // 四宫格卡片
  quadGrid: { flexDirection: "row", gap: 8, marginBottom: 12 },
  quadCard: { flex: 1, borderRadius: 16, padding: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2, minWidth: 0 },
  quadCardTitle: { fontSize: 12, fontWeight: "600", marginTop: 6, marginBottom: 3, lineHeight: 16 },
  quadCardValue: { fontSize: 16, fontWeight: "800", letterSpacing: -0.5 },
  quadCardSub: { fontSize: 14, fontWeight: "400" },

  // 体态卡片
  postureRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  postureScore: { fontSize: 28, fontWeight: "700", letterSpacing: -1 },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 6, borderRadius: 3 },

  // 日历弹窗
  modalOverlay: { flex: 1, backgroundColor: "#00000040", justifyContent: "flex-end" },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#E0E0E0", alignSelf: "center", marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  modalDate: { fontSize: 13, marginBottom: 16 },
  scheduleItem: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, marginBottom: 8 },
  scheduleDot: { width: 8, height: 8, borderRadius: 4 },
  scheduleTime: { fontSize: 13, fontWeight: "600", width: 44 },
  scheduleTitle: { fontSize: 14, fontWeight: "500", flex: 1 },
  addScheduleRow: { paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, marginTop: 4 },
  addScheduleHint: { fontSize: 14, textAlign: "center" },

  // 时间线
  timelineItem: { flexDirection: "row", marginBottom: 12, gap: 12 },
  timelineLeft: { width: 48, alignItems: "flex-end" },
  timelineTime: { fontSize: 13, fontWeight: "500", marginTop: 12 },
  timelineLine: { alignItems: "center", flex: 1, marginTop: 4 },
  timelineDot: { width: 10, height: 10, borderRadius: 5 },
  timelineConnector: { width: 2, flex: 1, marginTop: 4, minHeight: 20 },
  timelineContent: { flex: 1, borderRadius: 14, padding: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  timelineHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  timelineEmoji: { fontSize: 16 },
  timelineTitle: { flex: 1, fontSize: 15, fontWeight: "600" },
  timelineTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  timelineTagText: { fontSize: 13, fontWeight: "600" },
  timelineDesc: { fontSize: 13, lineHeight: 19, marginTop: 6 },
});
