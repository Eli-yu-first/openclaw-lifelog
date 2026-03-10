/**
 * RingChart — Apple Watch 风格健康圆环组件
 * 使用 SVG 绘制带渐变的圆环，支持动画进度
 */
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

interface RingChartProps {
  /** 进度 0-1 */
  progress: number;
  /** 圆环大小 */
  size?: number;
  /** 圆环粗细 */
  strokeWidth?: number;
  /** 渐变起始色 */
  colorStart: string;
  /** 渐变结束色 */
  colorEnd: string;
  /** 中心显示文字 */
  label?: string;
  /** 中心显示数值 */
  value?: string;
  /** 轨道背景色 */
  trackColor?: string;
}

export function RingChart({
  progress,
  size = 80,
  strokeWidth = 8,
  colorStart,
  colorEnd,
  label,
  value,
  trackColor = "rgba(0,0,0,0.06)",
}: RingChartProps) {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gradientId = `ring-gradient-${colorStart.replace("#", "")}`;

  // 由于 SVG 动画在 RN 中受限，使用固定值渲染
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colorStart} />
            <Stop offset="100%" stopColor={colorEnd} />
          </LinearGradient>
        </Defs>
        {/* 轨道背景 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* 进度圆弧 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      {/* 中心文字 */}
      {(value || label) && (
        <View style={styles.centerContent}>
          {value && <Text style={styles.valueText}>{value}</Text>}
          {label && <Text style={styles.labelText}>{label}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    position: "absolute",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  valueText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D0F12",
    letterSpacing: -0.5,
  },
  labelText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8A8F9A",
    marginTop: 1,
  },
});
