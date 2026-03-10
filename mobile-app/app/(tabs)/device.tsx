/**
 * 我的 (My) — openclaw-lifelog 个人中心 v1.2
 * 变更：真实语言切换、真实风格切换（含极简白主题）、繁体中文使用中国国旗、字体放大
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
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
} from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { BentoCard } from "@/components/ui/bento-card";
import { SectionHeader } from "@/components/ui/section-header";
import { GlassView } from "@/components/ui/glass-view";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useAppContext } from "@/lib/app-context";
import {
  useSettings,
  STYLE_THEMES as THEME_CONFIGS,
  type AppLanguage,
  type AppStyleTheme,
} from "@/lib/settings-context";

// ─── 视觉模型配置数据 ─────────────────────────────────────────────────────────

const VIT_MODELS = [
  { id: "vit-tiny", name: "ViT-Tiny", params: "5.7M 参数", desc: "超低功耗，适合长时间运行", performance: 0.35, accuracy: 0.62, heat: 0.2, badge: "省电", badgeColor: "#00D4AA" },
  { id: "vit-small", name: "ViT-Small", params: "22M 参数", desc: "均衡性能，推荐日常使用", performance: 0.65, accuracy: 0.82, heat: 0.45, badge: "推荐", badgeColor: "#5B6EFF" },
  { id: "vit-base", name: "ViT-Base", params: "86M 参数", desc: "高精度识别，需要较强算力", performance: 0.88, accuracy: 0.94, heat: 0.75, badge: "高精度", badgeColor: "#FF6B9D" },
];

// ─── 表情主题数据 ─────────────────────────────────────────────────────────────

const EMOJI_THEMES = [
  { id: "nomi", name: "Nomi 默认", preview: ["😊", "🤔", "😴", "⚠️", "🎉"], color: "#5B6EFF", installed: true },
  { id: "cute", name: "萌系可爱", preview: ["🥰", "🧐", "😪", "😨", "🥳"], color: "#FF6B9D", installed: false },
  { id: "minimal", name: "极简线条", preview: ["◉", "◎", "○", "◈", "◉"], color: "#8A8F9A", installed: false },
  { id: "neon", name: "霓虹科技", preview: ["⚡", "🔮", "💤", "🚨", "✨"], color: "#00D4AA", installed: false },
];

// ─── 快捷指令数据 ─────────────────────────────────────────────────────────────

const QUICK_COMMANDS = [
  { id: "1", icon: "🎯", label: "专注模式", color: "#5B6EFF" },
  { id: "2", icon: "😴", label: "休眠摄像头", color: "#8A8F9A" },
  { id: "3", icon: "💊", label: "服药提醒", color: "#FF6B9D" },
  { id: "4", icon: "🧘", label: "休息提醒", color: "#00D4AA" },
  { id: "5", icon: "📊", label: "健康报告", color: "#FFB347" },
  { id: "6", icon: "🔒", label: "隐私模式", color: "#FF5A5A" },
];

// ─── 语言选项（繁体中文使用中国大陆旗帜）────────────────────────────────────

const LANGUAGES: { code: AppLanguage; label: string; flag: string; sublabel: string }[] = [
  { code: "zh-CN", label: "简体中文", sublabel: "Simplified Chinese", flag: "🇨🇳" },
  { code: "zh-TW", label: "繁體中文", sublabel: "Traditional Chinese", flag: "🇹🇼" },
  { code: "en-US", label: "English", sublabel: "United States", flag: "🇺🇸" },
  { code: "ja-JP", label: "日本語", sublabel: "Japanese", flag: "🇯🇵" },
];

// ─── 用户资料卡 ───────────────────────────────────────────────────────────────

function ProfileCard() {
  const colors = useThemeColors();
  const { state } = useAppContext();

  return (
    <Animated.View entering={FadeInDown.delay(50).springify()}>
      <LinearGradient
        colors={["#5B6EFF22", "#FF6B9D11", "transparent"]}
        style={styles.profileGradient}
      >
        <GlassView style={styles.profileCard} borderRadius={20} intensity={40}>
          <View style={styles.profileRow}>
            <View style={[styles.profileAvatar, { backgroundColor: "#5B6EFF20" }]}>
              <Text style={styles.profileAvatarEmoji}>🐾</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.foreground }]}>openclaw 用户</Text>
              <Text style={[styles.profileSub, { color: colors.muted }]}>
                {state.cameraActive ? "📡 摄像头运行中" : "⏸ 摄像头已暂停"}
              </Text>
              <View style={styles.profileStats}>
                <View style={styles.profileStat}>
                  <Text style={[styles.profileStatValue, { color: "#5B6EFF" }]}>32</Text>
                  <Text style={[styles.profileStatLabel, { color: colors.muted }]}>天记录</Text>
                </View>
                <View style={[styles.profileStatDivider, { backgroundColor: colors.border }]} />
                <View style={styles.profileStat}>
                  <Text style={[styles.profileStatValue, { color: "#00D4AA" }]}>87%</Text>
                  <Text style={[styles.profileStatLabel, { color: colors.muted }]}>习惯完成</Text>
                </View>
                <View style={[styles.profileStatDivider, { backgroundColor: colors.border }]} />
                <View style={styles.profileStat}>
                  <Text style={[styles.profileStatValue, { color: "#FF6B9D" }]}>A+</Text>
                  <Text style={[styles.profileStatLabel, { color: colors.muted }]}>健康评级</Text>
                </View>
              </View>
            </View>
          </View>
        </GlassView>
      </LinearGradient>
    </Animated.View>
  );
}

// ─── 快捷指令区块 ─────────────────────────────────────────────────────────────

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
    <Animated.View entering={FadeInDown.delay(100).springify()}>
      <SectionHeader title={t("quick_commands")} subtitle="常用操作" />
      <View style={styles.quickGrid}>
        {QUICK_COMMANDS.map((cmd) => (
          <Pressable
            key={cmd.id}
            style={({ pressed }) => [
              styles.quickItem,
              { backgroundColor: colors.surface },
              pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
            ]}
            onPress={() => handleCommand(cmd.id)}
          >
            <View style={[styles.quickIconBg, { backgroundColor: `${cmd.color}20` }]}>
              <Text style={styles.quickIcon}>{cmd.icon}</Text>
            </View>
            <Text style={[styles.quickLabel, { color: colors.foreground }]}>{cmd.label}</Text>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}

// ─── 设备控制区块 ─────────────────────────────────────────────────────────────

function DeviceControlSection() {
  const colors = useThemeColors();
  const { state, toggleCamera, togglePrivacyMode } = useAppContext();
  const { t } = useSettings();
  const [selectedModel, setSelectedModel] = useState("vit-small");

  return (
    <Animated.View entering={FadeInDown.delay(150).springify()}>
      <SectionHeader title={t("device_control")} subtitle="openclaw 摄像头" />

      {/* 摄像头状态 */}
      <BentoCard>
        <View style={styles.deviceStatusRow}>
          <View style={[styles.deviceStatusIcon, { backgroundColor: state.cameraActive ? "#00D4AA20" : "#FF5A5A20" }]}>
            <Text style={styles.deviceStatusEmoji}>{state.cameraActive ? "📡" : "📷"}</Text>
          </View>
          <View style={styles.deviceStatusInfo}>
            <Text style={[styles.deviceStatusTitle, { color: colors.foreground }]}>摄像头状态</Text>
            <View style={styles.deviceStatusIndicator}>
              <View style={[styles.deviceStatusDot, { backgroundColor: state.cameraActive ? "#00D4AA" : "#FF5A5A" }]} />
              <Text style={[styles.deviceStatusText, { color: state.cameraActive ? "#00D4AA" : "#FF5A5A" }]}>
                {state.cameraActive ? "运行中" : "已休眠"}
              </Text>
            </View>
          </View>
          <Switch
            value={state.cameraActive}
            onValueChange={() => {
              toggleCamera();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            trackColor={{ false: "#E0E0E0", true: "#00D4AA40" }}
            thumbColor={state.cameraActive ? "#00D4AA" : "#FFFFFF"}
          />
        </View>

        {/* 隐私模式 */}
        <View style={[styles.deviceDivider, { backgroundColor: colors.border }]} />
        <View style={styles.deviceStatusRow}>
          <View style={[styles.deviceStatusIcon, { backgroundColor: state.privacyMode ? "#FF5A5A20" : "#5B6EFF20" }]}>
            <Text style={styles.deviceStatusEmoji}>{state.privacyMode ? "🔒" : "🛡️"}</Text>
          </View>
          <View style={styles.deviceStatusInfo}>
            <Text style={[styles.deviceStatusTitle, { color: colors.foreground }]}>绝对隐私模式</Text>
            <Text style={[styles.deviceStatusText, { color: colors.muted }]}>
              {state.privacyMode ? "全部数据本地处理" : "标准隐私保护"}
            </Text>
          </View>
          <Switch
            value={state.privacyMode}
            onValueChange={() => {
              togglePrivacyMode();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            trackColor={{ false: "#E0E0E0", true: "#FF5A5A40" }}
            thumbColor={state.privacyMode ? "#FF5A5A" : "#FFFFFF"}
          />
        </View>
      </BentoCard>

      {/* ViT 模型选择 */}
      <BentoCard>
        <SectionHeader title="视觉模型" subtitle="端侧 ViT 配置" />
        {VIT_MODELS.map((model) => {
          const isSelected = selectedModel === model.id;
          return (
            <Pressable
              key={model.id}
              style={({ pressed }) => [
                styles.modelItem,
                {
                  backgroundColor: isSelected ? `${model.badgeColor}12` : colors.surface2,
                  borderColor: isSelected ? model.badgeColor : "transparent",
                },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => {
                setSelectedModel(model.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <View style={styles.modelHeader}>
                <Text style={[styles.modelName, { color: colors.foreground }]}>{model.name}</Text>
                <View style={[styles.modelBadge, { backgroundColor: `${model.badgeColor}20` }]}>
                  <Text style={[styles.modelBadgeText, { color: model.badgeColor }]}>{model.badge}</Text>
                </View>
              </View>
              <Text style={[styles.modelParams, { color: colors.muted }]}>{model.params} · {model.desc}</Text>
              <View style={styles.modelBars}>
                {[
                  { label: "性能", value: model.performance, color: "#5B6EFF" },
                  { label: "精度", value: model.accuracy, color: "#00D4AA" },
                  { label: "发热", value: model.heat, color: "#FF6B9D" },
                ].map((bar) => (
                  <View key={bar.label} style={styles.modelBarRow}>
                    <Text style={[styles.modelBarLabel, { color: colors.muted }]}>{bar.label}</Text>
                    <View style={[styles.modelBarTrack, { backgroundColor: colors.surface }]}>
                      <LinearGradient
                        colors={[bar.color, `${bar.color}80`]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.modelBarFill, { width: `${bar.value * 100}%` }]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
      </BentoCard>
    </Animated.View>
  );
}

// ─── 语言设置（真实切换）────────────────────────────────────────────────────

function LanguageSection() {
  const colors = useThemeColors();
  const { language, setLanguage, t } = useSettings();

  return (
    <Animated.View entering={FadeInDown.delay(200).springify()}>
      <BentoCard>
        <SectionHeader title={t("language_settings")} subtitle="Language" />
        {LANGUAGES.map((lang, index) => {
          const isSelected = language === lang.code;
          return (
            <Pressable
              key={lang.code}
              style={({ pressed }) => [
                styles.settingRow,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: index < LANGUAGES.length - 1 ? StyleSheet.hairlineWidth : 0,
                },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => {
                setLanguage(lang.code);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              <Text style={styles.settingFlag}>{lang.flag}</Text>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.foreground }]}>{lang.label}</Text>
                <Text style={[styles.settingDesc, { color: colors.muted }]}>{lang.sublabel}</Text>
              </View>
              {isSelected && (
                <View style={styles.langCheckCircle}>
                  <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "800" }}>✓</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </BentoCard>
    </Animated.View>
  );
}

// ─── 风格设置（真实切换，含极简白主题）──────────────────────────────────────

function StyleSection() {
  const colors = useThemeColors();
  const { styleTheme, setStyleTheme, t } = useSettings();

  const currentTheme = THEME_CONFIGS.find((th) => th.id === styleTheme) ?? THEME_CONFIGS[0];

  return (
    <Animated.View entering={FadeInDown.delay(250).springify()}>
      <BentoCard>
        <SectionHeader title={t("style_settings")} subtitle="Appearance" />

        {/* 主题预览条 */}
        <View style={[styles.themePreviewBar, { backgroundColor: currentTheme.background, borderColor: colors.border }]}>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: currentTheme.primary }} />
            <View>
              <Text style={{ fontSize: 14, fontWeight: "700", color: currentTheme.foreground }}>
                {currentTheme.label}
              </Text>
              <Text style={{ fontSize: 14, color: currentTheme.muted }}>
                {currentTheme.labelEn} · 当前主题
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 4 }}>
            {[currentTheme.primary, currentTheme.surface, currentTheme.muted].map((c, i) => (
              <View key={i} style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: c }} />
            ))}
          </View>
        </View>

        {/* 主题网格 */}
        <View style={styles.styleGrid}>
          {THEME_CONFIGS.map((theme) => {
            const isSelected = styleTheme === theme.id;
            return (
              <Pressable
                key={theme.id}
                style={({ pressed }) => [
                  styles.styleItem,
                  {
                    borderColor: isSelected ? "#5B6EFF" : colors.border,
                    borderWidth: isSelected ? 2.5 : 1,
                  },
                  pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
                ]}
                onPress={() => {
                  setStyleTheme(theme.id as AppStyleTheme);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
              >
                <View style={[styles.stylePreview, { backgroundColor: theme.background }]}>
                  {/* 色点预览 */}
                  <View style={{ flexDirection: "row", gap: 5 }}>
                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: theme.primary }} />
                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: theme.surface }} />
                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: theme.muted }} />
                  </View>
                  {isSelected && (
                    <View style={[styles.styleCheckmark, { position: "absolute", top: 6, right: 6 }]}>
                      <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "800" }}>✓</Text>
                    </View>
                  )}
                </View>
                <View style={{ padding: 8 }}>
                  <Text style={[styles.styleLabel, { color: colors.foreground }]}>{theme.label}</Text>
                  <Text style={{ fontSize: 13, color: colors.muted }}>{theme.labelEn}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </BentoCard>
    </Animated.View>
  );
}

// ─── 表情商店 ─────────────────────────────────────────────────────────────────

function EmojiShopSection() {
  const colors = useThemeColors();
  const { t } = useSettings();
  const [activeTheme, setActiveTheme] = useState("nomi");

  return (
    <Animated.View entering={FadeInDown.delay(300).springify()}>
      <SectionHeader title={t("emoji_shop")} subtitle="为 Nomi 换装" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.emojiShopRow}>
        {EMOJI_THEMES.map((theme) => {
          const isActive = activeTheme === theme.id;
          return (
            <Pressable
              key={theme.id}
              style={({ pressed }) => [
                styles.emojiThemeCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: isActive ? theme.color : colors.border,
                  borderWidth: isActive ? 2 : 1,
                },
                pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
              ]}
              onPress={() => {
                setActiveTheme(theme.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              <View style={styles.emojiPreviewRow}>
                {theme.preview.slice(0, 3).map((e, i) => (
                  <Text key={i} style={styles.emojiPreviewItem}>{e}</Text>
                ))}
              </View>
              <Text style={[styles.emojiThemeName, { color: colors.foreground }]}>{theme.name}</Text>
              <View style={[styles.emojiThemeBtn, { backgroundColor: isActive ? theme.color : `${theme.color}20` }]}>
                <Text style={[styles.emojiThemeBtnText, { color: isActive ? "#FFFFFF" : theme.color }]}>
                  {isActive ? "使用中" : theme.installed ? "切换" : "获取"}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

// ─── 更多设置列表 ─────────────────────────────────────────────────────────────

function MoreSettingsSection() {
  const colors = useThemeColors();

  const settingGroups = [
    {
      title: "通知与提醒",
      items: [
        { icon: "🔔", label: "久坐提醒", desc: "每 90 分钟", hasArrow: true },
        { icon: "💊", label: "用药提醒", desc: "已设置 3 项", hasArrow: true },
        { icon: "😴", label: "睡眠提醒", desc: "22:30 提醒", hasArrow: true },
      ],
    },
    {
      title: "数据与隐私",
      items: [
        { icon: "☁️", label: "云端同步", desc: "已关闭", hasArrow: true },
        { icon: "🗑️", label: "一键销毁云端数据", desc: "不可恢复", hasArrow: false, danger: true },
        { icon: "📤", label: "导出我的数据", desc: "JSON / CSV", hasArrow: true },
      ],
    },
    {
      title: "关于",
      items: [
        { icon: "📖", label: "开源许可证", desc: "MIT License", hasArrow: true },
        { icon: "⭐", label: "给项目 Star", desc: "github.com/openclaw", hasArrow: true },
        { icon: "🐛", label: "反馈问题", desc: "帮助我们改进", hasArrow: true },
      ],
    },
  ];

  return (
    <Animated.View entering={FadeInDown.delay(350).springify()}>
      {settingGroups.map((group) => (
        <View key={group.title}>
          <SectionHeader title={group.title} />
          <BentoCard>
            {group.items.map((item, index) => (
              <Pressable
                key={item.label}
                style={({ pressed }) => [
                  styles.settingRow,
                  {
                    borderBottomColor: colors.border,
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
                <Text style={styles.settingFlag}>{item.icon}</Text>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingLabel, { color: (item as any).danger ? "#FF5A5A" : colors.foreground }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.settingDesc, { color: colors.muted }]}>{item.desc}</Text>
                </View>
                {item.hasArrow && <Text style={[styles.settingArrow, { color: colors.muted }]}>›</Text>}
              </Pressable>
            ))}
          </BentoCard>
        </View>
      ))}
    </Animated.View>
  );
}

// ─── 主页面 ───────────────────────────────────────────────────────────────────

export default function MyScreen() {
  const colors = useThemeColors();
  const { t } = useSettings();

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 页面标题 */}
        <View style={styles.pageHeader}>
          <Text style={[styles.pageTitle, { color: colors.foreground }]}>{t("my")}</Text>
        </View>

        {/* 用户资料卡 */}
        <ProfileCard />

        {/* 快捷指令 */}
        <QuickCommandsSection />

        {/* 设备控制 */}
        <DeviceControlSection />

        {/* 语言设置 */}
        <LanguageSection />

        {/* 风格设置 */}
        <StyleSection />

        {/* 表情商店 */}
        <EmojiShopSection />

        {/* 更多设置 */}
        <MoreSettingsSection />

        {/* 版本信息 */}
        <View style={styles.versionInfo}>
          <Text style={[styles.versionText, { color: colors.muted }]}>openclaw-lifelog v1.2.0</Text>
          <Text style={[styles.versionText, { color: colors.muted }]}>开源 · 隐私优先 · AI 驱动</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── 样式 ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },

  pageHeader: { marginBottom: 16 },
  pageTitle: { fontSize: 34, fontWeight: "800", letterSpacing: -1 },

  // 用户资料
  profileGradient: { borderRadius: 20, marginBottom: 20 },
  profileCard: { padding: 16 },
  profileRow: { flexDirection: "row", gap: 14, alignItems: "center" },
  profileAvatar: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  profileAvatarEmoji: { fontSize: 32 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  profileSub: { fontSize: 13, marginBottom: 10 },
  profileStats: { flexDirection: "row", alignItems: "center", gap: 12 },
  profileStat: { alignItems: "center" },
  profileStatValue: { fontSize: 17, fontWeight: "700" },
  profileStatLabel: { fontSize: 11 },
  profileStatDivider: { width: 1, height: 24 },

  // 快捷指令
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  quickItem: {
    width: "30%",
    flex: undefined,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickIconBg: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  quickIcon: { fontSize: 22 },
  quickLabel: { fontSize: 14, fontWeight: "600", textAlign: "center" },

  // 设备控制
  deviceStatusRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  deviceStatusIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  deviceStatusEmoji: { fontSize: 22 },
  deviceStatusInfo: { flex: 1 },
  deviceStatusTitle: { fontSize: 16, fontWeight: "600" },
  deviceStatusIndicator: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  deviceStatusDot: { width: 6, height: 6, borderRadius: 3 },
  deviceStatusText: { fontSize: 13, fontWeight: "500" },
  deviceDivider: { height: StyleSheet.hairlineWidth, marginVertical: 12 },

  // ViT 模型
  modelItem: { borderRadius: 14, borderWidth: 1.5, padding: 12, marginBottom: 10 },
  modelHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  modelName: { fontSize: 16, fontWeight: "700" },
  modelBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  modelBadgeText: { fontSize: 14, fontWeight: "600" },
  modelParams: { fontSize: 13, marginBottom: 10 },
  modelBars: { gap: 6 },
  modelBarRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  modelBarLabel: { fontSize: 14, width: 28 },
  modelBarTrack: { flex: 1, height: 5, borderRadius: 3, overflow: "hidden" },
  modelBarFill: { height: 5, borderRadius: 3 },

  // 语言设置
  settingRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13 },
  settingFlag: { fontSize: 24, width: 34, textAlign: "center" },
  settingLabel: { fontSize: 16, fontWeight: "500" },
  settingContent: { flex: 1 },
  settingDesc: { fontSize: 13, marginTop: 2 },
  settingArrow: { fontSize: 24, fontWeight: "300" },
  langCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#5B6EFF",
    alignItems: "center",
    justifyContent: "center",
  },

  // 风格设置
  themePreviewBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  styleGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  styleItem: { width: "47%", borderRadius: 14, overflow: "hidden" },
  stylePreview: { height: 64, alignItems: "center", justifyContent: "center" },
  styleCheckmark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#5B6EFF",
    alignItems: "center",
    justifyContent: "center",
  },
  styleLabel: { fontSize: 13, fontWeight: "700" },

  // 表情商店
  emojiShopRow: { paddingBottom: 16, gap: 12 },
  emojiThemeCard: { width: 140, borderRadius: 16, padding: 14, gap: 8 },
  emojiPreviewRow: { flexDirection: "row", gap: 4 },
  emojiPreviewItem: { fontSize: 22 },
  emojiThemeName: { fontSize: 14, fontWeight: "700" },
  emojiThemeBtn: { paddingVertical: 7, borderRadius: 10, alignItems: "center" },
  emojiThemeBtnText: { fontSize: 13, fontWeight: "700" },

  // 版本信息
  versionInfo: { alignItems: "center", paddingTop: 20, gap: 4 },
  versionText: { fontSize: 13 },
});
