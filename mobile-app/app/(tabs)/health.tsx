/**
 * 健康 (Health) — openclaw-lifelog 专业级数据看板
 * 包含：体态骨骼健康、用药依从性、眼部疲劳监测、情绪压力波形
 */
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Polyline, Stop } from "react-native-svg";
import { LinearGradient as ExpoGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { BentoCard } from "@/components/ui/bento-card";
import { SectionHeader } from "@/components/ui/section-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useAppContext } from "@/lib/app-context";

// ─── 体态骨骼健康卡片 ─────────────────────────────────────────────────────────

const POSTURE_DAYS = ["一", "二", "三", "四", "五", "六", "日"];
const POSTURE_SCORES = [75, 82, 68, 90, 85, 78, 82];

function PostureCard() {
  const colors = useThemeColors();
  const { state } = useAppContext();
  const maxScore = 100;
  const barWidth = 24;

  return (
    <BentoCard>
      <SectionHeader title="体态健康" subtitle="本周坐姿评分" />

      {/* 今日评分大字 */}
      <View style={styles.scoreRow}>
        <View>
          <Text style={[styles.bigScore, { color: "#FF6B9D" }]}>{state.postureScore}</Text>
          <Text style={[styles.bigScoreLabel, { color: colors.muted }]}>今日综合评分</Text>
        </View>
        <View style={styles.postureStats}>
          {[
            { label: "前倾次数", value: "3次", color: "#FF5A5A" },
            { label: "跷腿时长", value: "12分钟", color: "#FFB347" },
            { label: "标准坐姿", value: "6.2小时", color: "#00D4AA" },
          ].map((item) => (
            <View key={item.label} style={styles.statItem}>
              <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 柱状图 */}
      <View style={styles.barChartContainer}>
        {POSTURE_SCORES.map((score, i) => {
          const heightPct = score / maxScore;
          const isToday = i === 6;
          return (
            <View key={i} style={styles.barItem}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: heightPct * 60,
                      backgroundColor: isToday ? "#FF6B9D" : `${colors.primary}50`,
                      borderRadius: 6,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barLabel, { color: isToday ? colors.foreground : colors.muted }]}>
                {POSTURE_DAYS[i]}
              </Text>
            </View>
          );
        })}
      </View>

      {/* 颈椎腰椎提示 */}
      <View style={[styles.spineAlert, { backgroundColor: "#FFB34718" }]}>
        <Text style={styles.spineAlertEmoji}>⚠️</Text>
        <Text style={[styles.spineAlertText, { color: "#FFB347" }]}>
          颈椎预估疲劳负荷：中等 · 建议每 45 分钟起身活动
        </Text>
      </View>
    </BentoCard>
  );
}

// ─── 用药与饮水依从性卡片 ─────────────────────────────────────────────────────

const CALENDAR_DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

function MedicationCard() {
  const colors = useThemeColors();
  const { state, toggleMedication } = useAppContext();

  // 模拟过去30天的打卡记录
  const completedDays = new Set([1,2,3,4,5,6,8,9,10,11,12,13,15,16,17,18,19,20,22,23,24,25,26,27,28,29,30]);

  return (
    <BentoCard>
      <SectionHeader title="用药依从性" subtitle="AI 自动识别打卡" />

      {/* 打卡日历 */}
      <View style={styles.calendarGrid}>
        {CALENDAR_DAYS.map((day) => {
          const isCompleted = completedDays.has(day);
          const isToday = day === 10;
          return (
            <View
              key={day}
              style={[
                styles.calendarDay,
                isCompleted && { backgroundColor: "#00D4AA20" },
                isToday && { borderWidth: 1.5, borderColor: "#5B6EFF" },
              ]}
            >
              {isCompleted ? (
                <Text style={styles.calendarCheck}>✓</Text>
              ) : (
                <Text style={[styles.calendarDayNum, { color: isToday ? "#5B6EFF" : colors.muted }]}>
                  {day}
                </Text>
              )}
            </View>
          );
        })}
      </View>

      {/* 药品清单 */}
      <View style={styles.medList}>
        {state.medications.map((med) => (
          <View key={med.id} style={[styles.medItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.medIconBg, { backgroundColor: "#5B6EFF18" }]}>
              <Text style={styles.medEmoji}>💊</Text>
            </View>
            <View style={styles.medInfo}>
              <Text style={[styles.medName, { color: colors.foreground }]}>{med.name}</Text>
              <Text style={[styles.medDose, { color: colors.muted }]}>{med.dose} · {med.times.join(" / ")}</Text>
            </View>
            <View style={styles.medTakenRow}>
              {med.taken.map((taken, idx) => (
                <Pressable
                  key={idx}
                  style={({ pressed }) => [
                    styles.medCheckBtn,
                    { backgroundColor: taken ? "#00D4AA20" : colors.surface2 },
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => toggleMedication(med.id, idx)}
                >
                  <Text style={{ fontSize: 14 }}>{taken ? "✅" : "⬜"}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </View>
    </BentoCard>
  );
}

// ─── 眼部疲劳监测卡片 ─────────────────────────────────────────────────────────

const EYE_DATA = [30, 45, 20, 55, 40, 35, 45, 60, 50, 45, 55, 48];
const EYE_LABELS = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

function EyeFatigueCard() {
  const colors = useThemeColors();
  const { state } = useAppContext();

  const chartWidth = 300;
  const chartHeight = 80;
  const maxVal = 70;
  const stepX = chartWidth / (EYE_DATA.length - 1);

  const points = EYE_DATA.map((v, i) => `${i * stepX},${chartHeight - (v / maxVal) * chartHeight}`).join(" ");

  return (
    <BentoCard>
      <SectionHeader title="眼部疲劳" subtitle="今日监测" />

      <View style={styles.eyeRow}>
        <View>
          <Text style={[styles.bigScore, { color: "#5B6EFF", fontSize: 36 }]}>
            {state.eyeFatigueMinutes}
          </Text>
          <Text style={[styles.bigScoreLabel, { color: colors.muted }]}>分钟过近用眼</Text>
        </View>
        <View style={[styles.eyeAlertBadge, { backgroundColor: "#FFB34720" }]}>
          <Text style={styles.eyeAlertEmoji}>👁️</Text>
          <Text style={[styles.eyeAlertText, { color: "#FFB347" }]}>20-20-20</Text>
          <Text style={[styles.eyeAlertSub, { color: colors.muted }]}>每20分钟远眺20秒</Text>
        </View>
      </View>

      {/* 折线图 */}
      <View style={styles.lineChartWrapper}>
        <Svg width="100%" height={chartHeight + 10} viewBox={`0 0 ${chartWidth} ${chartHeight + 10}`}>
          <Defs>
            <LinearGradient id="eyeGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#5B6EFF" />
              <Stop offset="100%" stopColor="#9B6EFF" />
            </LinearGradient>
          </Defs>
          <Polyline
            points={points}
            fill="none"
            stroke="url(#eyeGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <View style={styles.lineChartLabels}>
          {["8:00", "11:00", "14:00", "17:00", "19:00"].map((l) => (
            <Text key={l} style={[styles.lineChartLabel, { color: colors.muted }]}>{l}</Text>
          ))}
        </View>
      </View>

      <View style={[styles.tipBox, { backgroundColor: colors.surface2 }]}>
        <Text style={[styles.tipText, { color: colors.muted }]}>
          💡 AI 建议：今日眨眼频率偏低，建议使用人工泪液，并在明亮环境下工作
        </Text>
      </View>
    </BentoCard>
  );
}

// ─── 情绪与压力波形卡片 ───────────────────────────────────────────────────────

const STRESS_DATA = [0.3, 0.4, 0.6, 0.5, 0.3, 0.4, 0.7, 0.8, 0.6, 0.5, 0.4, 0.35];
const STRESS_HOURS = ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"];

function StressWaveCard() {
  const colors = useThemeColors();
  const { state } = useAppContext();

  const chartWidth = 300;
  const chartHeight = 60;
  const stepX = chartWidth / (STRESS_DATA.length - 1);

  // 生成平滑曲线路径
  const generateSmoothPath = (data: number[]) => {
    const points = data.map((v, i) => ({
      x: i * stepX,
      y: chartHeight - v * chartHeight,
    }));
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      d += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  };

  const pathD = generateSmoothPath(STRESS_DATA);
  const fillD = `${pathD} L ${(STRESS_DATA.length - 1) * stepX} ${chartHeight} L 0 ${chartHeight} Z`;

  const stressLevelText = state.stressLevel < 0.4 ? "低压" : state.stressLevel < 0.7 ? "中等" : "高压";
  const stressColor = state.stressLevel < 0.4 ? "#00D4AA" : state.stressLevel < 0.7 ? "#FFB347" : "#FF5A5A";

  return (
    <BentoCard>
      <SectionHeader title="情绪与压力" subtitle="基于表情与语音分析" />

      <View style={styles.stressRow}>
        <View>
          <Text style={[styles.stressLevel, { color: stressColor }]}>{stressLevelText}</Text>
          <Text style={[styles.bigScoreLabel, { color: colors.muted }]}>当前压力等级</Text>
        </View>
        <View style={styles.stressMoods}>
          {[
            { emoji: "😊", label: "开心", pct: "45%", color: "#FFD93D" },
            { emoji: "😐", label: "平静", pct: "38%", color: "#6BCB77" },
            { emoji: "😤", label: "压力", pct: "17%", color: "#FF6B6B" },
          ].map((m) => (
            <View key={m.label} style={styles.moodItem}>
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={[styles.moodPct, { color: m.color }]}>{m.pct}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 波形图 */}
      <View style={styles.waveWrapper}>
        <Svg width="100%" height={chartHeight + 10} viewBox={`0 0 ${chartWidth} ${chartHeight + 10}`}>
          <Defs>
            <LinearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={stressColor} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={stressColor} stopOpacity="0.02" />
            </LinearGradient>
          </Defs>
          <Path d={fillD} fill="url(#stressGrad)" />
          <Path d={pathD} fill="none" stroke={stressColor} strokeWidth="2.5" strokeLinecap="round" />
        </Svg>
        <View style={styles.lineChartLabels}>
          {["8:00", "11:00", "14:00", "17:00", "19:00"].map((l) => (
            <Text key={l} style={[styles.lineChartLabel, { color: colors.muted }]}>{l}</Text>
          ))}
        </View>
      </View>

      <View style={[styles.tipBox, { backgroundColor: colors.surface2 }]}>
        <Text style={[styles.tipText, { color: colors.muted }]}>
          📊 下午 14:00-15:00 为今日压力峰值时段，建议安排轻松任务
        </Text>
      </View>
    </BentoCard>
  );
}

// ─── 主页面 ───────────────────────────────────────────────────────────────────

export default function HealthScreen() {
  const colors = useThemeColors();

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <Text style={[styles.pageTitle, { color: colors.foreground }]}>健康</Text>
          <Text style={[styles.pageSubtitle, { color: colors.muted }]}>专业级数据看板</Text>
        </View>

        {/* 健康概览 Bento 行 */}
        <View style={styles.overviewRow}>
          {[
            { label: "综合健康分", value: "86", color: "#5B6EFF", emoji: "🏆" },
            { label: "今日活跃度", value: "良好", color: "#00D4AA", emoji: "⚡" },
          ].map((item) => (
            <BentoCard key={item.label} size="half" style={item.label === "综合健康分" ? styles.halfCardMargin : styles.halfCardMarginLeft}>
              <View style={[styles.bentoIconBg, { backgroundColor: `${item.color}18` }]}>
                <Text style={styles.bentoCardEmoji}>{item.emoji}</Text>
              </View>
              <Text style={[styles.overviewValue, { color: item.color }]}>{item.value}</Text>
              <Text style={[styles.overviewLabel, { color: colors.muted }]}>{item.label}</Text>
            </BentoCard>
          ))}
        </View>

        <PostureCard />
        <MedicationCard />
        <EyeFatigueCard />
        <StressWaveCard />
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
  bentoIconBg: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  bentoCardEmoji: { fontSize: 20 },
  overviewValue: { fontSize: 24, fontWeight: "700", letterSpacing: -0.5 },
  overviewLabel: { fontSize: 14, marginTop: 2 },

  // 体态
  scoreRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 },
  bigScore: { fontSize: 48, fontWeight: "800", letterSpacing: -2 },
  bigScoreLabel: { fontSize: 14, marginTop: 2 },
  postureStats: { gap: 8, alignItems: "flex-end" },
  statItem: { alignItems: "flex-end" },
  statValue: { fontSize: 14, fontWeight: "700" },
  statLabel: { fontSize: 10 },
  barChartContainer: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 80, marginBottom: 12 },
  barItem: { alignItems: "center", flex: 1 },
  barWrapper: { height: 60, justifyContent: "flex-end", width: "100%" },
  bar: { width: "70%", alignSelf: "center" },
  barLabel: { fontSize: 13, marginTop: 4 },
  spineAlert: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10, borderRadius: 10 },
  spineAlertEmoji: { fontSize: 14 },
  spineAlertText: { fontSize: 14, flex: 1, lineHeight: 16 },

  // 用药
  calendarGrid: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 16 },
  calendarDay: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  calendarCheck: { fontSize: 14, color: "#00D4AA", fontWeight: "700" },
  calendarDayNum: { fontSize: 13, fontWeight: "500" },
  medList: { gap: 0 },
  medItem: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  medIconBg: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  medEmoji: { fontSize: 18 },
  medInfo: { flex: 1 },
  medName: { fontSize: 14, fontWeight: "600" },
  medDose: { fontSize: 14, marginTop: 2 },
  medTakenRow: { flexDirection: "row", gap: 4 },
  medCheckBtn: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },

  // 眼部
  eyeRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 },
  eyeAlertBadge: { padding: 12, borderRadius: 14, alignItems: "center", gap: 4 },
  eyeAlertEmoji: { fontSize: 24 },
  eyeAlertText: { fontSize: 14, fontWeight: "700" },
  eyeAlertSub: { fontSize: 10 },
  lineChartWrapper: { marginBottom: 12 },
  lineChartLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  lineChartLabel: { fontSize: 10 },
  tipBox: { padding: 10, borderRadius: 10 },
  tipText: { fontSize: 14, lineHeight: 18 },

  // 压力
  stressRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 },
  stressLevel: { fontSize: 36, fontWeight: "800", letterSpacing: -1 },
  stressMoods: { flexDirection: "row", gap: 12 },
  moodItem: { alignItems: "center", gap: 4 },
  moodEmoji: { fontSize: 20 },
  moodPct: { fontSize: 14, fontWeight: "600" },
  waveWrapper: { marginBottom: 12 },
});
