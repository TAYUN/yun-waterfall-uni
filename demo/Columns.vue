<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { onReachBottom } from '@dcloudio/uni-app'
import { YunWaterfall, YunWaterfallItem } from 'yun-waterfall-uni'
import { mockImages } from './mock'

const columns = ref(3)

interface ListItem {
  url: string
}

const list = ref<ListItem[]>([])

function getData() {
  return new Promise<ListItem[]>((resolve) => {
    const data = Array(30)
      .fill(0)
      .map((_, i) => {
        return {
          url: mockImages[i % mockImages.length],
        }
      })
    resolve(data)
  })
}

function loadEnd() { }
function sliderChange({ detail: { value } }: any) {
  console.log('value', value)
  columns.value = value
}
onMounted(async () => {
  list.value.push(...(await getData()))
})
let i = 0
onReachBottom(async () => {
  if (i++ > 10)
    return
  list.value.push(...(await getData()))
})
</script>

<template>
  <view>
    <slider :value="columns" class="mb-2" show-value :min="1" :max="8" @change="sliderChange" />
    <yun-waterfall class="mx-2" :columns="columns" :column-gap="4" :row-gap="4" @load-end="loadEnd">
      <yun-waterfall-item v-for="(item, index) in list" :key="index">
        <template #default="{ loaded }">
          <image mode="widthFix" class="w-full flex" :src="item.url" @load="loaded" @error="loaded" />
        </template>
      </yun-waterfall-item>
    </yun-waterfall>

    <!-- 瀑布流演示导航 -->
    <NavTab />
  </view>
</template>

<route lang="json">
{
  "name": "waterfall-columns",
  "layout": "default",
  "style": {
    "navigationBarTitleText": "列数变化"
  }
}
</route>
