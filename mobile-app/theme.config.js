/** @type {const} */
const themeColors = {
  // 基础色
  primary:    { light: '#5B6EFF', dark: '#7B8FFF' },
  accent:     { light: '#FF6B9D', dark: '#FF8DB5' },
  background: { light: '#F8F9FB', dark: '#0E0F11' },
  surface:    { light: '#FFFFFF', dark: '#1A1B1E' },
  surface2:   { light: '#F2F3F7', dark: '#242629' },
  foreground: { light: '#0D0F12', dark: '#F0F1F3' },
  muted:      { light: '#8A8F9A', dark: '#5E6370' },
  border:     { light: '#E8EAEF', dark: '#2A2C31' },
  // 状态色
  success:    { light: '#00D4AA', dark: '#00E8BB' },
  warning:    { light: '#FFB347', dark: '#FFCA7A' },
  error:      { light: '#FF5A5A', dark: '#FF7A7A' },
  // 健康三环色
  ring1:      { light: '#5B6EFF', dark: '#7B8FFF' },  // 专注
  ring2:      { light: '#FF6B9D', dark: '#FF8DB5' },  // 体态
  ring3:      { light: '#00D4AA', dark: '#00E8BB' },  // 水分
  // 情绪色
  mood1:      { light: '#FFD93D', dark: '#FFE566' },  // 开心
  mood2:      { light: '#6BCB77', dark: '#8FD99A' },  // 平静
  mood3:      { light: '#FF6B6B', dark: '#FF8E8E' },  // 压力
};

module.exports = { themeColors };
