import type { ComponentInternalInstance } from 'vue'
// 定义 NodeRect 接口
export interface NodeRect {
  left: number
  right: number
  top: number
  bottom: number
  width: number
  height: number
}

/**
 * uni boundingClientRect的 Promise 版本
 * @param selector 组件选择器
 * @param instance 父组件实例
 * @returns Promise<NodeRect>
 */
export function getBoundingClientRect(
  selector: string,
  instance: ComponentInternalInstance | null,
) {
  return new Promise<NodeRect>((resolve) => {
    uni
      .createSelectorQuery()
      .in(instance?.proxy)
      .select(selector)
      .boundingClientRect((data) => {
        resolve(data as NodeRect)
      })
      .exec()
  })
}
