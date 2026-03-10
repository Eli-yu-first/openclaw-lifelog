/**
 * 洞察 (Insights) — openclaw-lifelog 生活方式分析引擎
 * 包含：行为交叉分析、专注力热力图、周期性健康周报、异常状态预警
 */
import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { BentoCard } from "@/components/ui/bento-card";
import { SectionHeader } from "@/components/ui/section-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColors } from "@/hooks/use-theme-colors";

// ─── 行为交叉分析卡片 ─────────────────────────────────────────────────────────

const INSIGHTS_DATA = [
  {
    id: "1",
    emoji: "💧",
    highlight: "+40%",
    highlightColor: "#FF5A5A",
    description: "连续 3 天饮水不足时，你的下午疲劳指数上升了",
    tag: "关联发现",
    tagColor: "#5B6EFF",
  },
  {
    id: "2",
    emoji: "🌙",
    highlight: "22:30",
    highlightColor: "#9B6EFF",
    description: "你在此时入睡时，次日专注力评分平均高出 23%",
    tag: "最佳睡眠",
    tagColor: "#9B6EFF",
  },
  {
    id: "3",
    emoji: "☕",
    highlight: "10:00",
    highlightColor: "#FFB347",
    description: "你的深度工作黄金时段，建议安排最重要的任务",
    tag: "效率峰值",
    tagColor: "#00D4AA",
  },
  {
    id: "4",
    emoji: "🧘",
    highlight: "14分钟",
    highlightColor: "#00D4AA",
    description: "午后冥想或轻度拉伸后，下午坐姿达标率提升 31%",
    tag: "习惯关联",
    tagColor: "#FF6B9D",
  },
];

function BehaviorInsightsCard() {
  const colors = useThemeColors();

  return (
    <BentoCard>
      <SectionHeader title="行为交叉分析" subtitle="AI 发现的生活规律" />
      {INSIGHTS_DATA.map((item) => (
        <View key={item.id} style={[styles.insightItem, { borderBottomColor: colors.border }]}>
          <Text style={styles.insightEmoji}>{item.emoji}</Text>
          <View style={styles.insightContent}>
            <View style={styles.insightTopRow}>
              <Text style={[styles.insightHighlight, { color: item.highlightColor }]}>
                {item.highlight}
              </Text>
              <View style={[styles.insightTag, { backgroundColor: `${item.tagColor}18` }]}>
                <Text style={[styles.insightTagText, { color: item.tagColor }]}>{item.tag}</Text>
              </View>
            </View>
            <Text style={[styles.insightDesc, { color: colors.muted }]}>{item.description}</Text>
          </View>
        </View>
      ))}
    </BentoCard>
  );
}

// ─── 专注力热力图（GitHub 风格）────────────────────────────────────────────────

// 生成过去 12 周 × 7 天的模拟数据
const WEEKS = 12;
const DAYS_PER_WEEK = 7;
const HEATMAP_DATA = Array.from({ length: WEEKS }, (_, w) =>
  Array.from({ length: DAYS_PER_WEEK }, (_, d) => {
    if (w === WEEKS - 1 && d > 1) return -1; // 未来日期
    return Math.random() > 0.3 ? Math.floor(Math.random() * 4) : 0;
  })
);

const HEATMAP_COLORS = ["#E8EAEF", "#5B6EFF40", "#5B6EFF80", "#5B6EFFCC", "#5B6EFF"];
const DAY_LABELS = ["一", "三", "五", "日"];

function FocusHeatmapCard() {
  const colors = useThemeColors();

  return (
    <BentoCard>
      <SectionHeader title="专注力热力图" subtitle="过去 12 周" />
      <View style={styles.heatmapContainer}>
        {/* 月份标签 */}
        <View style={styles.heatmapMonths}>
          {["1月", "2月", "3月"].map((m) => (
            <Text key={m} style={[styles.heatmapMonthLabel, { color: colors.muted }]}>{m}</Text>
          ))}
        </View>

        <View style={styles.heatmapBody}>
          {/* 星期标签 */}
          <View style={styles.heatmapDayLabels}>
            {DAY_LABELS.map((d) => (
              <Text key={d} style={[styles.heatmapDayLabel, { color: colors.muted }]}>{d}</Text>
            ))}
          </View>

          {/* 格子 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.heatmapGrid}>
              {HEATMAP_DATA.map((week, wi) => (
                <View key={wi} style={styles.heatmapWeek}>
                  {week.map((level, di) => (
                    <View
                      key={di}
                      style={[
                        styles.heatmapCell,
                        {
                          backgroundColor: level < 0 ? "transparent" : HEATMAP_COLORS[level],
                        },
                      ]}
                    />
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 图例 */}
        <View style={styles.heatmapLegend}>
          <Text style={[styles.heatmapLegendLabel, { color: colors.muted }]}>少</Text>
          {HEATMAP_COLORS.map((c, i) => (
            <View key={i} style={[styles.heatmapCell, { backgroundColor: c }]} />
          ))}
          <Text style={[styles.heatmapLegendLabel, { color: colors.muted }]}>多</Text>
        </View>
      </View>

      {/* 统计摘要 */}
      <View style={styles.heatmapStats}>
        {[
          { label: "本月专注天数", value: "18天", color: "#5B6EFF" },
          { label: "最长连续专注", value: "7天", color: "#FF6B9D" },
          { label: "周均专注时长", value: "5.2h", color: "#00D4AA" },
        ].map((s) => (
          <View key={s.label} style={[styles.heatmapStatItem, { backgroundColor: `${s.color}12` }]}>
            <Text style={[styles.heatmapStatValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.heatmapStatLabel, { color: colors.muted }]}>{s.label}</Text>
          </View>
        ))}
      </View>
    </BentoCard>
  );
}

