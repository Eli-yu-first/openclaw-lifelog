/** @type {const} */
const themeColors = {
  // ─── 基础色（Apple Health 风格：纯净、高对比、精致） ───
  primary:    { light: '#007AFF', dark: '#0A84FF' },   // iOS 系统蓝
  accent:     { light: '#FF2D55', dark: '#FF375F' },   // iOS 系统粉
  background: { light: '#F2F2F7', dark: '#000000' },   // iOS 系统灰/纯黑
  surface:    { light: '#FFFFFF', dark: '#1C1C1E' },   // 卡片白/深灰
  surface2:   { light: '#F2F2F7', dark: '#2C2C2E' },   // 次级表面
  foreground: { light: '#000000', dark: '#FFFFFF' },   // 纯黑/纯白文字
  muted:      { light: '#8E8E93', dark: '#636366' },   // iOS 次级灰
  border:     { light: '#C6C6C8', dark: '#38383A' },   // iOS 分割线
  // ─── 状态色（Apple Health 经典） ───
  success:    { light: '#34C759', dark: '#30D158' },   // iOS 绿
  warning:    { light: '#FF9500', dark: '#FF9F0A' },   // iOS 橙
  error:      { light: '#FF3B30', dark: '#FF453A' },   // iOS 红
  // ─── 健康三环色（Apple Watch 活动环） ───
  ring1:      { light: '#FF2D55', dark: '#FF375F' },   // 活动 - 粉红
  ring2:      { light: '#A2FF00', dark: '#B4FF33' },   // 锻炼 - 荧光绿
  ring3:      { light: '#00C7BE', dark: '#00D4AA' },   // 站立 - 青色
  // ─── 情绪色 ───
  mood1:      { light: '#FFD60A', dark: '#FFD60A' },   // 开心 - 金黄
  mood2:      { light: '#34C759', dark: '#30D158' },   // 平静 - 绿
  mood3:      { light: '#FF3B30', dark: '#FF453A' },   // 压力 - 红
};

module.exports = { themeColors };
