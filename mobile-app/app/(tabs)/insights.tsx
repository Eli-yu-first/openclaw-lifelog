/**
 * 洞察 (Insights) — openclaw-lifelog v2.0
 * Apple Health 级精致设计：毛玻璃面板、精致动画、统一图标、专业排版
 */
import React, { useRef } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useSettings } from "@/lib/settings-context";
import Animated2, { FadeInDown } from "react-native-reanimated";

const AH = {
  pink: "#FF2D55", green: "#30D158", cyan: "#00C7BE", blue: "#007AFF",
  orange: "#FF9500", red: "#FF3B30", purple: "#AF52DE", yellow: "#FFD60A",
  indigo: "#5856D6", teal: "#5AC8FA",
};

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

// ─── 行为交叉分析 ───────────────────────────────────────────────────────────

const INSIGHTS_DATA = [
  { icon: "drop.fill" as const, highlight: "+40%", hColor: AH.red, desc: "连续 3 天饮水不足时，你的下午疲劳指数上升了", tag: "关联发现", tColor: AH.blue, iconColor: AH.cyan },
  { icon: "moon.fill" as const, highlight: "22:30", hColor: AH.purple, desc: "你在此时入睡时，次日专注力评分平均高出 23%", tag: "最佳睡眠", tColor: AH.purple, iconColor: AH.indigo },
  { icon: "flame.fill" as const, highlight: "10:00", hColor: AH.orange, desc: "你的深度工作黄金时段，建议安排最重要的任务", tag: "效率峰值", tColor: AH.green, iconColor: AH.orange },
  { icon: "sparkles" as const, highlight: "14分钟", hColor: AH.green, desc: "午后冥想或轻度拉伸后，下午坐姿达标率提升 31%", tag: "习惯关联", tColor: AH.pink, iconColor: AH.green },
];

