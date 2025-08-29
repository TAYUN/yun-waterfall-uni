# yun-waterfall-uni

一个适用于 Vue3 + UniApp 的高性能瀑布流组件，支持动态列数、错误处理、增量重排等功能。

## 特性

- 🚀 **高性能**: 增量重排算法，避免不必要的重新计算
- 🎯 **智能布局**: 自动计算最优位置，支持动态插入和删除
- 🔧 **灵活配置**: 支持动态列数、间距调整、错误处理等
- 🛡️ **错误处理**: 多种错误处理模式，包括重试、占位图、兜底方案
- 📱 **UniApp 优化**: 专为 UniApp 环境优化，支持各端兼容
- 🎨 **TypeScript**: 完整的 TypeScript 类型支持

## 安装

```bash
npm install yun-waterfall-uni
```

## 快速开始

### 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { YunWaterfall, YunWaterfallItem } from 'yun-waterfall-uni'

const list = ref([
  { id: 1, imageUrl: 'https://example.com/1.jpg', title: '标题1' },
  { id: 2, imageUrl: 'https://example.com/2.jpg', title: '标题2' },
  // ...
])
</script>

<template>
  <YunWaterfall :columns="2" :column-gap="16" :row-gap="16">
    <YunWaterfallItem
      v-for="(item, index) in list"
      :key="item.id"
      :index="index"
    >
      <template #default="{ loaded, columnWidth }">
        <image
          :src="item.imageUrl"
          :style="{ width: `${columnWidth}px` }"
          mode="widthFix"
          @load="loaded"
          @error="loaded"
        />
        <view class="content">
          <text>{{ item.title }}</text>
        </view>
      </template>
    </YunWaterfallItem>
  </YunWaterfall>
</template>
```

## API 文档

### YunWaterfall Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | number | 2 | 瀑布流列数，支持动态修改 |
| columnGap | number | 16 | 列间距（px） |
| rowGap | number | 16 | 行间距（px） |
| maxRetries | number | 1 | 全局最大重试次数 |
| retryDelay | number | 1000 | 全局重试延迟时间（ms） |
| fallbackHeight | number | 200 | 加载失败时的备用高度（px） |
| rootClass | string | - | 容器自定义类名 |
| rootStyle | StyleValue | - | 容器自定义样式 |

### YunWaterfall Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| loadEnd | 所有项目加载完成时触发 | - |
| loadStart | 开始加载项目时触发 | - |
| retry | 项目重试加载时触发 | - |

### YunWaterfall Methods

通过 `ref` 调用组件方法：

| 方法名 | 说明 | 参数 | 使用场景 |
|--------|------|------|----------|
| reflow() | 完整重排，重新排版所有项目 | - | 布局发生重大变化时 |
| refreshReflow() | 刷新重排，重置数据后重新排版 | - | 清空数据重新开始时 |
| loadDone(handler) | 注册加载完成回调 | handler: () => void | 监听所有项目加载完成 |

### YunWaterfallItem Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| index | number | - | 项目索引，用于插入排序（重要：确保正确的显示顺序） |
| width | number | - | 固定宽度（已知尺寸时使用，可提升性能） |
| height | number | - | 固定高度（已知尺寸时使用，可提升性能） |
| maxWait | number | 3000 | 最大等待时间（ms），超时后使用兜底方案 |
| errorHandlingMode | string | 'none' | 错误处理模式：'none' \| 'placeholder' \| 'retry' \| 'fallback' |
| retryCount | number | 2 | 重试次数（retry/fallback 模式下生效） |
| rootClass | string | - | 项目容器自定义类名 |
| rootStyle | StyleValue | - | 项目容器自定义样式 |

### YunWaterfallItem Slots

#### 默认插槽

```vue
<YunWaterfallItem>
  <template #default="{ loaded, columnWidth, imageHeight, errorInfo }">
    <!-- 你的内容 -->
    <image :src="imageUrl" @load="loaded" @error="loaded" />
  </template>
</YunWaterfallItem>
```

**插槽参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| loaded | Function | 内容加载完成回调，**必须调用**，否则布局不会更新 |
| columnWidth | number | 当前列宽度，根据容器宽度和列数自动计算 |
| imageHeight | number | 建议图片高度（基于已知宽高比计算，仅在传入 width/height 时有效） |
| errorInfo | Object | 错误处理信息对象，包含当前状态和回调方法 |

**errorInfo 对象：**

| 属性 | 类型 | 说明 |
|------|------|------|
| status | string | 当前状态：'none' \| 'fail' \| 'phok' \| 'timeout' \| 'final' |
| message | string | 状态描述信息 |
| placeholder.load | Function | 占位图加载成功回调 |
| placeholder.error | Function | 占位图加载失败回调 |

## 使用示例

### 动态列数

```vue
<script setup>
import { ref } from 'vue'

const columns = ref(2)

function onColumnsChange({ detail: { value } }) {
  columns.value = value
  // 列数变化会自动触发重排
}
</script>

