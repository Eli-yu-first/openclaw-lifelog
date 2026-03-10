/**
 * 健康 (Health) — openclaw-lifelog v2.0
 * Apple Health 级精致设计：毛玻璃面板、精致动画、统一图标、专业排版
 */
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Polyline, Rect, Stop } from "react-native-svg";
import { BlurView } from "expo-blur";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useAppContext } from "@/lib/app-context";
import { useSettings } from "@/lib/settings-context";
import Animated2, { FadeInDown } from "react-native-reanimated";

// ─── Apple Health 色彩 ──────────────────────────────────────────────────────

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

// ─── 体态健康卡片 ───────────────────────────────────────────────────────────

const POSTURE_DAYS = ["一", "二", "三", "四", "五", "六", "日"];
const POSTURE_SCORES = [75, 82, 68, 90, 85, 78, 82];

function PostureCard() {
  const colors = useThemeColors();
  const { state } = useAppContext();

  return (
    <Animated2.View entering={FadeInDown.delay(200).duration(600)}>
      <GlassPanel style={{ padding: 20 }}>
        <View style={s.cardHeader}>
          <View style={[s.cardIconWrap, { backgroundColor: `${AH.pink}14` }]}>
            <IconSymbol name="figure.stand" size={18} color={AH.pink} />
          </View>
          <View>
            <Text style={[s.cardTitle, { color: colors.foreground }]}>体态健康</Text>
            <Text style={[s.cardSub, { color: colors.muted }]}>本周坐姿评分</Text>
          </View>
        </View>

        <View style={s.scoreRow}>
          <View>
            <Text style={[s.bigScore, { color: AH.pink }]}>{state.postureScore}</Text>
            <Text style={[s.bigScoreLabel, { color: colors.muted }]}>今日综合评分</Text>
          </View>
          <View style={s.postureStats}>
            {[
              { label: "前倾次数", value: "3次", color: AH.red },
              { label: "跷腿时长", value: "12分钟", color: AH.orange },
              { label: "标准坐姿", value: "6.2小时", color: AH.green },
            ].map((item) => (
              <View key={item.label} style={s.statItem}>
                <Text style={[s.statValue, { color: item.color }]}>{item.value}</Text>
                <Text style={[s.statLabel, { color: colors.muted }]}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 柱状图 */}
        <View style={s.barChart}>
          {POSTURE_SCORES.map((score, i) => {
            const isToday = i === 6;
            return (
              <View key={i} style={s.barItem}>
                <View style={s.barWrapper}>
                  <View style={[s.bar, {
                    height: (score / 100) * 60,
                    backgroundColor: isToday ? AH.pink : `${AH.pink}30`,
                    borderRadius: 5,
                  }]} />
                </View>
                <Text style={[s.barLabel, { color: isToday ? colors.foreground : colors.muted, fontWeight: isToday ? "700" : "500" }]}>
                  {POSTURE_DAYS[i]}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={[s.alertBox, { backgroundColor: `${AH.orange}10` }]}>
          <IconSymbol name="exclamationmark.triangle.fill" size={14} color={AH.orange} />
          <Text style={[s.alertText, { color: AH.orange }]}>
            颈椎预估疲劳负荷：中等 · 建议每 45 分钟起身活动
          </Text>
        </View>
      </GlassPanel>
    </Animated2.View>
  );
}

// ─── 用药依从性卡片 ─────────────────────────────────────────────────────────

const CALENDAR_DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

function MedicationCard() {
  const colors = useThemeColors();
  const { state, toggleMedication } = useAppContext();
  const completedDays = new Set([1,2,3,4,5,6,8,9,10,11,12,13,15,16,17,18,19,20,22,23,24,25,26,27,28,29,30]);

  return (
    <Animated2.View entering={FadeInDown.delay(300).duration(600)}>
      <GlassPanel style={{ padding: 20 }}>
        <View style={s.cardHeader}>
          <View style={[s.cardIconWrap, { backgroundColor: `${AH.green}14` }]}>
            <IconSymbol name="pills.fill" size={18} color={AH.green} />
          </View>
          <View>
            <Text style={[s.cardTitle, { color: colors.foreground }]}>用药依从性</Text>
            <Text style={[s.cardSub, { color: colors.muted }]}>AI 自动识别打卡</Text>
          </View>
        </View>

        <View style={s.calendarGrid}>
          {CALENDAR_DAYS.map((day) => {
            const done = completedDays.has(day);
            const isToday = day === 10;
            return (
              <View key={day} style={[
                s.calDay,
                done && { backgroundColor: `${AH.green}18` },
                isToday && { borderWidth: 1.5, borderColor: AH.blue },
              ]}>
                {done ? (
                  <IconSymbol name="checkmark" size={12} color={AH.green} />
                ) : (
                  <Text style={[s.calDayNum, { color: isToday ? AH.blue : colors.muted }]}>{day}</Text>
                )}
              </View>
            );
          })}
        </View>

        {state.medications.map((med) => (
          <View key={med.id} style={[s.medItem, { borderBottomColor: `${colors.border}40` }]}>
            <View style={[s.medIcon, { backgroundColor: `${AH.indigo}12` }]}>
              <IconSymbol name="pills.fill" size={16} color={AH.indigo} />
            </View>
            <View style={s.medInfo}>
              <Text style={[s.medName, { color: colors.foreground }]}>{med.name}</Text>
              <Text style={[s.medDose, { color: colors.muted }]}>{med.dose} · {med.times.join(" / ")}</Text>
            </View>
            <View style={s.medChecks}>
              {med.taken.map((taken, idx) => (
                <Pressable
                  key={idx}
                  style={({ pressed }) => [
                    s.medCheckBtn,
                    { backgroundColor: taken ? `${AH.green}18` : `${colors.surface2}` },
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => toggleMedication(med.id, idx)}
                >
                  {taken ? (
                    <IconSymbol name="checkmark.circle.fill" size={16} color={AH.green} />
                  ) : (
                    <View style={[s.medCheckEmpty, { borderColor: colors.border }]} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </GlassPanel>
    </Animated2.View>
  );
}

// ─── 眼部疲劳卡片 ───────────────────────────────────────────────────────────

const EYE_DATA = [30, 45, 20, 55, 40, 35, 45, 60, 50, 45, 55, 48];

function EyeFatigueCard() {
  const colors = useThemeColors();
  const { state } = useAppContext();
  const W = 300, H = 80, maxV = 70;
  const stepX = W / (EYE_DATA.length - 1);
  const pts = EYE_DATA.map((v, i) => `${i * stepX},${H - (v / maxV) * H}`).join(" ");

  return (
    <Animated2.View entering={FadeInDown.delay(400).duration(600)}>
      <GlassPanel style={{ padding: 20 }}>
        <View style={s.cardHeader}>
          <View style={[s.cardIconWrap, { backgroundColor: `${AH.blue}14` }]}>
            <IconSymbol name="eye.fill" size={18} color={AH.blue} />
          </View>
          <View>
            <Text style={[s.cardTitle, { color: colors.foreground }]}>眼部疲劳</Text>
            <Text style={[s.cardSub, { color: colors.muted }]}>今日监测</Text>
          </View>
        </View>

        <View style={s.eyeRow}>
          <View>
            <Text style={[s.bigScore, { color: AH.blue, fontSize: 36 }]}>{state.eyeFatigueMinutes}</Text>
            <Text style={[s.bigScoreLabel, { color: colors.muted }]}>分钟过近用眼</Text>
          </View>
          <View style={[s.eyeBadge, { backgroundColor: `${AH.orange}12` }]}>
            <Text style={{ fontSize: 22 }}>👁️</Text>
            <Text style={[s.eyeBadgeTitle, { color: AH.orange }]}>20-20-20</Text>
            <Text style={[s.eyeBadgeSub, { color: colors.muted }]}>每20分钟远眺20秒</Text>
          </View>
        </View>

        <View style={s.chartWrap}>
          <Svg width="100%" height={H + 10} viewBox={`0 0 ${W} ${H + 10}`}>
            <Defs>
              <LinearGradient id="eyeG" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor={AH.blue} />
                <Stop offset="100%" stopColor={AH.teal} />
              </LinearGradient>
            </Defs>
            <Polyline points={pts} fill="none" stroke="url(#eyeG)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <View style={s.chartLabels}>
            {["8:00", "11:00", "14:00", "17:00", "19:00"].map((l) => (
              <Text key={l} style={[s.chartLabel, { color: colors.muted }]}>{l}</Text>
            ))}
          </View>
        </View>

        <View style={[s.tipBox, { backgroundColor: `${colors.surface2}` }]}>
          <Text style={[s.tipText, { color: colors.muted }]}>
            💡 AI 建议：今日眨眼频率偏低，建议使用人工泪液，并在明亮环境下工作
          </Text>
        </View>
      </GlassPanel>
    </Animated2.View>
  );
}

// ─── 情绪与压力波形卡片 ─────────────────────────────────────────────────────

const STRESS_DATA = [0.3, 0.4, 0.6, 0.5, 0.3, 0.4, 0.7, 0.8, 0.6, 0.5, 0.4, 0.35];

function StressWaveCard() {
  const colors = useThemeColors();
  const { state } = useAppContext();
  const W = 300, H = 60;
  const stepX = W / (STRESS_DATA.length - 1);

  const smoothPath = (data: number[]) => {
    const points = data.map((v, i) => ({ x: i * stepX, y: H - v * H }));
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const cpX = (points[i - 1].x + points[i].x) / 2;
      d += ` C ${cpX} ${points[i - 1].y}, ${cpX} ${points[i].y}, ${points[i].x} ${points[i].y}`;
    }
    return d;
  };

  const pathD = smoothPath(STRESS_DATA);
  const fillD = `${pathD} L ${(STRESS_DATA.length - 1) * stepX} ${H} L 0 ${H} Z`;
  const stressText = state.stressLevel < 0.4 ? "低压" : state.stressLevel < 0.7 ? "中等" : "高压";
  const stressColor = state.stressLevel < 0.4 ? AH.green : state.stressLevel < 0.7 ? AH.orange : AH.red;

  return (
    <Animated2.View entering={FadeInDown.delay(500).duration(600)}>
      <GlassPanel style={{ padding: 20 }}>
        <View style={s.cardHeader}>
          <View style={[s.cardIconWrap, { backgroundColor: `${AH.purple}14` }]}>
            <IconSymbol name="waveform.path.ecg" size={18} color={AH.purple} />
          </View>
          <View>
            <Text style={[s.cardTitle, { color: colors.foreground }]}>情绪与压力</Text>
            <Text style={[s.cardSub, { color: colors.muted }]}>基于表情与语音分析</Text>
          </View>
        </View>

        <View style={s.stressRow}>
          <View>
            <Text style={[s.stressLevel, { color: stressColor }]}>{stressText}</Text>
            <Text style={[s.bigScoreLabel, { color: colors.muted }]}>当前压力等级</Text>
          </View>
          <View style={s.moodRow}>
            {[
              { emoji: "😊", pct: "45%", color: AH.yellow },
              { emoji: "😐", pct: "38%", color: AH.green },
              { emoji: "😤", pct: "17%", color: AH.red },
            ].map((m, i) => (
              <View key={i} style={s.moodItem}>
                <Text style={{ fontSize: 20 }}>{m.emoji}</Text>
                <Text style={[s.moodPct, { color: m.color }]}>{m.pct}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.chartWrap}>
          <Svg width="100%" height={H + 10} viewBox={`0 0 ${W} ${H + 10}`}>
            <Defs>
              <LinearGradient id="stressG" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={stressColor} stopOpacity="0.2" />
                <Stop offset="100%" stopColor={stressColor} stopOpacity="0.02" />
              </LinearGradient>
            </Defs>
            <Path d={fillD} fill="url(#stressG)" />
            <Path d={pathD} fill="none" stroke={stressColor} strokeWidth="2.5" strokeLinecap="round" />
          </Svg>
          <View style={s.chartLabels}>
            {["8:00", "11:00", "14:00", "17:00", "19:00"].map((l) => (
              <Text key={l} style={[s.chartLabel, { color: colors.muted }]}>{l}</Text>
            ))}
          </View>
        </View>

        <View style={[s.tipBox, { backgroundColor: `${colors.surface2}` }]}>
          <Text style={[s.tipText, { color: colors.muted }]}>
            📊 下午 14:00-15:00 为今日压力峰值时段，建议安排轻松任务
          </Text>
        </View>
      </GlassPanel>
    </Animated2.View>
  );
}

// ─── 主页面 ─────────────────────────────────────────────────────────────────

export default function HealthScreen() {
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
          <Text style={[s.pageTitle, { color: colors.foreground }]}>{t("health")}</Text>
          <Text style={[s.pageSub, { color: colors.muted }]}>专业级数据看板</Text>
        </Animated2.View>

        {/* 概览双卡 */}
        <Animated2.View entering={FadeInDown.delay(100).duration(600)} style={s.overviewRow}>
          {[
            { label: "综合健康分", value: "86", color: AH.blue, icon: "star.fill" as const },
            { label: "今日活跃度", value: "良好", color: AH.green, icon: "bolt.fill" as const },
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

        <PostureCard />
        <MedicationCard />
        <EyeFatigueCard />
        <StressWaveCard />

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

  // Card Header
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  cardIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 18, fontWeight: "700", letterSpacing: -0.2 },
  cardSub: { fontSize: 13, letterSpacing: 0.1 },

  // Posture
  scoreRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 },
  bigScore: { fontSize: 48, fontWeight: "800", letterSpacing: -2 },
  bigScoreLabel: { fontSize: 13, marginTop: 2 },
  postureStats: { gap: 8, alignItems: "flex-end" },
  statItem: { alignItems: "flex-end" },
  statValue: { fontSize: 15, fontWeight: "700" },
  statLabel: { fontSize: 11, letterSpacing: 0.1 },
  barChart: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 80, marginBottom: 12 },
  barItem: { alignItems: "center", flex: 1 },
  barWrapper: { height: 60, justifyContent: "flex-end", width: "100%" },
  bar: { width: "65%", alignSelf: "center" },
  barLabel: { fontSize: 12, marginTop: 4 },
  alertBox: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 12 },
  alertText: { fontSize: 13, flex: 1, lineHeight: 18, fontWeight: "500" },

  // Medication
  calendarGrid: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 16 },
  calDay: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  calDayNum: { fontSize: 12, fontWeight: "500" },
  medItem: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  medIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  medInfo: { flex: 1 },
  medName: { fontSize: 15, fontWeight: "600" },
  medDose: { fontSize: 13, marginTop: 2 },
  medChecks: { flexDirection: "row", gap: 4 },
  medCheckBtn: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  medCheckEmpty: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5 },

  // Eye
  eyeRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 },
  eyeBadge: { padding: 12, borderRadius: 14, alignItems: "center", gap: 4 },
  eyeBadgeTitle: { fontSize: 14, fontWeight: "700" },
  eyeBadgeSub: { fontSize: 11 },

  // Charts
  chartWrap: { marginBottom: 12 },
  chartLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  chartLabel: { fontSize: 11 },
  tipBox: { padding: 12, borderRadius: 12 },
  tipText: { fontSize: 13, lineHeight: 19 },

  // Stress
  stressRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 },
  stressLevel: { fontSize: 36, fontWeight: "800", letterSpacing: -1 },
  moodRow: { flexDirection: "row", gap: 14 },
  moodItem: { alignItems: "center", gap: 4 },
  moodPct: { fontSize: 13, fontWeight: "700" },
});
