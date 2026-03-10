/**
 * 生活记录日志页面 — 完整的 Lifelog 时间线
 * 包含：全部生活事件、生活习惯统计、筛选功能
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
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { BentoCard } from "@/components/ui/bento-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useAppContext } from "@/lib/app-context";
import type { LifelogEvent } from "@/lib/app-context";

// ─── 类型和数据 ───────────────────────────────────────────────────────────────

type FilterTag = "all" | LifelogEvent["tag"];

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

// 完整的生活习惯事件库
const ALL_LIFELOG_EVENTS: LifelogEvent[] = [
  { id: "h1", time: "06:45", title: "起床", description: "检测到起床活动，比昨天早 15 分钟 ⏰", tag: "activity", icon: "🌅" },
  { id: "h2", time: "07:00", title: "照镜子 · 护肤", description: "晨间护肤流程完成，检测到洗脸、涂防晒动作", tag: "health", icon: "🪞" },
  { id: "h3", time: "07:15", title: "出门检查", description: "✅ 钥匙  ✅ 手机  ✅ 钱包 — 出门前习惯良好", tag: "activity", icon: "🗝️" },
  { id: "h4", time: "07:45", title: "早餐", description: "检测到进食行为，用餐时间约 15 分钟", tag: "meal", icon: "🥣" },
  { id: "h5", time: "08:30", title: "到达工位", description: "开始工作日，坐姿初始评分 88 分", tag: "work", icon: "💼" },
  { id: "h6", time: "09:15", title: "开始深度工作", description: "进入专注模式，坐姿标准", tag: "work", icon: "💻" },
  { id: "h7", time: "10:45", title: "久坐提醒", description: "已连续坐姿 90 分钟，建议起身活动", tag: "health", icon: "🧘" },
  { id: "h8", time: "12:30", title: "午餐时间", description: "检测到进食行为，用餐约 30 分钟", tag: "meal", icon: "🍱" },
  { id: "h9", time: "13:00", title: "午休", description: "检测到闭眼休息状态，约 20 分钟", tag: "rest", icon: "😴" },
  { id: "h10", time: "14:00", title: "服药打卡", description: "AI 识别到服药动作，维生素 D3 已记录", tag: "health", icon: "💊" },
  { id: "h11", time: "15:30", title: "视频会议", description: "检测到多人对话场景，持续约 45 分钟", tag: "work", icon: "📹" },
  { id: "h12", time: "17:00", title: "下午茶", description: "检测到饮水行为，水分补充达标", tag: "meal", icon: "☕" },
  { id: "h13", time: "18:30", title: "下班回家", description: "检测到移动出行场景", tag: "activity", icon: "🚶" },
  { id: "h14", time: "19:30", title: "晚餐", description: "检测到进食行为，用餐约 25 分钟", tag: "meal", icon: "🍜" },
  { id: "h15", time: "21:00", title: "晚间护肤", description: "检测到护肤流程，洁面、精华、面霜", tag: "health", icon: "✨" },
  { id: "h16", time: "22:30", title: "准备入睡", description: "检测到灯光变暗，进入睡前模式", tag: "rest", icon: "🌙" },
];

// ─── 习惯统计卡片 ─────────────────────────────────────────────────────────────

function HabitStatsRow() {
  const colors = useThemeColors();

  const stats = [
    { label: "起床时间", value: "06:45", icon: "🌅", color: "#FFB347" },
    { label: "护肤次数", value: "2 次", icon: "🪞", color: "#FF6B9D" },
    { label: "用餐次数", value: "3 餐", icon: "🍱", color: "#00D4AA" },
    { label: "习惯完成", value: "87%", icon: "✅", color: "#5B6EFF" },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.statsRow}
    >
      {stats.map((s) => (
        <View key={s.label} style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={styles.statEmoji}>{s.icon}</Text>
          <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>{s.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// ─── 筛选标签 ─────────────────────────────────────────────────────────────────

function FilterTabs({ active, onChange }: { active: FilterTag; onChange: (t: FilterTag) => void }) {
  const colors = useThemeColors();
  const filters: { key: FilterTag; label: string }[] = [
    { key: "all", label: "全部" },
    { key: "work", label: "工作" },
    { key: "meal", label: "饮食" },
    { key: "health", label: "健康" },
    { key: "rest", label: "休息" },
    { key: "activity", label: "活动" },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterRow}
    >
      {filters.map((f) => {
        const isActive = active === f.key;
        const color = f.key === "all" ? "#5B6EFF" : TAG_COLORS[f.key as LifelogEvent["tag"]];
        return (
          <Pressable
            key={f.key}
            style={({ pressed }) => [
              styles.filterChip,
              {
                backgroundColor: isActive ? `${color}20` : colors.surface2,
                borderColor: isActive ? color : "transparent",
              },
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(f.key);
            }}
          >
            <Text style={[styles.filterChipText, { color: isActive ? color : colors.muted }]}>
              {f.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ─── 时间线事件项 ─────────────────────────────────────────────────────────────

function EventItem({ event, isLast }: { event: LifelogEvent; isLast: boolean }) {
  const colors = useThemeColors();
  const tagColor = TAG_COLORS[event.tag];

  return (
    <Animated.View entering={FadeInDown.springify()} style={styles.eventRow}>
      {/* 左侧时间轴 */}
      <View style={styles.eventLeft}>
        <Text style={[styles.eventTime, { color: colors.muted }]}>{event.time}</Text>
        <View style={styles.eventLine}>
          <View style={[styles.eventDot, { backgroundColor: tagColor }]} />
          {!isLast && <View style={[styles.eventConnector, { backgroundColor: colors.border }]} />}
        </View>
      </View>

      {/* 右侧内容 */}
      <Pressable
        style={({ pressed }) => [
          styles.eventCard,
          { backgroundColor: colors.surface },
          pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
        ]}
      >
        <View style={styles.eventHeader}>
          <Text style={styles.eventEmoji}>{event.icon}</Text>
          <Text style={[styles.eventTitle, { color: colors.foreground }]}>{event.title}</Text>
          <View style={[styles.eventTag, { backgroundColor: `${tagColor}20` }]}>
            <Text style={[styles.eventTagText, { color: tagColor }]}>{TAG_LABELS[event.tag]}</Text>
          </View>
        </View>
        {event.description && (
          <Text style={[styles.eventDesc, { color: colors.muted }]}>{event.description}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

// ─── 主页面 ───────────────────────────────────────────────────────────────────

export default function LifelogScreen() {
  const colors = useThemeColors();
  const [activeFilter, setActiveFilter] = useState<FilterTag>("all");

  const filtered = activeFilter === "all"
    ? ALL_LIFELOG_EVENTS
    : ALL_LIFELOG_EVENTS.filter((e) => e.tag === activeFilter);

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* 页面标题 */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <IconSymbol name="chevron.left" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>今天</Text>
        </Pressable>
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>生活记录</Text>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* 日期标题 */}
            <View style={styles.dateHeader}>
              <Text style={[styles.dateTitle, { color: colors.foreground }]}>
                {new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" })}
              </Text>
              <Text style={[styles.dateSubtitle, { color: colors.muted }]}>
                共记录 {ALL_LIFELOG_EVENTS.length} 个生活事件
              </Text>
            </View>

            {/* 习惯统计 */}
            <HabitStatsRow />

            {/* 筛选标签 */}
            <FilterTabs active={activeFilter} onChange={setActiveFilter} />

            {/* 时间线标题 */}
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>时间轴</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.timelineWrapper}>
            <EventItem event={item} isLast={index === filtered.length - 1} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </ScreenContainer>
  );
}

