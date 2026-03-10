/**
 * BentoCard — openclaw-lifelog 核心卡片组件
 * 采用 Bento Box 便当盒布局，支持全宽/半宽，带轻柔阴影和圆角
 */
import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { useThemeColors } from "@/hooks/use-theme-colors";

interface BentoCardProps {
  children: React.ReactNode;
  /** 是否占满整行（full）或半行（half） */
  size?: "full" | "half";
  style?: ViewStyle;
  onPress?: () => void;
  /** 自定义背景色 */
  backgroundColor?: string;
  /** 是否禁用阴影 */
  noShadow?: boolean;
}

export function BentoCard({
  children,
  size = "full",
  style,
  onPress,
  backgroundColor,
  noShadow = false,
}: BentoCardProps) {
  const colors = useThemeColors();
  const bg = backgroundColor ?? colors.surface;

  const cardStyle: ViewStyle[] = [
    styles.card,
    ...(size === "half" ? [styles.halfCard] : []),
    { backgroundColor: bg },
    ...(!noShadow ? [styles.shadow] : []),
    ...(style ? [style] : []),
  ];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          ...cardStyle,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    overflow: "hidden",
  },
  halfCard: {
    flex: 1,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
});