<template>
  <view>
    <!-- 列数控制器 -->
    <slider
      :value="columns"
      :min="1"
      :max="5"
      show-value
      @change="onColumnsChange"
    />

    <YunWaterfall
      :columns="columns"
      :column-gap="8"
      :row-gap="8"
    >
      <YunWaterfallItem
        v-for="(item, index) in list"
        :key="item.id"
        :index="index"
      >
        <template #default="{ loaded, columnWidth }">
          <image
            :src="item.imageUrl"
            :style="{ width: `${columnWidth}px` }"
            mode="widthFix"
            @load="loaded"
            @error="loaded"
          />
        </template>
      </YunWaterfallItem>
    </YunWaterfall>
  </view>
</template>
```

### 已知尺寸优化

当你已知图片尺寸时，可以传入 `width` 和 `height` 属性来优化性能：

```vue
<script setup>
const list = ref([
  {
    id: 1,
    imageUrl: 'https://example.com/1.jpg',
    width: 300,
    height: 400
  },
  // ...
])
</script>

<template>
  <YunWaterfall :columns="2">
    <YunWaterfallItem
      v-for="(item, index) in list"
      :key="item.id"
      :index="index"
      :width="item.width"
      :height="item.height"
    >
      <template #default="{ loaded, columnWidth, imageHeight }">
        <image
          :src="item.imageUrl"
          :style="{
            width: `${columnWidth}px`,
            height: `${imageHeight}px`,
          }"
          @load="loaded"
          @error="loaded"
        />
      </template>
    </YunWaterfallItem>
  </YunWaterfall>
</template>
```

### 错误处理模式

组件提供了四种错误处理模式：

#### 1. 默认模式 (none)

```vue
<YunWaterfallItem error-handling-mode="none">
  <template #default="{ loaded, columnWidth }">
    <image
      :src="item.imageUrl"
      :style="{ width: columnWidth + 'px' }"
      @load="loaded"
      @error="loaded"
    />
  </template>
</YunWaterfallItem>
```

#### 2. 占位图模式 (placeholder)

```vue
<YunWaterfallItem error-handling-mode="placeholder">
  <template #default="{ loaded, columnWidth, errorInfo }">
    <image
      v-if="errorInfo.status === 'none'"
      :src="item.imageUrl"
      :style="{ width: columnWidth + 'px' }"
      @load="loaded"
      @error="loaded"
    />
    <image
      v-else
      src="/static/placeholder.png"
      :style="{ width: columnWidth + 'px' }"
      @load="errorInfo.placeholder.load"
      @error="errorInfo.placeholder.error"
    />
  </template>
</YunWaterfallItem>
```

#### 3. 重试模式 (retry)

```vue
<YunWaterfallItem
  error-handling-mode="retry"
  :retry-count="3"
>
  <template #default="{ loaded, columnWidth, errorInfo }">
    <image
      :src="item.imageUrl"
      :style="{ width: columnWidth + 'px' }"
      @load="loaded"
      @error="loaded"
    />
    <view v-if="errorInfo.status === 'final'" class="error-fallback">
      <text>加载失败</text>
    </view>
  </template>
</YunWaterfallItem>
```

#### 4. 完整模式 (fallback)

```vue
<YunWaterfallItem
  error-handling-mode="fallback"
  :retry-count="3"
  :max-wait="5000"
>
  <template #default="{ loaded, columnWidth, errorInfo }">
    <!-- 正常内容 -->
    <image
      v-if="errorInfo.status === 'none'"
      :src="item.imageUrl"
      :style="{ width: columnWidth + 'px' }"
      @load="loaded"
      @error="loaded"
    />

    <!-- 占位图 -->
    <image
      v-else-if="errorInfo.status === 'fail'"
      src="/static/placeholder.png"
      :style="{ width: columnWidth + 'px' }"
      @load="errorInfo.placeholder.load"
      @error="errorInfo.placeholder.error"
    />

    <!-- 最终兜底 -->
    <view
      v-else-if="errorInfo.status === 'final'"
      :style="{ width: columnWidth + 'px', height: '200px' }"
      class="fallback"
    >
      <text>加载失败</text>
    </view>
  </template>
</YunWaterfallItem>
```

### 数据操作示例

```vue
<script setup>
import { ref } from 'vue'
import { YunWaterfall, YunWaterfallItem } from 'yun-waterfall-uni'

const waterfallRef = ref()
const columns = ref(2)
const list = ref([])
let nextId = 1

// 生成数据项
function generateItem() {
  return {
    id: nextId++,
    title: `项目 ${nextId}`,
    imageUrl: `https://picsum.photos/300/${Math.floor(Math.random() * 200) + 200}?random=${nextId}`
  }
}

// 头部插入
function insertAtBeginning() {
  const newItem = generateItem()
  list.value.unshift(newItem)
}

// 中间插入
function insertAtMiddle() {
  if (list.value.length === 0) {
    insertAtBeginning()
    return
  }
  const middleIndex = Math.floor(list.value.length / 2)
  const newItem = generateItem()
  list.value.splice(middleIndex, 0, newItem)
}

// 尾部插入
function insertAtEnd() {
  const newItem = generateItem()
  list.value.push(newItem)
}

