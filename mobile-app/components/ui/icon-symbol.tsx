// Fallback for using MaterialIcons on Android and web.
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols → Material Icons 映射表
 * openclaw-lifelog 所需图标全部在此注册
 */
const MAPPING = {
  // 导航图标
  "house.fill":                          "home",
  "heart.fill":                          "favorite",
  "chart.bar.fill":                      "bar-chart",
  "bubble.left.and.bubble.right.fill":   "chat",
  "cpu.fill":                            "memory",
  // 通用操作
  "paperplane.fill":                     "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right":                       "chevron-right",
  "chevron.left":                        "chevron-left",
  "chevron.down":                        "expand-more",
  "chevron.up":                          "expand-less",
  "plus":                                "add",
  "xmark":                               "close",
  "checkmark":                           "check",
  "checkmark.circle.fill":               "check-circle",
  "ellipsis":                            "more-horiz",
  // 健康相关
  "figure.walk":                         "directions-walk",
  "figure.stand":                        "accessibility",
  "eye.fill":                            "visibility",
  "drop.fill":                           "water-drop",
  "pills.fill":                          "medication",
  "waveform.path.ecg":                   "monitor-heart",
  "brain.head.profile":                  "psychology",
  "lungs.fill":                          "air",
  // 设备相关
  "camera.fill":                         "camera-alt",
  "camera.slash.fill":                   "no-photography",
  "lock.shield.fill":                    "security",
  "shield.fill":                         "shield",
  "wifi":                                "wifi",
  "cpu":                                 "developer-board",
  "gear":                                "settings",
  "bell.fill":                           "notifications",
  "bell.slash.fill":                     "notifications-off",
  "moon.fill":                           "bedtime",
  "sun.max.fill":                        "wb-sunny",
  "cloud.fill":                          "cloud",
  "cloud.sun.fill":                      "wb-cloudy",
  "trash.fill":                          "delete",
  "arrow.clockwise":                     "refresh",
  "mic.fill":                            "mic",
  "mic.slash.fill":                      "mic-off",
  "sparkles":                            "auto-awesome",
  "star.fill":                           "star",
  "flame.fill":                          "local-fire-department",
  "bolt.fill":                           "bolt",
  "exclamationmark.triangle.fill":       "warning",
  "info.circle.fill":                    "info",
  "person.fill":                         "person",
  "calendar":                            "calendar-today",
  "clock.fill":                          "schedule",
  "location.fill":                       "location-on",
  "thermometer":                         "thermostat",
  "wind":                                "air",
  "snowflake":                           "ac-unit",
  "photo.fill":                          "photo",
  "wand.and.stars":                      "auto-fix-high",
  "paintbrush.fill":                     "brush",
  "slider.horizontal.3":                 "tune",
  "power":                               "power-settings-new",
} as unknown as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
