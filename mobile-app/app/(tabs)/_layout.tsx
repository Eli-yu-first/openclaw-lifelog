/**
 * Tab 导航布局 — openclaw-lifelog v2.0
 * Apple Health 级精致底部导航：毛玻璃背景、精致 SVG 图标、弹簧动画
 */
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
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

// ─── 精致 SVG 图标 ───────────────────────────────────────────────────────────

function TodayIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="7.5" height="7.5" rx="2.5" stroke={color} strokeWidth={focused ? 2 : 1.5} fill={focused ? `${color}20` : "none"} />
      <Rect x="13.5" y="3" width="7.5" height="7.5" rx="2.5" stroke={color} strokeWidth={focused ? 2 : 1.5} fill={focused ? `${color}20` : "none"} />
      <Rect x="3" y="13.5" width="7.5" height="7.5" rx="2.5" stroke={color} strokeWidth={focused ? 2 : 1.5} fill={focused ? `${color}20` : "none"} />
      <Rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.5" stroke={color} strokeWidth={focused ? 2 : 1.5} fill={focused ? `${color}20` : "none"} />
    </Svg>
  );
}

function HealthIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20C12 20 4 14.5 4 8.5C4 6.2 5.8 4.5 8 4.5C9.7 4.5 11 5.4 12 7C13 5.4 14.3 4.5 16 4.5C18.2 4.5 20 6.2 20 8.5C20 14.5 12 20 12 20Z"
        stroke={color}
        strokeWidth={focused ? 2 : 1.5}
        fill={focused ? `${color}18` : "none"}
        strokeLinejoin="round"
      />
      <Polyline
        points="6,11 8.5,8.5 10.5,13 13,7.5 15,11 18,11"
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
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3C8.7 3 6 5.7 6 9C6 11.4 7.5 13.3 9.5 14.2V16.5C9.5 17 9.9 17.5 10.5 17.5H13.5C14.1 17.5 14.5 17 14.5 16.5V14.2C16.5 13.3 18 11.4 18 9C18 5.7 15.3 3 12 3Z"
        stroke={color}
        strokeWidth={focused ? 2 : 1.5}
        fill={focused ? `${color}18` : "none"}
        strokeLinejoin="round"
      />
      <Line x1="10" y1="19.5" x2="14" y2="19.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="10.5" y1="21.5" x2="13.5" y2="21.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function CompanionIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 4H5C3.9 4 3 4.9 3 6V15C3 16.1 3.9 17 5 17H9L12 21L15 17H19C20.1 17 21 16.1 21 15V6C21 4.9 20.1 4 19 4Z"
        stroke={color}
        strokeWidth={focused ? 2 : 1.5}
        fill={focused ? `${color}18` : "none"}
        strokeLinejoin="round"
      />
      <Path
        d="M12 12.5C12 12.5 9 10.3 9 8.5C9 7.5 9.8 6.7 10.7 6.7C11.3 6.7 11.8 7 12 7.5C12.2 7 12.7 6.7 13.3 6.7C14.2 6.7 15 7.5 15 8.5C15 10.3 12 12.5 12 12.5Z"
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
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={focused ? 2 : 1.5} fill={focused ? `${color}18` : "none"} />
      <Path
        d="M5 20C5 17.2 8.1 15 12 15C15.9 15 19 17.2 19 20"
        stroke={color}
        strokeWidth={focused ? 2 : 1.5}
        strokeLinecap="round"
        fill="none"
      />
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
      scale.value = withSpring(1.12, { damping: 14, stiffness: 180 });
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
      {focused && <View style={[styles.activeDot, { backgroundColor: "#6366F1" }]} />}
    </Animated.View>
  );
}

// ─── 主布局 ──────────────────────────────────────────────────────────────────

export default function TabLayout() {
  const colors = useThemeColors();
  const { t } = useSettings();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 58 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: "#94A3B8",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 6,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: `${colors.background}F2`,
          borderTopColor: `${colors.border}40`,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
          letterSpacing: 0.3,
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
    width: 30,
    height: 30,
  },
  activeDot: {
    position: "absolute",
    bottom: -3,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
