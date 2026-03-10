/**
 * 我的 (My) — openclaw-lifelog v2.0
 * Apple Health 级精致设计：毛玻璃面板、精致渐变、统一图标、微妙光效
 */
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  FadeIn,
} from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useAppContext } from "@/lib/app-context";
import {
  useSettings,
  STYLE_THEMES as THEME_CONFIGS,
  type AppLanguage,
  type AppStyleTheme,
} from "@/lib/settings-context";

// ─── 视觉模型配置 ────────────────────────────────────────────────────────────

const VIT_MODELS = [
  { id: "vit-tiny", name: "ViT-Tiny", params: "5.7M", desc: "超低功耗", performance: 0.35, accuracy: 0.62, heat: 0.2, badge: "省电", gradient: ["#34D399", "#10B981"] as const },
  { id: "vit-small", name: "ViT-Small", params: "22M", desc: "均衡推荐", performance: 0.65, accuracy: 0.82, heat: 0.45, badge: "推荐", gradient: ["#818CF8", "#6366F1"] as const },
  { id: "vit-base", name: "ViT-Base", params: "86M", desc: "高精度", performance: 0.88, accuracy: 0.94, heat: 0.75, badge: "精准", gradient: ["#FB7185", "#F43F5E"] as const },
];

// ─── 表情主题 ────────────────────────────────────────────────────────────────

const EMOJI_THEMES = [
  { id: "nomi", name: "Nomi 默认", preview: ["😊", "🤔", "😴"], gradient: ["#818CF8", "#6366F1"] as const, installed: true },
  { id: "cute", name: "萌系可爱", preview: ["🥰", "🧐", "😪"], gradient: ["#FB7185", "#F43F5E"] as const, installed: false },
  { id: "minimal", name: "极简线条", preview: ["◉", "◎", "○"], gradient: ["#94A3B8", "#64748B"] as const, installed: false },
  { id: "neon", name: "霓虹科技", preview: ["⚡", "🔮", "💤"], gradient: ["#34D399", "#10B981"] as const, installed: false },
];

// ─── 快捷指令 ────────────────────────────────────────────────────────────────

const QUICK_COMMANDS = [
  { id: "1", icon: "🎯", label: "专注模式", gradient: ["#818CF8", "#6366F1"] as const },
  { id: "2", icon: "😴", label: "休眠摄像头", gradient: ["#94A3B8", "#64748B"] as const },
  { id: "3", icon: "💊", label: "服药提醒", gradient: ["#FB7185", "#F43F5E"] as const },
  { id: "4", icon: "🧘", label: "休息提醒", gradient: ["#34D399", "#10B981"] as const },
  { id: "5", icon: "📊", label: "健康报告", gradient: ["#FBBF24", "#F59E0B"] as const },
  { id: "6", icon: "🔒", label: "隐私模式", gradient: ["#F87171", "#EF4444"] as const },
];

// ─── 语言选项 ────────────────────────────────────────────────────────────────

const LANGUAGES: { code: AppLanguage; label: string; flag: string; sublabel: string }[] = [
  { code: "zh-CN", label: "简体中文", sublabel: "Simplified Chinese", flag: "🇨🇳" },
  { code: "zh-TW", label: "繁體中文", sublabel: "Traditional Chinese", flag: "🇨🇳" },
  { code: "en-US", label: "English", sublabel: "United States", flag: "🇺🇸" },
  { code: "ja-JP", label: "日本語", sublabel: "Japanese", flag: "🇯🇵" },
];

// ─── 毛玻璃面板组件 ─────────────────────────────────────────────────────────

