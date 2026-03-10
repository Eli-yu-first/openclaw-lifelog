/**
 * Tab 导航布局 — openclaw-lifelog 五大核心模块
 * 今天 / 健康 / 洞察 / 陪伴 / 我的
 * 图标风格：线条 + 选中时填充，带弹簧缩放动画
 */
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import Svg, { Path, Circle, Rect, Line, Polyline } from "react-native-svg";

import { HapticTab } from "@/components/haptic-tab";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useSettings } from "@/lib/settings-context";

// ─── 自定义 SVG 图标（对应用户上传的线条风格）────────────────────────────────

function TodayIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
      {/* 四宫格 Bento 图标 */}
      <Rect x="3" y="3" width="8" height="8" rx="2" stroke={color} strokeWidth={focused ? 2 : 1.5} fill={focused ? `${color}30` : "none"} />
      <Rect x="15" y="3" width="8" height="8" rx="2" stroke={color} strokeWidth={focused ? 2 : 1.5} fill={focused ? `${color}30` : "none"} />
      <Rect x="3" y="15" width="8" height="8" rx="2" stroke={color} strokeWidth={focused ? 2 : 1.5} fill={focused ? `${color}30` : "none"} />
      <Rect x="15" y="15" width="8" height="8" rx="2" stroke={color} strokeWidth={focused ? 2 : 1.5} fill={focused ? `${color}30` : "none"} />
    </Svg>
  );
}

function HealthIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
      {/* 心跳心形图标 */}
      <Path
        d="M13 21.5C13 21.5 3.5 15.5 3.5 9C3.5 6.5 5.5 4.5 8 4.5C10 4.5 11.5 5.5 13 7.5C14.5 5.5 16 4.5 18 4.5C20.5 4.5 22.5 6.5 22.5 9C22.5 15.5 13 21.5 13 21.5Z"
        stroke={color}
        strokeWidth={focused ? 2 : 1.5}
        fill={focused ? `${color}25` : "none"}
        strokeLinejoin="round"
      />
      {/* 心跳线 */}
      <Polyline
        points="6,12 9,9 11,14 14,8 16,12 20,12"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function InsightsIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
      {/* 灯泡图标 */}
      <Path
        d="M13 3C9.5 3 7 5.5 7 9C7 11.5 8.5 13.5 10.5 14.5V17H15.5V14.5C17.5 13.5 19 11.5 19 9C19 5.5 16.5 3 13 3Z"
        stroke={color}
        strokeWidth={focused ? 2 : 1.5}
        fill={focused ? `${color}25` : "none"}
        strokeLinejoin="round"
      />
      <Line x1="10.5" y1="19" x2="15.5" y2="19" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="11" y1="21.5" x2="15" y2="21.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function CompanionIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
      {/* 爱心对话气泡 */}
      <Path
        d="M20 4H6C4.9 4 4 4.9 4 6V16C4 17.1 4.9 18 6 18H10L13 22L16 18H20C21.1 18 22 17.1 22 16V6C22 4.9 21.1 4 20 4Z"
        stroke={color}
        strokeWidth={focused ? 2 : 1.5}
        fill={focused ? `${color}25` : "none"}
        strokeLinejoin="round"
      />
      {/* 心形 */}
      <Path
        d="M13 13C13 13 9.5 10.5 9.5 8.5C9.5 7.4 10.4 6.5 11.5 6.5C12.2 6.5 12.8 6.9 13 7.5C13.2 6.9 13.8 6.5 14.5 6.5C15.6 6.5 16.5 7.4 16.5 8.5C16.5 10.5 13 13 13 13Z"
        stroke={color}
        strokeWidth={1.2}
        fill={focused ? color : "none"}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MyIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
      {/* 芯片/处理器图标 */}
      <Rect x="7" y="7" width="12" height="12" rx="2" stroke={color} strokeWidth={focused ? 2 : 1.5} fill={focused ? `${color}25` : "none"} />
      <Rect x="10" y="10" width="6" height="6" rx="1" stroke={color} strokeWidth={1.2} fill={focused ? color : "none"} />
      {/* 引脚 */}
      <Line x1="10" y1="4" x2="10" y2="7" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="13" y1="4" x2="13" y2="7" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="16" y1="4" x2="16" y2="7" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="10" y1="19" x2="10" y2="22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="13" y1="19" x2="13" y2="22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="16" y1="19" x2="16" y2="22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="4" y1="10" x2="7" y2="10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="4" y1="13" x2="7" y2="13" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="4" y1="16" x2="7" y2="16" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="19" y1="10" x2="22" y2="10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="19" y1="13" x2="22" y2="13" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="19" y1="16" x2="22" y2="16" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

// ─── 动态 Tab 图标包装器 ──────────────────────────────────────────────────────

function AnimatedTabIcon({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.15, { damping: 12, stiffness: 200 });
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [focused]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.iconWrapper, animStyle]}>
      {children}
      {focused && <View style={styles.activeDot} />}
    </Animated.View>
  );
}

// ─── 主布局 ───────────────────────────────────────────────────────────────────

export default function TabLayout() {
  const colors = useThemeColors();
  const { t } = useSettings();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 60 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 6,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("today"),
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <TodayIcon color={color} focused={focused} />
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: t("health"),
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <HealthIcon color={color} focused={focused} />
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: t("insights"),
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <InsightsIcon color={color} focused={focused} />
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="companion"
        options={{
          title: t("companion"),
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <CompanionIcon color={color} focused={focused} />
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="device"
        options={{
          title: t("my"),
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <MyIcon color={color} focused={focused} />
            </AnimatedTabIcon>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
  },
  activeDot: {
    position: "absolute",
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#5B6EFF",
  },
});
