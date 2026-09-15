<template>
  <transition-group
    name="stacked-toast"
    tag="div"
    :class="[
      'fixed left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2',
      position === 'top' ? 'top-30' : 'bottom-6'
    ]"
    :style="{ '--stacked-toast-offset': position === 'top' ? '-16px' : '10px' }"
  >
    <div
      v-for="item in items"
      :key="item.id"
      class="w-max whitespace-nowrap rounded-md bg-[#2c3e50] px-4 py-2 text-sm text-white shadow-lg"
    >
      {{ item.text }}
    </div>
  </transition-group>
</template>

<script setup>
// 純顯示用的堆疊訊息元件：本身不管訊息從哪來、什麼時候該消失，
// 呼叫端（Home.vue 的 ping、App.vue 的加入購物車 toast）各自維護自己的 items 陣列跟計時器，
// 這裡只負責「疊加多則、依 position 決定從上或下滑入滑出」這段共用的視覺邏輯
defineProps({
  items: { type: Array, default: () => [] },
  position: { type: String, default: 'bottom' } // 'top'：從上往下滑入；'bottom'：從下往上滑入
})
</script>

<style scoped>
.stacked-toast-enter-active,
.stacked-toast-leave-active,
.stacked-toast-move {
  transition: opacity 0.3s, transform 0.3s;
}
.stacked-toast-enter-from,
.stacked-toast-leave-to {
  opacity: 0;
  transform: translateY(var(--stacked-toast-offset));
}
.stacked-toast-leave-active {
  position: absolute;
}
</style>
