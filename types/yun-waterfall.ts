import type { InjectionKey, StyleValue } from 'vue'
import type { WaterfallItemInfo } from './yun-waterfall-item'

export interface WaterfallProps {
  show?: boolean
  rootStyle?: StyleValue
  rootClass?: string
  columns?: number
  columnGap?: number
  rowGap?: number
  maxRetries?: number // 最大重试次数
  retryDelay?: number // 重试延迟(ms)
  fallbackHeight?: number // 加载失败时的备用高度
}

export const defaultWaterfallProps = {
  show: undefined,
  columns: 2,
  columnGap: 16,
  rowGap: 16,
  maxRetries: 1, // 最大重试次数
  retryDelay: 1000, // 重试延迟(ms)
  fallbackHeight: 200, // 加载失败时的备用高度
}

export interface WaterfallSlots {
  default?: (props: Record<string, never>) => any
}

export interface WaterfallEmits {
  (e: 'loadEnd'): void
  (e: 'loadStart'): void
  // retry: (payload: { item: WaterfallItemInfo; retryCount: number }) => void
  (e: 'retry'): void
  (e: 'update:show', v: boolean): void
}

export interface WaterfallExpose {
  reflow: () => void // 重排
  refreshReflow: () => void // 刷新数据后重排
  loadDone: (handler: () => void) => void
}

export interface WaterfallContext {
  columnWidth: number
  addItem: (item: WaterfallItemInfo) => void
  removeItem: (item: WaterfallItemInfo) => void
  onItemLoad: (item: WaterfallItemInfo) => void
  isReflowing: boolean // 全局重排状态
  isLayoutInterrupted: boolean // 排版中断状态
}

export const waterfallContextKey = Symbol(
  'waterfall-context',
) as InjectionKey<WaterfallContext>
