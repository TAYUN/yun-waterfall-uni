<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTimeout } from '../utils/useTimeout'

const props = defineProps<{
  meta: {
    width: number
    height: number
  }
}>()

const emit = defineEmits<{
  (
    e: 'load',
    event: {
      detail: {
        width: number
        height: number
      }
      type: 'load' | 'error'
    },
  ): void
}>()

const internalWidth = ref(320)
const internalHeight = ref(240)

const currWidth = computed(() => internalWidth.value)
const currHeight = computed(() => internalHeight.value)

const paddingTop = computed(
  () => `${(currHeight.value / currWidth.value) * 100}%`,
)

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const { start } = useTimeout(
  () => {
    internalWidth.value = props.meta.width
    internalHeight.value = props.meta.height
    emit('load', {
      detail: {
        width: props.meta.width,
        height: props.meta.height,
      },
      type: Math.random() > 0.7 ? 'load' : 'error',
    })
  },
  random(150, 1500),
)

onMounted(() => {
  start()
})
</script>

<template>
  <view class="relative box-border" :style="{ paddingTop }">
    <view class="absolute inset-0 flex items-center justify-center bg-gray-300">
      <text>{{ meta.width }}</text>
      <text>x</text>
      <text>{{ meta.height }}</text>
    </view>
  </view>
</template>
