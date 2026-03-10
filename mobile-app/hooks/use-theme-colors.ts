/**
 * useThemeColors — 感知 SettingsContext 中 styleTheme 的颜色 hook
 * 优先使用用户选择的风格主题颜色，回退到系统深色/浅色模式
 */
import { useSettings, STYLE_THEMES } from "@/lib/settings-context";

export interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  surface2: string;
  foreground: string;
  muted: string;
  border: string;
  // 兼容旧 useColors() 的字段
  text: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  // 状态色（保持不变）
  success: string;
  warning: string;
  error: string;
  accent: string;
}

export function useThemeColors(): ThemeColors {
  const { themeConfig } = useSettings();

  const base = {
    primary: themeConfig.primary,
    background: themeConfig.background,
    surface: themeConfig.surface,
    surface2: themeConfig.surface2,
    foreground: themeConfig.foreground,
    muted: themeConfig.muted,
    border: themeConfig.border,
    // 兼容字段
    text: themeConfig.foreground,
    tint: themeConfig.primary,
    icon: themeConfig.muted,
    tabIconDefault: themeConfig.muted,
    tabIconSelected: themeConfig.primary,
    // 状态色固定
    success: "#00D4AA",
    warning: "#FFB347",
    error: "#FF5A5A",
    accent: "#FF6B9D",
  };

  return base;
}
