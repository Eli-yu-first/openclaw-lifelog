/**
 * GlassView — 毛玻璃效果容器组件
 * 使用 expo-blur 实现 iOS 原生毛玻璃效果
 */
import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface GlassViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  borderRadius?: number;
}

export function GlassView({
  children,
  style,
  intensity = 60,
  borderRadius = 20,
}: GlassViewProps) {
  const colorScheme = useColorScheme();
  const tint = colorScheme === "dark" ? "dark" : "light";

  if (Platform.OS === "web") {
    // Web 降级：使用半透明背景
    return (
      <View
        style={[
          styles.webFallback,
          { borderRadius },
          colorScheme === "dark" ? styles.darkFallback : styles.lightFallback,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      tint={tint}
      style={[styles.blurView, { borderRadius }, style]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blurView: {
    overflow: "hidden",
  },
  webFallback: {
    overflow: "hidden",
  },
  lightFallback: {
    backgroundColor: "rgba(255,255,255,0.80)",
  },
  darkFallback: {
    backgroundColor: "rgba(20,21,24,0.80)",
  },
});