// ─── 样式 ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4, minWidth: 60 },
  backText: { fontSize: 16, fontWeight: "500" },
  pageTitle: { fontSize: 17, fontWeight: "600" },
  headerRight: { minWidth: 60 },

  listContent: { paddingBottom: 40 },

  dateHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  dateTitle: { fontSize: 22, fontWeight: "700", letterSpacing: -0.5 },
  dateSubtitle: { fontSize: 13, marginTop: 4 },

  statsRow: { paddingHorizontal: 16, paddingBottom: 16, gap: 10 },
  statCard: {
    width: 90,
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statEmoji: { fontSize: 22 },
  statValue: { fontSize: 16, fontWeight: "700" },
  statLabel: { fontSize: 13, fontWeight: "500", textAlign: "center" },

  filterRow: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: { fontSize: 13, fontWeight: "600" },

  sectionTitle: { fontSize: 18, fontWeight: "700", paddingHorizontal: 16, marginBottom: 8 },

  timelineWrapper: { paddingHorizontal: 16 },
  eventRow: { flexDirection: "row", marginBottom: 12, gap: 12 },
  eventLeft: { width: 48, alignItems: "flex-end" },
  eventTime: { fontSize: 13, fontWeight: "500", marginTop: 12 },
  eventLine: { alignItems: "center", flex: 1, marginTop: 4 },
  eventDot: { width: 10, height: 10, borderRadius: 5 },
  eventConnector: { width: 2, flex: 1, marginTop: 4, minHeight: 20 },
  eventCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  eventHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  eventEmoji: { fontSize: 16 },
  eventTitle: { flex: 1, fontSize: 14, fontWeight: "600" },
  eventTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  eventTagText: { fontSize: 13, fontWeight: "600" },
  eventDesc: { fontSize: 14, lineHeight: 18, marginTop: 6 },
});