// 批量插入
function insertBatch() {
  const batchData = Array.from({ length: 10 }, () => generateItem())
  const insertIndex = Math.floor(Math.random() * (list.value.length + 1))
  list.value.splice(insertIndex, 0, ...batchData)
}

// 删除项目
function removeItem(index) {
  list.value.splice(index, 1)
}

// 清空数据
function clearAll() {
  list.value = []
  nextId = 1
}

// 加载状态回调
function onLoadStart() {
  console.log('开始加载')
}

function onAllLoaded() {
  console.log('所有项目加载完成')
}
</script>

<template>
  <view>
    <!-- 操作按钮 -->
    <view class="controls">
      <button @click="insertAtBeginning">
        头部插入
      </button>
      <button @click="insertAtMiddle">
        中间插入
      </button>
      <button @click="insertAtEnd">
        尾部插入
      </button>
      <button @click="insertBatch">
        批量插入
      </button>
      <button @click="clearAll">
        清空数据
      </button>
    </view>

    <YunWaterfall
      ref="waterfallRef"
      :columns="columns"
      @load-end="onAllLoaded"
      @load-start="onLoadStart"
    >
      <YunWaterfallItem
        v-for="(item, index) in list"
        :key="item.id"
        :index="index"
      >
        <template #default="{ loaded, columnWidth }">
          <view class="item">
            <image
              :src="item.imageUrl"
              :style="{ width: `${columnWidth}px` }"
              mode="widthFix"
              @load="loaded"
              @error="loaded"
            />
            <view class="content">
              <text>{{ item.title }}</text>
              <button class="remove-btn" @click="removeItem(index)">
                删除
              </button>
            </view>
          </view>
        </template>
      </YunWaterfallItem>
    </YunWaterfall>
  </view>
</template>
```

### 手动控制重排

```vue
<script setup>
import { onMounted, ref } from 'vue'

const waterfallRef = ref()
const columns = ref(2)
const list = ref([])

// 切换列数
function changeColumns() {
  columns.value = columns.value === 2 ? 3 : 2
  // 列数变化会自动触发重排，无需手动调用
}

// 刷新数据
function refresh() {
  // 清空数据
  list.value = []
  // 重置瀑布流状态
  waterfallRef.value?.refreshReflow()
  // 重新加载数据
  loadData()
}

// 完整重排
function reflow() {
  waterfallRef.value?.reflow()
}

// 监听加载完成
onMounted(() => {
  waterfallRef.value?.loadDone(() => {
    console.log('所有项目加载完成')
  })
})
</script>

<template>
  <view>
    <YunWaterfall ref="waterfallRef" :columns="columns">
      <!-- 瀑布流内容 -->
    </YunWaterfall>

    <view class="controls">
      <button @click="changeColumns">
        切换列数
      </button>
      <button @click="refresh">
        刷新数据
      </button>
      <button @click="reflow">
        完整重排
      </button>
    </view>
  </view>
</template>
```

## 最佳实践

### 1. 性能优化

- **已知尺寸优化**：如果你知道图片的宽高比，传入 `width` 和 `height` 属性可以显著提升性能
- **合理设置列数**：移动端建议 2-3 列，平板建议 3-4 列，桌面端建议 4-6 列
- **图片懒加载**：结合 UniApp 的图片懒加载功能，减少内存占用

### 2. 错误处理策略

- **生产环境**：建议使用 `fallback` 模式，提供完整的错误处理机制
- **开发环境**：可以使用 `none` 模式，便于调试问题
- **网络较差环境**：增加 `retryCount` 和 `maxWait` 时间

### 3. 数据管理

- **使用唯一 key**：确保每个项目都有唯一的 key，避免渲染问题
- **正确设置 index**：index 属性决定了项目的显示顺序，务必正确设置
- **批量操作**：大量数据变更时，考虑使用 `refreshReflow()` 重置状态

### 4. 响应式设计

```vue
<script setup>
import { computed } from 'vue'

// 根据屏幕宽度动态调整列数
const columns = computed(() => {
  const screenWidth = uni.getSystemInfoSync().screenWidth
  if (screenWidth < 400)
    return 2
  if (screenWidth < 600)
    return 3
  if (screenWidth < 900)
    return 4
  return 5
})
</script>
```

### 5. 内存管理

- **及时清理**：页面销毁时清空数据，避免内存泄漏
- **限制数量**：对于长列表，考虑实现虚拟滚动或分页加载
- **图片优化**：使用适当的图片尺寸和格式

## 常见问题

### Q: 为什么图片加载后布局没有更新？
A: 确保在图片的 `@load` 和 `@error` 事件中调用了 `loaded` 回调函数。

### Q: 如何实现无限滚动？
A: 结合 UniApp 的 `onReachBottom` 生命周期，在触底时加载更多数据并添加到列表末尾。

### Q: 动态修改列数后布局错乱怎么办？
A: 列数变化会自动触发重排，如果仍有问题，可以手动调用 `reflow()` 方法。

### Q: 如何自定义加载失败的样式？
A: 通过 `errorInfo.status` 判断当前状态，在插槽中渲染不同的内容和样式。

## License

MIT