function BehaviorInsightsCard() {
  const colors = useThemeColors();
  return (
    <Animated2.View entering={FadeInDown.delay(200).duration(600)}>
      <GlassPanel style={{ padding: 20 }}>
        <View style={s.cardHeader}>
          <View style={[s.cardIconWrap, { backgroundColor: `${AH.blue}14` }]}>
            <IconSymbol name="brain.head.profile" size={18} color={AH.blue} />
          </View>
          <View>
            <Text style={[s.cardTitle, { color: colors.foreground }]}>行为交叉分析</Text>
            <Text style={[s.cardSub, { color: colors.muted }]}>AI 发现的生活规律</Text>
          </View>
        </View>
        {INSIGHTS_DATA.map((item, i) => (
          <View key={i} style={[s.insightItem, { borderBottomColor: `${colors.border}30` }]}>
            <View style={[s.insightIcon, { backgroundColor: `${item.iconColor}14` }]}>
              <IconSymbol name={item.icon} size={18} color={item.iconColor} />
            </View>
            <View style={s.insightContent}>
              <View style={s.insightTopRow}>
                <Text style={[s.insightHighlight, { color: item.hColor }]}>{item.highlight}</Text>
                <View style={[s.insightTag, { backgroundColor: `${item.tColor}14` }]}>
                  <Text style={[s.insightTagText, { color: item.tColor }]}>{item.tag}</Text>
                </View>
              </View>
              <Text style={[s.insightDesc, { color: colors.muted }]}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </GlassPanel>
    </Animated2.View>
  );
}

// ─── 专注力热力图 ───────────────────────────────────────────────────────────

const WEEKS = 12;
const HEATMAP_DATA = Array.from({ length: WEEKS }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => {
    if (w === WEEKS - 1 && d > 1) return -1;
    return Math.random() > 0.3 ? Math.floor(Math.random() * 4) : 0;
  })
);
const HEATMAP_COLORS = ["#E8EAEF", `${AH.blue}30`, `${AH.blue}60`, `${AH.blue}90`, AH.blue];

function FocusHeatmapCard() {
  const colors = useThemeColors();
  return (
    <Animated2.View entering={FadeInDown.delay(300).duration(600)}>
      <GlassPanel style={{ padding: 20 }}>
        <View style={s.cardHeader}>
          <View style={[s.cardIconWrap, { backgroundColor: `${AH.indigo}14` }]}>
            <IconSymbol name="sparkles" size={18} color={AH.indigo} />
          </View>
          <View>
            <Text style={[s.cardTitle, { color: colors.foreground }]}>专注力热力图</Text>
            <Text style={[s.cardSub, { color: colors.muted }]}>过去 12 周</Text>
          </View>
        </View>

        <View style={s.heatmapBody}>
          <View style={s.heatmapDayLabels}>
            {["一", "三", "五", "日"].map((d) => (
              <Text key={d} style={[s.heatmapDayLabel, { color: colors.muted }]}>{d}</Text>
            ))}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={s.heatmapGrid}>
              {HEATMAP_DATA.map((week, wi) => (
                <View key={wi} style={s.heatmapWeek}>
                  {week.map((level, di) => (
                    <View key={di} style={[s.heatmapCell, {
                      backgroundColor: level < 0 ? "transparent" : HEATMAP_COLORS[level],
                    }]} />
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={s.heatmapLegend}>
          <Text style={[s.legendLabel, { color: colors.muted }]}>少</Text>
          {HEATMAP_COLORS.map((c, i) => (
            <View key={i} style={[s.heatmapCell, { backgroundColor: c }]} />
          ))}
          <Text style={[s.legendLabel, { color: colors.muted }]}>多</Text>
        </View>

        <View style={s.statsRow}>
          {[
            { label: "本月专注天数", value: "18天", color: AH.blue },
            { label: "最长连续专注", value: "7天", color: AH.pink },
            { label: "周均专注时长", value: "5.2h", color: AH.green },
          ].map((item) => (
            <View key={item.label} style={[s.statCard, { backgroundColor: `${item.color}10` }]}>
              <Text style={[s.statCardValue, { color: item.color }]}>{item.value}</Text>
              <Text style={[s.statCardLabel, { color: colors.muted }]}>{item.label}</Text>
            </View>
          ))}
        </View>
      </GlassPanel>
    </Animated2.View>
  );
}

// ─── 健康周报 ───────────────────────────────────────────────────────────────

const WEEKLY_REPORTS = [
  { week: "本周", period: "3月3日 - 3月9日", score: 88, color: AH.blue, highlights: ["专注时长 +15%", "坐姿达标率 82%", "情绪稳定度 A-"], trend: "↑" },
  { week: "上周", period: "2月24日 - 3月2日", score: 76, color: AH.pink, highlights: ["饮水量不足", "睡眠规律度 B+", "专注时长 -8%"], trend: "↓" },
  { week: "2月第3周", period: "2月17日 - 2月23日", score: 82, color: AH.green, highlights: ["体态改善明显", "用药依从性 95%", "情绪波动较小"], trend: "→" },
];

function WeeklyReportCard() {
  const colors = useThemeColors();
  return (
    <Animated2.View entering={FadeInDown.delay(400).duration(600)}>
      <GlassPanel style={{ padding: 20 }}>
        <View style={s.cardHeader}>
          <View style={[s.cardIconWrap, { backgroundColor: `${AH.teal}14` }]}>
            <IconSymbol name="calendar" size={18} color={AH.teal} />
          </View>
          <View>
            <Text style={[s.cardTitle, { color: colors.foreground }]}>健康周报</Text>
            <Text style={[s.cardSub, { color: colors.muted }]}>滑动查看历史</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 4 }}>
          {WEEKLY_REPORTS.map((r) => (
            <View key={r.week} style={[s.weeklyCard, { borderColor: `${r.color}30`, backgroundColor: `${r.color}06` }]}>
              <View style={s.weeklyHeader}>
                <View>
                  <Text style={[s.weeklyWeek, { color: colors.foreground }]}>{r.week}</Text>
                  <Text style={[s.weeklyPeriod, { color: colors.muted }]}>{r.period}</Text>
                </View>
                <View style={[s.weeklyBadge, { backgroundColor: `${r.color}14` }]}>
                  <Text style={[s.weeklyScore, { color: r.color }]}>{r.score}</Text>
                  <Text style={[s.weeklyTrend, { color: r.color }]}>{r.trend}</Text>
                </View>
              </View>
              <View style={s.weeklyTags}>
                {r.highlights.map((h) => (
                  <View key={h} style={[s.weeklyTag, { backgroundColor: `${colors.surface2}` }]}>
                    <Text style={[s.weeklyTagText, { color: colors.muted }]}>{h}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </GlassPanel>
    </Animated2.View>
  );
}

// ─── 智能预警 ───────────────────────────────────────────────────────────────

const ALERTS = [
  { id: "1", icon: "drop.fill" as const, title: "饮水量持续偏低", desc: "连续 3 天日均饮水量低于 1200ml，建议增加饮水提醒频率", action: "设置提醒", color: AH.orange },
  { id: "2", icon: "moon.fill" as const, title: "作息时间略有延迟", desc: "本周平均入睡时间比上周晚 45 分钟，建议调整作息", action: "查看建议", color: AH.indigo },
];

function AlertsCard() {
  const colors = useThemeColors();
  return (
    <Animated2.View entering={FadeInDown.delay(100).duration(600)}>
      <GlassPanel style={{ padding: 20 }}>
        <View style={s.cardHeader}>
          <View style={[s.cardIconWrap, { backgroundColor: `${AH.orange}14` }]}>
            <IconSymbol name="exclamationmark.triangle.fill" size={18} color={AH.orange} />
          </View>
          <View>
            <Text style={[s.cardTitle, { color: colors.foreground }]}>智能预警</Text>
            <Text style={[s.cardSub, { color: colors.muted }]}>需要关注的问题</Text>
          </View>
        </View>
        {ALERTS.map((a) => (
          <View key={a.id} style={[s.alertItem, { backgroundColor: `${a.color}08`, borderLeftColor: a.color }]}>
            <View style={[s.alertIconWrap, { backgroundColor: `${a.color}14` }]}>
              <IconSymbol name={a.icon} size={16} color={a.color} />
            </View>
            <View style={s.alertContent}>
              <Text style={[s.alertTitle, { color: colors.foreground }]}>{a.title}</Text>
              <Text style={[s.alertDesc, { color: colors.muted }]}>{a.desc}</Text>
              <Pressable style={({ pressed }) => [s.alertAction, { backgroundColor: `${a.color}14` }, pressed && { opacity: 0.7 }]}>
                <Text style={[s.alertActionText, { color: a.color }]}>{a.action}</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </GlassPanel>
    </Animated2.View>
  );
}

// ─── 主页面 ─────────────────────────────────────────────────────────────────

export default function InsightsScreen() {
  const colors = useThemeColors();
  const { t } = useSettings();

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        style={[s.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated2.View entering={FadeInDown.duration(500)}>
          <Text style={[s.pageTitle, { color: colors.foreground }]}>{t("insights")}</Text>
          <Text style={[s.pageSub, { color: colors.muted }]}>AI 生活方式分析</Text>
        </Animated2.View>

        {/* 概览双卡 */}
        <Animated2.View entering={FadeInDown.delay(50).duration(600)} style={s.overviewRow}>
          {[
            { label: "本月洞察", value: "12条", color: AH.blue, icon: "sparkles" as const },
            { label: "改善趋势", value: "+8%", color: AH.green, icon: "bolt.fill" as const },
          ].map((item) => (
            <GlassPanel key={item.label} style={{ flex: 1, padding: 16, marginHorizontal: 4 }}>
              <View style={[s.cardIconWrap, { backgroundColor: `${item.color}14`, marginBottom: 8 }]}>
                <IconSymbol name={item.icon} size={16} color={item.color} />
              </View>
              <Text style={[s.overviewValue, { color: item.color }]}>{item.value}</Text>
              <Text style={[s.overviewLabel, { color: colors.muted }]}>{item.label}</Text>
            </GlassPanel>
          ))}
        </Animated2.View>

        <AlertsCard />
        <BehaviorInsightsCard />
        <FocusHeatmapCard />
        <WeeklyReportCard />

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── 样式 ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 },
  pageTitle: { fontSize: 34, fontWeight: "800", letterSpacing: -0.8 },
  pageSub: { fontSize: 15, marginTop: 2, marginBottom: 16, letterSpacing: 0.1 },

  overviewRow: { flexDirection: "row", marginHorizontal: -4, marginBottom: 0 },
  overviewValue: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
  overviewLabel: { fontSize: 13, marginTop: 2, letterSpacing: 0.1 },

  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  cardIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 18, fontWeight: "700", letterSpacing: -0.2 },
  cardSub: { fontSize: 13, letterSpacing: 0.1 },

  // Insights
  insightItem: { flexDirection: "row", gap: 12, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  insightIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 2 },
  insightContent: { flex: 1 },
  insightTopRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  insightHighlight: { fontSize: 22, fontWeight: "800", letterSpacing: -0.5 },
  insightTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  insightTagText: { fontSize: 12, fontWeight: "600" },
  insightDesc: { fontSize: 13, lineHeight: 19 },

  // Heatmap
  heatmapBody: { flexDirection: "row", marginBottom: 8 },
  heatmapDayLabels: { justifyContent: "space-between", marginRight: 4, paddingVertical: 2 },
  heatmapDayLabel: { fontSize: 11, height: 14, lineHeight: 14 },
  heatmapGrid: { flexDirection: "row", gap: 3 },
  heatmapWeek: { gap: 3 },
  heatmapCell: { width: 12, height: 12, borderRadius: 3 },
  heatmapLegend: { flexDirection: "row", alignItems: "center", gap: 3, marginBottom: 12, justifyContent: "flex-end" },
  legendLabel: { fontSize: 11, marginHorizontal: 2 },
  statsRow: { flexDirection: "row", gap: 8 },
  statCard: { flex: 1, padding: 12, borderRadius: 14, alignItems: "center" },
  statCardValue: { fontSize: 18, fontWeight: "700" },
  statCardLabel: { fontSize: 11, marginTop: 2, textAlign: "center" },

  // Weekly
  weeklyCard: { width: 220, borderRadius: 16, borderWidth: 1, padding: 14 },
  weeklyHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  weeklyWeek: { fontSize: 16, fontWeight: "700" },
  weeklyPeriod: { fontSize: 12, marginTop: 2 },
  weeklyBadge: { padding: 8, borderRadius: 12, alignItems: "center" },
  weeklyScore: { fontSize: 22, fontWeight: "800" },
  weeklyTrend: { fontSize: 14, fontWeight: "600" },
  weeklyTags: { gap: 6 },
  weeklyTag: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  weeklyTagText: { fontSize: 12 },

  // Alerts
  alertItem: { flexDirection: "row", gap: 12, padding: 14, borderRadius: 14, borderLeftWidth: 3, marginBottom: 10 },
  alertIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 2 },
  alertContent: { flex: 1, gap: 4 },
  alertTitle: { fontSize: 15, fontWeight: "600" },
  alertDesc: { fontSize: 13, lineHeight: 19 },
  alertAction: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginTop: 4 },
  alertActionText: { fontSize: 13, fontWeight: "600" },
});
