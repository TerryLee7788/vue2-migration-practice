<template>
  <div class="card">
    <h2 class="mb-3 text-lg font-semibold">保費試算</h2>

    <ol class="mb-5 flex list-none gap-2 p-0 text-sm">
      <li
        v-for="step in steps"
        :key="step.n"
        class="flex-1 rounded-md border px-3 py-2 text-center"
        :class="step.n === currentStep
          ? 'border-brand font-semibold text-brand'
          : 'border-border text-subtle'"
      >
        {{ step.n }}. {{ step.label }}
      </li>
    </ol>

    <QuoteStep1Plan v-if="currentStep === 1" @next="goNext" />
    <QuoteStep2BasicInfo v-else-if="currentStep === 2" @prev="goPrev" @next="goNext" />
    <QuoteStep3Result v-else @prev="goPrev" @restart="currentStep = 1" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QuoteStep1Plan from './components/QuoteStep1Plan.vue'
import QuoteStep2BasicInfo from './components/QuoteStep2BasicInfo.vue'
import QuoteStep3Result from './components/QuoteStep3Result.vue'

// ✅ 跨元件共享機制：Step1/2/3 是各自獨立的元件，用 v-if 切換時整個卸載/重新掛載，
//    所以「選了哪個方案」「填了什麼基本資料」都不能放在某一步元件自己的 data 裡，
//    已經改成讀寫 Vuex store（見 src/store/index.js 的 quote 狀態，三個步驟元件
//    都各自 useStore() 存取同一份資料）。這裡只留「目前在第幾步」這種單純的 UI
//    導覽狀態，因為這個 wizard 容器本身在整個流程中不會被卸載，留區域 ref 就夠了。
const currentStep = ref(1)

const steps = [
  { n: 1, label: '選擇方案' },
  { n: 2, label: '基本資料' },
  { n: 3, label: '試算結果' }
]

function goNext() {
  if (currentStep.value < 3) currentStep.value++
}
function goPrev() {
  if (currentStep.value > 1) currentStep.value--
}
</script>
