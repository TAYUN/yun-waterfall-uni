import type { StyleValue } from 'vue'

export interface WaterfallItemProps {
  rootStyle?: StyleValue
  rootClass?: string
  index?: number
  maxWait?: number
  width?: number
  height?: number
  /**
   * 错误处理模式
   * - 'none': 默认模式，加载一次失败就不再处理，使用默认高度
   * - 'placeholder': 占位图模式，失败后直接显示占位图片，不重试
   * - 'retry': 重试模式，失败后重试指定次数，最终失败使用默认高度
   * - 'fallback': 完整模式，重试 + 占位图 + 最终兜底的三层处理机制
   */
  errorHandlingMode?: 'none' | 'placeholder' | 'retry' | 'fallback'
  /**
   * 重试次数（仅在 retry 和 fallback 模式下生效）
   */
  retryCount?: number
}

export interface WaterfallItemSlots {
  default?: (props: {
    loaded: () => void
    columnWidth: number
    imageHeight: number
    key?: string
    errorInfo: {
      status:
        | 'none'
        | 'fail'
        | 'phok'
        | 'timeout'
        | 'final'
      message: string
      placeholder: {
        load: () => void
        error: () => void
      }
      // retry?: (isReset?: boolean) => Promise<void>
    }
  }) => any
}

export interface WaterfallItemEmits {}

export interface WaterfallItemExpose {}

export interface WaterfallItemInfo {
  loaded: boolean // 是否完成加载过程（成功或失败）
  loadSuccess: boolean // 是否加载成功
  visible: boolean // 是否可见
  isInserted: boolean // 是否插入是插入项目
  heightError: boolean // 高度是否异常
  height: number // 项目高度
  top: number // 垂直位置
  left: number // 水平位置
  index?: number // 项目索引
  retryCount?: number // 重试次数
  updateHeight: (a?: boolean) => Promise<void> // 重排前的预处理
  refreshImage: (a?: boolean) => Promise<void> // 重排前的预处理
}
