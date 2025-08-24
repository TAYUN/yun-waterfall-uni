<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import YunWaterfall from '../components/yun-waterfall.vue'
import YunWaterfallItem from '../components/yun-waterfall-item.vue'

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
          url: `https://fastly.jsdelivr.net/npm/@sard/assets/images/tiger${(i % 12) + 1}.jpg`,
        }
      })
    resolve(data)
  })
}

function onLoad() { }
function sliderChange({ detail: { value } }: any) {
  console.log('value', value)
  columns.value = value
}
onMounted(async () => {
  list.value.push(...(await getData()))
})
</script>

<template>
  <view>
    <slider :value="columns" class="mb-2" show-value :min="1" :max="8" @change="sliderChange" />
    <yun-waterfall class="mx-2" :columns="columns" :column-gap="4" :row-gap="4" @load="onLoad">
      <yun-waterfall-item v-for="(item, index) in list" :key="index">
        <template #default="{ onLoad }">
          <image mode="widthFix" class="w-full flex" :src="item.url" @load="onLoad" @error="onLoad" />
        </template>
      </yun-waterfall-item>
    </yun-waterfall>

    <!-- 瀑布流演示导航 -->
    <!-- <WaterfallDemoNavigation /> -->
  </view>
</template>

<route lang="json">
{
  "name": "waterfall-columns",
  "layout": "default",
  "style": {
    "navigationBarTitleText": "瀑布流"
  }
}
</route>
