# yun-waterfall-uni

一个适用于 Vue3 + UniApp 的瀑布流组件

## 安装

```bash
npm install yun-waterfall-uni
```

## 使用

### 基础用法

```vue
<template>
  <YunWaterfall :columns="2" :column-gap="16">
    <YunWaterfallItem 
      v-for="(item, index) in list" 
      :key="item.id"
      :index="index"
    >
      <template #default="{ onLoad, columnWidth }">
        <image 
          :src="item.imageUrl" 
          :style="{ width: columnWidth + 'px' }"
          @load="onLoad" 
          @error="onLoad" 
        />
        <view class="content">
          <text>{{ item.title }}</text>
        </view>
      </template>
    </YunWaterfallItem>
  </YunWaterfall>
</template>

<script setup>
import { YunWaterfall, YunWaterfallItem } from 'yun-waterfall-uni'

const list = ref([
  { id: 1, imageUrl: 'https://example.com/1.jpg', title: '标题1' },
  { id: 2, imageUrl: 'https://example.com/2.jpg', title: '标题2' },
  // ...
])
</script>
```

### 错误处理模式

```vue
<template>
  <YunWaterfall :columns="2">
    <YunWaterfallItem 
      v-for="(item, index) in list" 
      :key="item.id"
      :index="index"
      error-handling-mode="fallback"
      :retry-count="3"
      :max-wait="5000"
    >
      <template #default="{ onLoad, columnWidth, errorInfo }">
        <!-- 正常内容 -->
        <image 
          v-if="errorInfo.status === 'none'"
          :src="item.imageUrl" 
          :style="{ width: columnWidth + 'px' }"
          @load="onLoad" 
          @error="onLoad" 
        />
        
        <!-- 占位图 -->
        <image 
          v-else-if="errorInfo.status === 'original_failed'"
          src="/static/placeholder.png"
          :style="{ width: columnWidth + 'px' }"
          @load="errorInfo.placeholder.onLoad" 
          @error="errorInfo.placeholder.onError" 
        />
        
        <!-- 最终兜底 -->
        <view 
          v-else-if="errorInfo.status === 'final_fallback'"
          :style="{ width: columnWidth + 'px', height: '200px' }"
          class="fallback"
        >
          <text>加载失败</text>
        </view>
      </template>
    </YunWaterfallItem>
  </YunWaterfall>
</template>
```

### 手动控制重排

```vue
<template>
  <YunWaterfall ref="waterfallRef" :columns="columns">
    <!-- 瀑布流内容 -->
  </YunWaterfall>
  
  <button @click="changeColumns">切换列数</button>
  <button @click="refresh">刷新数据</button>
</template>

<script setup>
import { ref } from 'vue'

const waterfallRef = ref()
const columns = ref(2)

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

// 监听加载完成
waterfallRef.value?.onLoad(() => {
  console.log('所有项目加载完成')
})
</script>
```

## API

### YunWaterfall Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | number | 2 | 瀑布流列数 |
| columnGap | number | 16 | 列间距（px） |
| rowGap | number | 16 | 行间距（px） |
| maxRetries | number | 1 | 最大重试次数 |
| retryDelay | number | 1000 | 重试延迟时间（ms） |
| fallbackHeight | number | 200 | 加载失败时的备用高度（px） |
| rootClass | string | - | 容器自定义类名 |
| rootStyle | StyleValue | - | 容器自定义样式 |

### YunWaterfall Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| load | 所有项目加载完成时触发 | - |
| loadstart | 开始加载项目时触发 | - |
| retry | 项目重试加载时触发 | - |

### YunWaterfall Methods

通过 `ref` 调用组件方法：

| 方法名 | 说明 | 参数 |
|--------|------|------|
| reflow() | 增量重排，处理待排版队列 | - |
| fullReflow() | 完整重排，重新排版所有项目 | - |
| refreshReflow() | 刷新重排，重置数据后重新排版 | - |
| onLoad(handler) | 注册加载完成回调 | handler: () => void |

### YunWaterfallItem Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| index | number | - | 项目索引，用于插入排序 |
| width | number | - | 固定宽度（已知尺寸时使用） |
| height | number | - | 固定高度（已知尺寸时使用） |
| maxWait | number | - | 最大等待时间（ms），超时后使用兜底方案 |
| errorHandlingMode | string | 'none' | 错误处理模式：'none' \| 'placeholder' \| 'retry' \| 'fallback' |
| retryCount | number | 2 | 重试次数（retry/fallback 模式下生效） |
| errorImageSrc | string | - | 错误图片地址 |
| rootClass | string | - | 项目容器自定义类名 |
| rootStyle | StyleValue | - | 项目容器自定义样式 |

### YunWaterfallItem Slots

#### 默认插槽

```vue
<YunWaterfallItem>
  <template #default="{ onLoad, columnWidth, imageHeight, errorInfo }">
    <!-- 你的内容 -->
    <image :src="imageUrl" @load="onLoad" @error="onLoad" />
  </template>
</YunWaterfallItem>
```

**插槽参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| onLoad | Function | 内容加载完成回调，必须调用 |
| columnWidth | number | 当前列宽度 |
| imageHeight | number | 建议图片高度（基于宽高比计算） |
| errorInfo | Object | 错误处理信息对象 |

**errorInfo 对象：**

| 属性 | 类型 | 说明 |
|------|------|------|
| status | string | 当前状态：'none' \| 'original_failed' \| 'placeholder_loading' \| 'placeholder_success' \| 'timeout' \| 'final_fallback' |
| message | string | 状态描述信息 |
| placeholder.onLoad | Function | 占位图加载成功回调 |
| placeholder.onError | Function | 占位图加载失败回调 |

## License

MIT