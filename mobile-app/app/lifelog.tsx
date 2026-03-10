/**
 * 生活记录日志页面 — openclaw-lifelog v2.0
 * Apple Health 级精致设计：毛玻璃面板、精致时间线、渐变标签
 */
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColors } from "@/hooks/use-theme-colors";
import type { LifelogEvent } from "@/lib/app-context";

// ─── 类型和数据 ──────────────────────────────────────────────────────────────

type FilterTag = "all" | LifelogEvent["tag"];

const TAG_GRADIENTS: Record<LifelogEvent["tag"], readonly [string, string]> = {
  work:     ["#818CF8", "#6366F1"],
  meal:     ["#FBBF24", "#F59E0B"],
  health:   ["#FB7185", "#F43F5E"],
  rest:     ["#34D399", "#10B981"],
  activity: ["#A78BFA", "#8B5CF6"],
};

const TAG_LABELS: Record<LifelogEvent["tag"], string> = {
  work: "工作", meal: "饮食", health: "健康", rest: "休息", activity: "活动",
};

const ALL_LIFELOG_EVENTS: LifelogEvent[] = [
  { id: "h1", time: "06:45", title: "起床", description: "检测到起床活动，比昨天早 15 分钟", tag: "activity", icon: "🌅" },
  { id: "h2", time: "07:00", title: "照镜子 · 护肤", description: "晨间护肤流程完成，洗脸、涂防晒", tag: "health", icon: "🪞" },
  { id: "h3", time: "07:15", title: "出门检查", description: "✅ 钥匙  ✅ 手机  ✅ 钱包", tag: "activity", icon: "🗝️" },
  { id: "h4", time: "07:45", title: "早餐", description: "检测到进食行为，用餐约 15 分钟", tag: "meal", icon: "🥣" },
  { id: "h5", time: "08:30", title: "到达工位", description: "开始工作日，坐姿评分 88 分", tag: "work", icon: "💼" },
  { id: "h6", time: "09:15", title: "深度工作", description: "进入专注模式，坐姿标准", tag: "work", icon: "💻" },
  { id: "h7", time: "10:45", title: "久坐提醒", description: "已连续坐姿 90 分钟，建议起身活动", tag: "health", icon: "🧘" },
  { id: "h8", time: "12:30", title: "午餐时间", description: "检测到进食行为，用餐约 30 分钟", tag: "meal", icon: "🍱" },
  { id: "h9", time: "13:00", title: "午休", description: "检测到闭眼休息状态，约 20 分钟", tag: "rest", icon: "😴" },
  { id: "h10", time: "14:00", title: "服药打卡", description: "AI 识别到服药动作，维生素 D3 已记录", tag: "health", icon: "💊" },
  { id: "h11", time: "15:30", title: "视频会议", description: "检测到多人对话场景，约 45 分钟", tag: "work", icon: "📹" },
  { id: "h12", time: "17:00", title: "下午茶", description: "检测到饮水行为，水分补充达标", tag: "meal", icon: "☕" },
  { id: "h13", time: "18:30", title: "下班回家", description: "检测到移动出行场景", tag: "activity", icon: "🚶" },
  { id: "h14", time: "19:30", title: "晚餐", description: "检测到进食行为，用餐约 25 分钟", tag: "meal", icon: "🍜" },
  { id: "h15", time: "21:00", title: "晚间护肤", description: "洁面、精华、面霜流程完成", tag: "health", icon: "✨" },
  { id: "h16", time: "22:30", title: "准备入睡", description: "灯光变暗，进入睡前模式", tag: "rest", icon: "🌙" },
];

// ─── 毛玻璃面板 ──────────────────────────────────────────────────────────────

