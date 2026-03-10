import { View, type ViewProps } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { cn } from "@/lib/utils";
import { useThemeColors } from "@/hooks/use-theme-colors";

export interface ScreenContainerProps extends ViewProps {
  /**
   * SafeArea edges to apply. Defaults to ["top", "left", "right"].
   * Bottom is typically handled by Tab Bar.
   */
  edges?: Edge[];
  /**
   * Tailwind className for the content area.
   */
  className?: string;
  /**
   * Additional className for the outer container (background layer).
   */
  containerClassName?: string;
  /**
   * Additional className for the SafeAreaView (content layer).
   */
  safeAreaClassName?: string;
  /**
   * Optional dynamic background color override (for theme switching).
   * If provided, overrides the Tailwind bg-background class.
   */
  bgColor?: string;
}

/**
 * A container component that properly handles SafeArea and background colors.
 * Supports dynamic theme color via bgColor prop.
 */
export function ScreenContainer({
  children,
  edges = ["top", "left", "right"],
  className,
  containerClassName,
  safeAreaClassName,
  style,
  bgColor,
  ...props
}: ScreenContainerProps) {
  const colors = useThemeColors();
  const resolvedBg = bgColor ?? colors.background;

  return (
    <View
      className={cn("flex-1", containerClassName)}
      style={{ backgroundColor: resolvedBg }}
      {...props}
    >
      <SafeAreaView
        edges={edges}
        className={cn("flex-1", safeAreaClassName)}
        style={[{ backgroundColor: resolvedBg }, style]}
      >
        <View className={cn("flex-1", className)} style={{ backgroundColor: resolvedBg }}>
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
}
