# yun-waterfall-uni

一个适用于 Vue3 + UniApp 的瀑布流组件

## 安装

```bash
npm install yun-waterfall-uni
```

## 使用

```vue
<template>
  <YunWaterfall :columns="2" :column-gap="16">
    <YunWaterfallItem 
      v-for="item in list" 
      :key="item.id"
    >
      <!-- 你的内容 -->
    </YunWaterfallItem>
  </YunWaterfall>
</template>

<script setup>
import { YunWaterfall, YunWaterfallItem } from 'yun-waterfall-uni'
</script>
```

## API

### YunWaterfall Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | number | 2 | 列数 |
| columnGap | number | 16 | 列间距 |
| rowGap | number | 16 | 行间距 |

### YunWaterfallItem Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | - | 项目宽度 |
| height | number | - | 项目高度 |

## License

MIT