// ─── 周期性健康周报 ───────────────────────────────────────────────────────────

const WEEKLY_REPORTS = [
  {
    week: "本周",
    period: "3月3日 - 3月9日",
    score: 88,
    color: "#5B6EFF",
    highlights: ["专注时长 +15%", "坐姿达标率 82%", "情绪稳定度 A-"],
    trend: "↑",
  },
  {
    week: "上周",
    period: "2月24日 - 3月2日",
    score: 76,
    color: "#FF6B9D",
    highlights: ["饮水量不足", "睡眠规律度 B+", "专注时长 -8%"],
    trend: "↓",
  },
  {
    week: "2月第3周",
    period: "2月17日 - 2月23日",
    score: 82,
    color: "#00D4AA",
    highlights: ["体态改善明显", "用药依从性 95%", "情绪波动较小"],
    trend: "→",
  },
];

function WeeklyReportCard() {
  const colors = useThemeColors();
  const scrollRef = useRef<ScrollView>(null);

  return (
    <BentoCard>
      <SectionHeader title="健康周报" subtitle="滑动查看历史" />
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weeklyScrollContent}
      >
        {WEEKLY_REPORTS.map((report) => (
          <View key={report.week} style={[styles.weeklyCard, { borderColor: `${report.color}40` }]}>
            <View style={styles.weeklyHeader}>
              <View>
                <Text style={[styles.weeklyWeek, { color: colors.foreground }]}>{report.week}</Text>
                <Text style={[styles.weeklyPeriod, { color: colors.muted }]}>{report.period}</Text>
              </View>
              <View style={[styles.weeklyScoreBadge, { backgroundColor: `${report.color}18` }]}>
                <Text style={[styles.weeklyScore, { color: report.color }]}>{report.score}</Text>
                <Text style={[styles.weeklyTrend, { color: report.color }]}>{report.trend}</Text>
              </View>
            </View>
            <View style={styles.weeklyHighlights}>
              {report.highlights.map((h) => (
                <View key={h} style={[styles.weeklyTag, { backgroundColor: colors.surface2 }]}>
                  <Text style={[styles.weeklyTagText, { color: colors.muted }]}>{h}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </BentoCard>
  );
}

// ─── 异常状态预警卡片 ─────────────────────────────────────────────────────────

const ALERTS = [
  {
    id: "1",
    level: "warning",
    title: "饮水量持续偏低",
    desc: "连续 3 天日均饮水量低于 1200ml，建议增加饮水提醒频率",
    action: "设置提醒",
    color: "#FFB347",
    emoji: "💧",
  },
  {
    id: "2",
    level: "info",
    title: "作息时间略有延迟",
    desc: "本周平均入睡时间比上周晚 45 分钟，建议调整作息",
    action: "查看建议",
    color: "#5B6EFF",
    emoji: "🌙",
  },
];

function AlertsCard() {
  const colors = useThemeColors();

  return (
    <BentoCard>
      <SectionHeader title="智能预警" subtitle="需要关注的问题" />
      {ALERTS.map((alert) => (
        <View key={alert.id} style={[styles.alertItem, { backgroundColor: `${alert.color}12`, borderLeftColor: alert.color }]}>
          <Text style={styles.alertEmoji}>{alert.emoji}</Text>
          <View style={styles.alertContent}>
            <Text style={[styles.alertTitle, { color: colors.foreground }]}>{alert.title}</Text>
            <Text style={[styles.alertDesc, { color: colors.muted }]}>{alert.desc}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.alertAction,
                { backgroundColor: `${alert.color}20` },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={[styles.alertActionText, { color: alert.color }]}>{alert.action}</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </BentoCard>
  );
}

// ─── 主页面 ───────────────────────────────────────────────────────────────────

export default function InsightsScreen() {
  const colors = useThemeColors();

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <Text style={[styles.pageTitle, { color: colors.foreground }]}>洞察</Text>
          <Text style={[styles.pageSubtitle, { color: colors.muted }]}>AI 生活方式分析</Text>
        </View>

        {/* 概览数字 */}
        <View style={styles.overviewRow}>
          {[
            { label: "本月洞察", value: "12条", color: "#5B6EFF", emoji: "💡" },
            { label: "改善趋势", value: "+8%", color: "#00D4AA", emoji: "📈" },
          ].map((item, i) => (
            <BentoCard
              key={item.label}
              size="half"
              style={i === 0 ? styles.halfCardMargin : styles.halfCardMarginLeft}
            >
              <Text style={styles.overviewEmoji}>{item.emoji}</Text>
              <Text style={[styles.overviewValue, { color: item.color }]}>{item.value}</Text>
              <Text style={[styles.overviewLabel, { color: colors.muted }]}>{item.label}</Text>
            </BentoCard>
          ))}
        </View>

        <AlertsCard />
        <BehaviorInsightsCard />
        <FocusHeatmapCard />
        <WeeklyReportCard />
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── 样式 ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },
  pageHeader: { marginBottom: 16 },
  pageTitle: { fontSize: 32, fontWeight: "800", letterSpacing: -1 },
  pageSubtitle: { fontSize: 14, marginTop: 2 },

  overviewRow: { flexDirection: "row", marginBottom: 0 },
  halfCardMargin: { marginRight: 6, marginBottom: 12 },
  halfCardMarginLeft: { marginLeft: 6, marginBottom: 12 },
  overviewEmoji: { fontSize: 28, marginBottom: 8 },
  overviewValue: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
  overviewLabel: { fontSize: 14, marginTop: 2 },

  // 行为分析
  insightItem: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  insightEmoji: { fontSize: 28, marginTop: 2 },
  insightContent: { flex: 1 },
  insightTopRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  insightHighlight: { fontSize: 22, fontWeight: "800", letterSpacing: -0.5 },
  insightTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  insightTagText: { fontSize: 13, fontWeight: "600" },
  insightDesc: { fontSize: 13, lineHeight: 18 },

  // 热力图
  heatmapContainer: { marginBottom: 12 },
  heatmapMonths: { flexDirection: "row", justifyContent: "space-around", marginBottom: 4 },
  heatmapMonthLabel: { fontSize: 10 },
  heatmapBody: { flexDirection: "row" },
  heatmapDayLabels: { justifyContent: "space-between", marginRight: 4, paddingVertical: 2 },
  heatmapDayLabel: { fontSize: 13, height: 14, lineHeight: 14 },
  heatmapGrid: { flexDirection: "row", gap: 3 },
  heatmapWeek: { gap: 3 },
  heatmapCell: { width: 12, height: 12, borderRadius: 3 },
  heatmapLegend: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 8, justifyContent: "flex-end" },
  heatmapLegendLabel: { fontSize: 13, marginHorizontal: 2 },
  heatmapStats: { flexDirection: "row", gap: 8 },
  heatmapStatItem: { flex: 1, padding: 10, borderRadius: 12, alignItems: "center" },
  heatmapStatValue: { fontSize: 18, fontWeight: "700" },
  heatmapStatLabel: { fontSize: 13, marginTop: 2, textAlign: "center" },

  // 周报
  weeklyScrollContent: { gap: 12, paddingRight: 16 },
  weeklyCard: {
    width: 220,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
  },
  weeklyHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  weeklyWeek: { fontSize: 16, fontWeight: "700" },
  weeklyPeriod: { fontSize: 13, marginTop: 2 },
  weeklyScoreBadge: { padding: 8, borderRadius: 12, alignItems: "center" },
  weeklyScore: { fontSize: 22, fontWeight: "800" },
  weeklyTrend: { fontSize: 14, fontWeight: "600" },
  weeklyHighlights: { gap: 6 },
  weeklyTag: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  weeklyTagText: { fontSize: 12 },

  // 预警
  alertItem: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 3,
    marginBottom: 10,
  },
  alertEmoji: { fontSize: 24, marginTop: 2 },
  alertContent: { flex: 1, gap: 4 },
  alertTitle: { fontSize: 14, fontWeight: "600" },
  alertDesc: { fontSize: 14, lineHeight: 18 },
  alertAction: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  alertActionText: { fontSize: 14, fontWeight: "600" },
});