function GlassPanel({ children, style }: { children: React.ReactNode; style?: any }) {
  const colors = useThemeColors();
  return (
    <View style={[st.glassOuter, style]}>
      <BlurView intensity={40} tint="light" style={st.glassBlur}>
        <View style={[st.glassInner, { backgroundColor: `${colors.surface}CC` }]}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

// ─── 习惯统计卡片 ────────────────────────────────────────────────────────────

function HabitStatsRow() {
  const colors = useThemeColors();
  const stats = [
    { label: "起床时间", value: "06:45", icon: "🌅", gradient: ["#FBBF24", "#F59E0B"] as const },
    { label: "护肤次数", value: "2 次", icon: "🪞", gradient: ["#FB7185", "#F43F5E"] as const },
    { label: "用餐次数", value: "3 餐", icon: "🍱", gradient: ["#34D399", "#10B981"] as const },
    { label: "习惯完成", value: "87%", icon: "✅", gradient: ["#818CF8", "#6366F1"] as const },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.statsRow}>
      {stats.map((s) => (
        <GlassPanel key={s.label} style={{ width: 100 }}>
          <View style={{ alignItems: "center", gap: 6 }}>
            <Text style={{ fontSize: 24 }}>{s.icon}</Text>
            <Text style={[st.statValue, { color: s.gradient[0] }]}>{s.value}</Text>
            <Text style={[st.statLabel, { color: colors.muted }]}>{s.label}</Text>
          </View>
        </GlassPanel>
      ))}
    </ScrollView>
  );
}

// ─── 筛选标签 ────────────────────────────────────────────────────────────────

function FilterTabs({ active, onChange }: { active: FilterTag; onChange: (t: FilterTag) => void }) {
  const colors = useThemeColors();
  const filters: { key: FilterTag; label: string; gradient: readonly [string, string] }[] = [
    { key: "all", label: "全部", gradient: ["#818CF8", "#6366F1"] },
    { key: "work", label: "工作", gradient: TAG_GRADIENTS.work },
    { key: "meal", label: "饮食", gradient: TAG_GRADIENTS.meal },
    { key: "health", label: "健康", gradient: TAG_GRADIENTS.health },
    { key: "rest", label: "休息", gradient: TAG_GRADIENTS.rest },
    { key: "activity", label: "活动", gradient: TAG_GRADIENTS.activity },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.filterRow}>
      {filters.map((f) => {
        const isActive = active === f.key;
        return (
          <Pressable
            key={f.key}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onChange(f.key); }}
          >
            {isActive ? (
              <LinearGradient colors={[...f.gradient]} style={st.filterChipActive}>
                <Text style={st.filterChipActiveText}>{f.label}</Text>
              </LinearGradient>
            ) : (
              <View style={[st.filterChip, { backgroundColor: `${colors.surface}E6` }]}>
                <Text style={[st.filterChipText, { color: colors.muted }]}>{f.label}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ─── 时间线事件项 ────────────────────────────────────────────────────────────

function EventItem({ event, isLast, index }: { event: LifelogEvent; isLast: boolean; index: number }) {
  const colors = useThemeColors();
  const gradient = TAG_GRADIENTS[event.tag];

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).duration(400)} style={st.eventRow}>
      {/* 左侧时间轴 */}
      <View style={st.eventLeft}>
        <Text style={[st.eventTime, { color: colors.muted }]}>{event.time}</Text>
        <View style={st.eventTimeline}>
          <LinearGradient colors={[...gradient]} style={st.eventDot} />
          {!isLast && (
            <View style={[st.eventConnector, { backgroundColor: `${colors.border}40` }]} />
          )}
        </View>
      </View>

      {/* 右侧内容卡片 */}
      <Pressable
        style={({ pressed }) => [pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
      >
        <GlassPanel style={{ flex: 1 }}>
          <View style={st.eventHeader}>
            <Text style={{ fontSize: 18 }}>{event.icon}</Text>
            <Text style={[st.eventTitle, { color: colors.foreground }]}>{event.title}</Text>
            <LinearGradient colors={[`${gradient[0]}25`, `${gradient[1]}15`]} style={st.eventTag}>
              <Text style={[st.eventTagText, { color: gradient[0] }]}>{TAG_LABELS[event.tag]}</Text>
            </LinearGradient>
          </View>
          {event.description && (
            <Text style={[st.eventDesc, { color: colors.muted }]}>{event.description}</Text>
          )}
        </GlassPanel>
      </Pressable>
    </Animated.View>
  );
}

// ─── 主页面 ──────────────────────────────────────────────────────────────────

export default function LifelogScreen() {
  const colors = useThemeColors();
  const [activeFilter, setActiveFilter] = useState<FilterTag>("all");

  const filtered = activeFilter === "all"
    ? ALL_LIFELOG_EVENTS
    : ALL_LIFELOG_EVENTS.filter((e) => e.tag === activeFilter);

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* 导航栏 */}
      <View style={[st.header, { borderBottomColor: `${colors.border}30` }]}>
        <Pressable
          style={({ pressed }) => [st.backBtn, pressed && { opacity: 0.6 }]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
        >
          <IconSymbol name="chevron.left" size={18} color="#6366F1" />
          <Text style={[st.backText, { color: "#6366F1" }]}>今天</Text>
        </Pressable>
        <Text style={[st.headerTitle, { color: colors.foreground }]}>生活记录</Text>
        <View style={{ minWidth: 60 }} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* 日期标题 */}
            <Animated.View entering={FadeIn.duration(400)} style={st.dateHeader}>
              <Text style={[st.dateTitle, { color: colors.foreground }]}>
                {new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" })}
              </Text>
              <Text style={[st.dateSub, { color: colors.muted }]}>
                共记录 {ALL_LIFELOG_EVENTS.length} 个生活事件
              </Text>
            </Animated.View>

            <HabitStatsRow />
            <FilterTabs active={activeFilter} onChange={setActiveFilter} />

            <Text style={[st.sectionTitle, { color: colors.foreground }]}>时间轴</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={st.timelineWrapper}>
            <EventItem event={item} isLast={index === filtered.length - 1} index={index} />
          </View>
        )}
        contentContainerStyle={st.listContent}
      />
    </ScreenContainer>
  );
}

// ─── 样式 ────────────────────────────────────────────────────────────────────

const st = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4, minWidth: 60 },
  backText: { fontSize: 16, fontWeight: "600" },
  headerTitle: { fontSize: 17, fontWeight: "700", letterSpacing: -0.3 },

  listContent: { paddingBottom: 50 },

  dateHeader: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  dateTitle: { fontSize: 26, fontWeight: "800", letterSpacing: -0.8 },
  dateSub: { fontSize: 14, marginTop: 4 },

  statsRow: { paddingHorizontal: 20, paddingBottom: 20, gap: 12 },
  statValue: { fontSize: 18, fontWeight: "800", letterSpacing: -0.5 },
  statLabel: { fontSize: 12, fontWeight: "500", textAlign: "center" },

  filterRow: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  filterChipText: { fontSize: 14, fontWeight: "600" },
  filterChipActive: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  filterChipActiveText: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },

  sectionTitle: { fontSize: 20, fontWeight: "700", letterSpacing: -0.3, paddingHorizontal: 20, marginBottom: 12 },

  timelineWrapper: { paddingHorizontal: 20 },
  eventRow: { flexDirection: "row", marginBottom: 14, gap: 14 },
  eventLeft: { width: 50, alignItems: "flex-end" },
  eventTime: { fontSize: 13, fontWeight: "600", marginTop: 14, letterSpacing: -0.3 },
  eventTimeline: { alignItems: "center", flex: 1, marginTop: 6 },
  eventDot: { width: 10, height: 10, borderRadius: 5 },
  eventConnector: { width: 1.5, flex: 1, marginTop: 4, minHeight: 20 },
  eventHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  eventTitle: { flex: 1, fontSize: 15, fontWeight: "700", letterSpacing: -0.2 },
  eventTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  eventTagText: { fontSize: 12, fontWeight: "700" },
  eventDesc: { fontSize: 14, lineHeight: 20, marginTop: 8 },

  // Glass Panel
  glassOuter: { borderRadius: 18, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
  glassBlur: { borderRadius: 18, overflow: "hidden" },
  glassInner: { padding: 14, borderRadius: 18, borderWidth: 0.5, borderColor: "rgba(255,255,255,0.15)" },
});