function GlassPanel({ children, style }: { children: React.ReactNode; style?: any }) {
  const colors = useThemeColors();
  return (
    <View style={[s.glassOuter, style]}>
      <BlurView intensity={40} tint="light" style={s.glassBlur}>
        <View style={[s.glassInner, { backgroundColor: `${colors.surface}CC` }]}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

// ─── 用户资料卡 ──────────────────────────────────────────────────────────────

function ProfileCard() {
  const colors = useThemeColors();
  const { state } = useAppContext();

  return (
    <Animated.View entering={FadeInDown.delay(80).duration(500)}>
      <GlassPanel style={{ marginBottom: 24 }}>
        <LinearGradient
          colors={["#818CF808", "#F43F5E05", "transparent"]}
          style={s.profileGradientOverlay}
        />
        <View style={s.profileRow}>
          <LinearGradient colors={["#818CF8", "#6366F1"]} style={s.profileAvatar}>
            <Text style={s.profileAvatarEmoji}>🐾</Text>
          </LinearGradient>
          <View style={s.profileInfo}>
            <Text style={[s.profileName, { color: colors.foreground }]}>openclaw 用户</Text>
            <Text style={[s.profileSub, { color: colors.muted }]}>
              {state.cameraActive ? "📡 设备运行中" : "⏸ 设备已暂停"}
            </Text>
          </View>
        </View>

        <View style={[s.profileDivider, { backgroundColor: `${colors.border}60` }]} />

        <View style={s.profileStats}>
          {[
            { value: "32", label: "天记录", color: "#6366F1" },
            { value: "87%", label: "习惯完成", color: "#10B981" },
            { value: "A+", label: "健康评级", color: "#F43F5E" },
          ].map((stat, i) => (
            <View key={stat.label} style={s.profileStat}>
              <Text style={[s.profileStatValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={[s.profileStatLabel, { color: colors.muted }]}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </GlassPanel>
    </Animated.View>
  );
}

// ─── 快捷指令 ────────────────────────────────────────────────────────────────

function QuickCommandsSection() {
  const colors = useThemeColors();
  const { state, toggleFocusMode, toggleCamera } = useAppContext();
  const { t } = useSettings();

  const handleCommand = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (id === "1") toggleFocusMode();
    else if (id === "2") toggleCamera();
    else Alert.alert(t("quick_commands"), "功能已触发 ✅");
  };

  return (
    <Animated.View entering={FadeInDown.delay(140).duration(500)}>
      <Text style={[s.sectionTitle, { color: colors.foreground }]}>{t("quick_commands")}</Text>
      <Text style={[s.sectionSub, { color: colors.muted }]}>常用操作</Text>
      <View style={s.quickGrid}>
        {QUICK_COMMANDS.map((cmd) => (
          <Pressable
            key={cmd.id}
            style={({ pressed }) => [
              s.quickItem,
              { backgroundColor: `${colors.surface}E6` },
              pressed && { opacity: 0.85, transform: [{ scale: 0.95 }] },
            ]}
            onPress={() => handleCommand(cmd.id)}
          >
            <LinearGradient colors={[...cmd.gradient]} style={s.quickIconBg}>
              <Text style={s.quickIcon}>{cmd.icon}</Text>
            </LinearGradient>
            <Text style={[s.quickLabel, { color: colors.foreground }]} numberOfLines={1}>{cmd.label}</Text>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}

// ─── 设备控制 ────────────────────────────────────────────────────────────────

function DeviceControlSection() {
  const colors = useThemeColors();
  const { state, toggleCamera, togglePrivacyMode } = useAppContext();
  const { t } = useSettings();
  const [selectedModel, setSelectedModel] = useState("vit-small");

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(500)}>
      <Text style={[s.sectionTitle, { color: colors.foreground }]}>{t("device_control")}</Text>
      <Text style={[s.sectionSub, { color: colors.muted }]}>openclaw 摄像头</Text>

      <GlassPanel style={{ marginBottom: 16 }}>
        {/* 摄像头状态 */}
        <View style={s.controlRow}>
          <LinearGradient
            colors={state.cameraActive ? ["#34D399", "#10B981"] : ["#94A3B8", "#64748B"]}
            style={s.controlIconBg}
          >
            <Text style={{ fontSize: 18 }}>{state.cameraActive ? "📡" : "📷"}</Text>
          </LinearGradient>
          <View style={s.controlInfo}>
            <Text style={[s.controlTitle, { color: colors.foreground }]}>摄像头状态</Text>
            <View style={s.controlIndicator}>
              <View style={[s.controlDot, { backgroundColor: state.cameraActive ? "#10B981" : "#EF4444" }]} />
              <Text style={[s.controlStatus, { color: state.cameraActive ? "#10B981" : "#EF4444" }]}>
                {state.cameraActive ? "运行中" : "已休眠"}
              </Text>
            </View>
          </View>
          <Switch
            value={state.cameraActive}
            onValueChange={() => { toggleCamera(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
            trackColor={{ false: "#E2E8F0", true: "#6EE7B7" }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[s.controlDivider, { backgroundColor: `${colors.border}50` }]} />

        {/* 隐私模式 */}
        <View style={s.controlRow}>
          <LinearGradient
            colors={state.privacyMode ? ["#F87171", "#EF4444"] : ["#818CF8", "#6366F1"]}
            style={s.controlIconBg}
          >
            <Text style={{ fontSize: 18 }}>{state.privacyMode ? "🔒" : "🛡️"}</Text>
          </LinearGradient>
          <View style={s.controlInfo}>
            <Text style={[s.controlTitle, { color: colors.foreground }]}>绝对隐私模式</Text>
            <Text style={[s.controlStatus, { color: colors.muted }]}>
              {state.privacyMode ? "全部数据本地处理" : "标准隐私保护"}
            </Text>
          </View>
          <Switch
            value={state.privacyMode}
            onValueChange={() => { togglePrivacyMode(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
            trackColor={{ false: "#E2E8F0", true: "#FCA5A5" }}
            thumbColor="#FFFFFF"
          />
        </View>
      </GlassPanel>

      {/* ViT 模型选择 */}
      <GlassPanel style={{ marginBottom: 24 }}>
        <Text style={[s.panelTitle, { color: colors.foreground }]}>视觉模型</Text>
        <Text style={[s.panelSub, { color: colors.muted, marginBottom: 14 }]}>端侧 ViT 配置</Text>
        {VIT_MODELS.map((model) => {
          const isSelected = selectedModel === model.id;
          return (
            <Pressable
              key={model.id}
              style={({ pressed }) => [
                s.modelItem,
                {
                  backgroundColor: isSelected ? `${model.gradient[0]}12` : `${colors.surface}80`,
                  borderColor: isSelected ? model.gradient[0] : `${colors.border}40`,
                },
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => { setSelectedModel(model.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            >
              <View style={s.modelHeader}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={[s.modelName, { color: colors.foreground }]}>{model.name}</Text>
                  <Text style={[s.modelParams, { color: colors.muted }]}>{model.params}</Text>
                </View>
                <LinearGradient colors={[...model.gradient]} style={s.modelBadge}>
                  <Text style={s.modelBadgeText}>{model.badge}</Text>
                </LinearGradient>
              </View>
              <View style={s.modelBars}>
                {[
                  { label: "性能", value: model.performance, color: model.gradient[0] },
                  { label: "精度", value: model.accuracy, color: "#10B981" },
                  { label: "发热", value: model.heat, color: "#F43F5E" },
                ].map((bar) => (
                  <View key={bar.label} style={s.modelBarRow}>
                    <Text style={[s.modelBarLabel, { color: colors.muted }]}>{bar.label}</Text>
                    <View style={[s.modelBarTrack, { backgroundColor: `${colors.border}30` }]}>
                      <LinearGradient
                        colors={[bar.color, `${bar.color}60`]}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={[s.modelBarFill, { width: `${bar.value * 100}%` as any }]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
      </GlassPanel>
    </Animated.View>
  );
}

// ─── 语言设置 ────────────────────────────────────────────────────────────────

function LanguageSection() {
  const colors = useThemeColors();
  const { language, setLanguage, t } = useSettings();

  return (
    <Animated.View entering={FadeInDown.delay(260).duration(500)}>
      <GlassPanel style={{ marginBottom: 24 }}>
        <Text style={[s.panelTitle, { color: colors.foreground }]}>{t("language_settings")}</Text>
        <Text style={[s.panelSub, { color: colors.muted, marginBottom: 12 }]}>Language</Text>
        {LANGUAGES.map((lang, index) => {
          const isSelected = language === lang.code;
          return (
            <Pressable
              key={lang.code}
              style={({ pressed }) => [
                s.langRow,
                {
                  borderBottomColor: `${colors.border}40`,
                  borderBottomWidth: index < LANGUAGES.length - 1 ? StyleSheet.hairlineWidth : 0,
                  backgroundColor: isSelected ? "#6366F108" : "transparent",
                },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => { setLanguage(lang.code); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
            >
              <Text style={s.langFlag}>{lang.flag}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[s.langLabel, { color: colors.foreground }]}>{lang.label}</Text>
                <Text style={[s.langSub, { color: colors.muted }]}>{lang.sublabel}</Text>
              </View>
              {isSelected && (
                <LinearGradient colors={["#818CF8", "#6366F1"]} style={s.langCheck}>
                  <Text style={{ color: "#FFF", fontSize: 13, fontWeight: "800" }}>✓</Text>
                </LinearGradient>
              )}
            </Pressable>
          );
        })}
      </GlassPanel>
    </Animated.View>
  );
}

// ─── 风格设置 ────────────────────────────────────────────────────────────────

function StyleSection() {
  const colors = useThemeColors();
  const { styleTheme, setStyleTheme, t } = useSettings();
  const currentTheme = THEME_CONFIGS.find((th) => th.id === styleTheme) ?? THEME_CONFIGS[0];

  return (
    <Animated.View entering={FadeInDown.delay(320).duration(500)}>
      <GlassPanel style={{ marginBottom: 24 }}>
        <Text style={[s.panelTitle, { color: colors.foreground }]}>{t("style_settings")}</Text>
        <Text style={[s.panelSub, { color: colors.muted, marginBottom: 14 }]}>Appearance</Text>

        {/* 当前主题预览 */}
        <View style={[s.themePreview, { backgroundColor: `${currentTheme.background}`, borderColor: `${colors.border}40` }]}>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <LinearGradient colors={[currentTheme.primary, `${currentTheme.primary}CC`]} style={s.themePreviewDot} />
            <View>
              <Text style={{ fontSize: 15, fontWeight: "700", color: currentTheme.foreground }}>{currentTheme.label}</Text>
              <Text style={{ fontSize: 13, color: currentTheme.muted }}>{currentTheme.labelEn} · 当前</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 5 }}>
            {[currentTheme.primary, currentTheme.surface, currentTheme.muted].map((c, i) => (
              <View key={i} style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: c }} />
            ))}
          </View>
        </View>

        {/* 主题网格 */}
        <View style={s.styleGrid}>
          {THEME_CONFIGS.map((theme) => {
            const isSelected = styleTheme === theme.id;
            return (
              <Pressable
                key={theme.id}
                style={({ pressed }) => [
                  s.styleItem,
                  {
                    borderColor: isSelected ? "#6366F1" : `${colors.border}40`,
                    borderWidth: isSelected ? 2.5 : 1,
                  },
                  pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
                ]}
                onPress={() => { setStyleTheme(theme.id as AppStyleTheme); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
              >
                <View style={[s.stylePreview, { backgroundColor: theme.background }]}>
                  <View style={{ flexDirection: "row", gap: 6 }}>
                    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: theme.primary }} />
                    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: theme.surface }} />
                    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: theme.muted }} />
                  </View>
                  {isSelected && (
                    <LinearGradient colors={["#818CF8", "#6366F1"]} style={s.styleCheck}>
                      <Text style={{ color: "#FFF", fontSize: 12, fontWeight: "800" }}>✓</Text>
                    </LinearGradient>
                  )}
                </View>
                <View style={{ padding: 10 }}>
                  <Text style={[s.styleLabel, { color: colors.foreground }]}>{theme.label}</Text>
                  <Text style={{ fontSize: 13, color: colors.muted }}>{theme.labelEn}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </GlassPanel>
    </Animated.View>
  );
}

// ─── 表情商店 ────────────────────────────────────────────────────────────────

function EmojiShopSection() {
  const colors = useThemeColors();
  const { t } = useSettings();
  const [activeTheme, setActiveTheme] = useState("nomi");

  return (
    <Animated.View entering={FadeInDown.delay(380).duration(500)}>
      <Text style={[s.sectionTitle, { color: colors.foreground }]}>{t("emoji_shop")}</Text>
      <Text style={[s.sectionSub, { color: colors.muted }]}>为 Nomi 换装</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16, gap: 12 }}>
        {EMOJI_THEMES.map((theme) => {
          const isActive = activeTheme === theme.id;
          return (
            <Pressable
              key={theme.id}
              style={({ pressed }) => [
                s.emojiCard,
                {
                  backgroundColor: `${colors.surface}E6`,
                  borderColor: isActive ? theme.gradient[0] : `${colors.border}40`,
                  borderWidth: isActive ? 2 : 1,
                },
                pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
              ]}
              onPress={() => { setActiveTheme(theme.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
            >
              <View style={s.emojiPreviewRow}>
                {theme.preview.map((e, i) => (
                  <Text key={i} style={{ fontSize: 24 }}>{e}</Text>
                ))}
              </View>
              <Text style={[s.emojiName, { color: colors.foreground }]}>{theme.name}</Text>
              <LinearGradient
                colors={isActive ? [...theme.gradient] : [`${theme.gradient[0]}20`, `${theme.gradient[1]}20`]}
                style={s.emojiBtn}
              >
                <Text style={[s.emojiBtnText, { color: isActive ? "#FFF" : theme.gradient[0] }]}>
                  {isActive ? "使用中" : theme.installed ? "切换" : "获取"}
                </Text>
              </LinearGradient>
            </Pressable>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

// ─── 更多设置 ────────────────────────────────────────────────────────────────

function MoreSettingsSection() {
  const colors = useThemeColors();

  const settingGroups = [
    {
      title: "通知与提醒",
      items: [
        { icon: "🔔", label: "久坐提醒", desc: "每 90 分钟", hasArrow: true, danger: false },
        { icon: "💊", label: "用药提醒", desc: "已设置 3 项", hasArrow: true, danger: false },
        { icon: "😴", label: "睡眠提醒", desc: "22:30 提醒", hasArrow: true, danger: false },
      ],
    },
    {
      title: "数据与隐私",
      items: [
        { icon: "☁️", label: "云端同步", desc: "已关闭", hasArrow: true, danger: false },
        { icon: "🗑️", label: "一键销毁云端数据", desc: "不可恢复", hasArrow: false, danger: true },
        { icon: "📤", label: "导出我的数据", desc: "JSON / CSV", hasArrow: true, danger: false },
      ],
    },
    {
      title: "关于",
      items: [
        { icon: "📖", label: "开源许可证", desc: "MIT License", hasArrow: true, danger: false },
        { icon: "⭐", label: "给项目 Star", desc: "github.com/openclaw", hasArrow: true, danger: false },
        { icon: "🐛", label: "反馈问题", desc: "帮助我们改进", hasArrow: true, danger: false },
      ],
    },
  ];

  return (
    <Animated.View entering={FadeInDown.delay(440).duration(500)}>
      {settingGroups.map((group) => (
        <View key={group.title} style={{ marginBottom: 24 }}>
          <Text style={[s.sectionTitle, { color: colors.foreground }]}>{group.title}</Text>
          <GlassPanel>
            {group.items.map((item, index) => (
              <Pressable
                key={item.label}
                style={({ pressed }) => [
                  s.settingRow,
                  {
                    borderBottomColor: `${colors.border}40`,
                    borderBottomWidth: index < group.items.length - 1 ? StyleSheet.hairlineWidth : 0,
                  },
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (item.label === "一键销毁云端数据") {
                    Alert.alert("确认操作", "此操作不可恢复，确定要销毁所有云端数据吗？", [
                      { text: "取消", style: "cancel" },
                      { text: "销毁", style: "destructive" },
                    ]);
                  }
                }}
              >
                <Text style={{ fontSize: 22, width: 34, textAlign: "center" }}>{item.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.settingLabel, { color: item.danger ? "#EF4444" : colors.foreground }]}>{item.label}</Text>
                  <Text style={[s.settingDesc, { color: colors.muted }]}>{item.desc}</Text>
                </View>
                {item.hasArrow && <Text style={{ fontSize: 20, color: colors.muted, fontWeight: "300" }}>›</Text>}
              </Pressable>
            ))}
          </GlassPanel>
        </View>
      ))}
    </Animated.View>
  );
}

// ─── 主页面 ──────────────────────────────────────────────────────────────────

export default function MyScreen() {
  const colors = useThemeColors();
  const { t } = useSettings();

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        style={[s.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(400)}>
          <Text style={[s.pageTitle, { color: colors.foreground }]}>{t("my")}</Text>
        </Animated.View>

        <ProfileCard />
        <QuickCommandsSection />
        <DeviceControlSection />
        <LanguageSection />
        <StyleSection />
        <EmojiShopSection />
        <MoreSettingsSection />

        <View style={s.versionInfo}>
          <Text style={[s.versionText, { color: colors.muted }]}>openclaw-lifelog v2.0.0</Text>
          <Text style={[s.versionText, { color: colors.muted }]}>开源 · 隐私优先 · AI 驱动</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── 样式 ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 50 },

  pageTitle: { fontSize: 34, fontWeight: "800", letterSpacing: -0.8, marginBottom: 20 },

  sectionTitle: { fontSize: 20, fontWeight: "700", letterSpacing: -0.3, marginBottom: 2 },
  sectionSub: { fontSize: 14, marginBottom: 14 },

  panelTitle: { fontSize: 18, fontWeight: "700", letterSpacing: -0.3 },
  panelSub: { fontSize: 14 },

  // Glass Panel
  glassOuter: { borderRadius: 20, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 3 },
  glassBlur: { borderRadius: 20, overflow: "hidden" },
  glassInner: { padding: 18, borderRadius: 20, borderWidth: 0.5, borderColor: "rgba(255,255,255,0.2)" },

  // Profile
  profileGradientOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: 20 },
  profileRow: { flexDirection: "row", gap: 14, alignItems: "center" },
  profileAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  profileAvatarEmoji: { fontSize: 28 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: "700", letterSpacing: -0.3 },
  profileSub: { fontSize: 14, marginTop: 2 },
  profileDivider: { height: StyleSheet.hairlineWidth, marginVertical: 14 },
  profileStats: { flexDirection: "row", justifyContent: "space-around" },
  profileStat: { alignItems: "center" },
  profileStatValue: { fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  profileStatLabel: { fontSize: 13, marginTop: 2 },

  // Quick Commands
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  quickItem: {
    width: "30%" as any,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  quickIconBg: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  quickIcon: { fontSize: 20 },
  quickLabel: { fontSize: 13, fontWeight: "600", textAlign: "center" },

  // Device Control
  controlRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  controlIconBg: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  controlInfo: { flex: 1 },
  controlTitle: { fontSize: 16, fontWeight: "600", letterSpacing: -0.2 },
  controlIndicator: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  controlDot: { width: 6, height: 6, borderRadius: 3 },
  controlStatus: { fontSize: 13, fontWeight: "500" },
  controlDivider: { height: StyleSheet.hairlineWidth, marginVertical: 12 },

  // ViT Models
  modelItem: { borderRadius: 14, borderWidth: 1.5, padding: 14, marginBottom: 10 },
  modelHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  modelName: { fontSize: 16, fontWeight: "700", letterSpacing: -0.2 },
  modelParams: { fontSize: 13 },
  modelBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  modelBadgeText: { fontSize: 12, fontWeight: "700", color: "#FFF" },
  modelBars: { gap: 7 },
  modelBarRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  modelBarLabel: { fontSize: 13, width: 28 },
  modelBarTrack: { flex: 1, height: 5, borderRadius: 3, overflow: "hidden" },
  modelBarFill: { height: 5, borderRadius: 3 },

  // Language
  langRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, borderRadius: 10, paddingHorizontal: 4 },
  langFlag: { fontSize: 26, width: 36, textAlign: "center" },
  langLabel: { fontSize: 16, fontWeight: "600", letterSpacing: -0.2 },
  langSub: { fontSize: 13, marginTop: 1 },
  langCheck: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },

  // Style
  themePreview: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 14 },
  themePreviewDot: { width: 32, height: 32, borderRadius: 10 },
  styleGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  styleItem: { width: "47%" as any, borderRadius: 16, overflow: "hidden" },
  stylePreview: { height: 64, alignItems: "center", justifyContent: "center" },
  styleCheck: { position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  styleLabel: { fontSize: 14, fontWeight: "700" },

  // Emoji Shop
  emojiCard: { width: 140, borderRadius: 18, padding: 14, gap: 10 },
  emojiPreviewRow: { flexDirection: "row", gap: 6 },
  emojiName: { fontSize: 14, fontWeight: "700" },
  emojiBtn: { paddingVertical: 8, borderRadius: 10, alignItems: "center" },
  emojiBtnText: { fontSize: 13, fontWeight: "700" },

  // Settings
  settingRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  settingLabel: { fontSize: 16, fontWeight: "500", letterSpacing: -0.2 },
  settingDesc: { fontSize: 13, marginTop: 2 },

  // Version
  versionInfo: { alignItems: "center", paddingTop: 24, gap: 4 },
  versionText: { fontSize: 13 },
});
