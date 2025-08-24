// 瀑布流组件配置
export interface WaterfallConfig {
  columns: number
  columnGap: number
  rowGap: number
  maxRetries: number
  retryDelay: number
  fallbackHeight: number
}

// 默认配置
export const defaultWaterfallConfig: WaterfallConfig = {
  columns: 2,
  columnGap: 16,
  rowGap: 16,
  maxRetries: 3,
  retryDelay: 1000,
  fallbackHeight: 200,
}

// 配置管理
let currentConfig = { ...defaultWaterfallConfig }

export function setWaterfallConfig(config: Partial<WaterfallConfig>) {
  currentConfig = { ...currentConfig, ...config }
}

export function getWaterfallConfig(): WaterfallConfig {
  return { ...currentConfig }
}

export function resetWaterfallConfig() {
  currentConfig = { ...defaultWaterfallConfig }
}