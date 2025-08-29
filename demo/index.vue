<script lang="ts" setup>
import { onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { YunWaterfall, YunWaterfallItem } from 'yun-waterfall-uni'
import SimulatedImage from '../components/SimulatedImage.vue'
import { text } from './mock'

interface ListItem {
  title: string
  img: {
    width: number
    height: number
  }
  id: number | string
}

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
const placeholderSrc
  = Math.random() > 0.5
    ? 'https://wot-ui.cn/logo.png'
    : 'https://sutras.github.io/sard-uniapp-docs//logo.svg'

const list = ref<ListItem[]>([])
// 全局计数器，确保 index 的顺序性
let globalIndex = 0

function getData(count = 10) {
  return new Promise<ListItem[]>((resolve) => {
    const data = Array.from({ length: count }, () => 0)
      .fill(0)
      .map(() => generateItem(++globalIndex))
    resolve(data)
  })
}
// 错误类型文本转换
function getErrorTypeText(status: string) {
  switch (status) {
    case 'fail':
      return '原始内容加载失败'
    case 'final':
      return '占位图片也加载失败'
    case 'timeout':
      return '加载超时'
    case 'phok':
      return '占位图片加载成功'
    default:
      return ''
  }
}

function loadEnd() {
}
let nextId = 1
// 生成单个数据项
function generateItem(index: number) {
  const min = 5
  const max = 30
  const startIndex = random(0, text.length - max)
  const length = random(min, max)
  return {
    title: `${index}--${text.slice(startIndex, startIndex + length)}`,
    id: nextId++,
    img: {
      width: random(100, 300),
      height: random(100, 300),
    },
  }
}

// 头部插入数据
function insertAtBeginning() {
  const newItem = generateItem(++globalIndex)
  list.value.unshift(newItem)
}

// 中间插入数据
function insertAtMiddle() {
  if (list.value.length === 0) {
    insertAtBeginning()
    return
  }
  const middleIndex = Math.floor(list.value.length / 2)
  const newItem = generateItem(++globalIndex)
  list.value.splice(middleIndex, 0, newItem)
}

// 尾部插入数据
function insertAtEnd() {
  const newItem = generateItem(++globalIndex)
  list.value.push(newItem)
}

// 随机位置插入数据
function insertRandom() {
  if (list.value.length === 0) {
    insertAtBeginning()
    return
  }
  const randomIndex = random(0, list.value.length)
  const newItem = generateItem(++globalIndex)
  list.value.splice(randomIndex, 0, newItem)
}

// 批量插入数据
async function insertBatch() {
  const batchData = await getData()
  const insertIndex = random(0, list.value.length)
  list.value.splice(insertIndex, 0, ...batchData)
}

// 清空所有数据
function clearAll() {
  list.value = []
  globalIndex = 0 // 重置计数器
}

// 中间删除数据
function deleteAtMiddle() {
  if (list.value.length === 0) {
    return
  }
  const middleIndex = Math.floor(list.value.length / 2)
  list.value.splice(middleIndex, 1)
}

// 随机删除数据
function deleteRandom() {
  if (list.value.length === 0) {
    return
  }
  const randomIndex = random(0, list.value.length - 1)
  list.value.splice(randomIndex, 1)
}

// 删除首项
function deleteFirst() {
  if (list.value.length === 0) {
    return
  }
  list.value.shift()
}
// 删除首项
function removeItem(index: number) {
  if (list.value.length === 0) {
    return
  }
  list.value.splice(index, 1)
}

// 删除末项
function deleteLast() {
  if (list.value.length === 0) {
    return
  }
  list.value.pop()
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
    <!-- 数据插入测试按钮 -->
    <view class="flex">
      <wd-button size="small" @click="insertAtBeginning">
        头部插入
      </wd-button>
      <wd-button size="small" @click="insertAtMiddle">
        中间插入
      </wd-button>
      <wd-button size="small" @click="insertAtEnd">
        尾部插入
      </wd-button>
      <wd-button size="small" @click="insertRandom">
        随机插入
      </wd-button>
      <wd-button size="small" @click="insertBatch">
        批量插入
      </wd-button>
      <wd-button size="small" @click="clearAll">
        清空数据
      </wd-button>
    </view>
    <view class="mt-2 flex">
      <wd-button size="small" @click="deleteAtMiddle">
        中间删除
      </wd-button>
      <wd-button size="small" @click="deleteRandom">
        随机删除
      </wd-button>
      <wd-button size="small" @click="deleteFirst">
        删除首项
      </wd-button>
      <wd-button size="small" @click="deleteLast">
        删除末项
      </wd-button>
    </view>

    <yun-waterfall class="mx-2" @load-end="loadEnd">
      <yun-waterfall-item v-for="(item, index) in list" :key="item.id" :index="index" error-handling-mode="fallback">
        <template #default="{ loaded, errorInfo }">
          <view class="overflow-hidden border border-gray-300 rounded-lg border-solid bg-white shadow-lg">
            <!-- 第一层：正常内容 -->
            <SimulatedImage v-if="errorInfo.status === 'none'" :meta="item.img" @load="loaded" />
            <!-- 第二层：占位图片 -->
            <view
              v-else-if="
                [
                  'fail',
                  'phok',
                ].includes(errorInfo.status)
              " class="fallback-container"
            >
              <image
                :src="placeholderSrc" mode="aspectFill" class="fallback-image" @load="errorInfo.placeholder.load"
                @error="errorInfo.placeholder.error"
              />
            </view>
            <!-- 第三层：最终兜底 -->
            <view v-else class="final-fallback">
              <view class="fallback-content">
                <text class="fallback-text">
                  {{ errorInfo.message || '图片加载失败' }}
                </text>
                <text class="fallback-type">
                  {{ getErrorTypeText(errorInfo.status) }}
                </text>
              </view>
            </view>
            <view class="p-2">
              <view class="mb-2">
                {{ item.title }}
              </view>
              <wd-button size="small" type="error" @click="removeItem(index)">
                删除此项
              </wd-button>
            </view>
          </view>
        </template>
      </yun-waterfall-item>
    </yun-waterfall>

    <view class="p-10" />
    <!-- 瀑布流演示导航 -->
    <NavTab />
  </view>
</template>

<style lang="scss" scoped>
// 错误处理相关样式
.fallback-container {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.fallback-image {
  width: 100%;
  height: 100%;
}

.final-fallback {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: 1px dashed #ddd;
}

.fallback-content {
  text-align: center;
}

.fallback-text {
  font-size: 28rpx;
  color: #999;
  display: block;
  margin-bottom: 8rpx;
}

.fallback-type {
  font-size: 24rpx;
  color: #ccc;
  display: block;
}
</style>

<route lang="json">
{
  "name": "waterfall",
  "layout": "default",
  "style": {
    "navigationBarTitleText": "基础示例"
  }
}
</route>
