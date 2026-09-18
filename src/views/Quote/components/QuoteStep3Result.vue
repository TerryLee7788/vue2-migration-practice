<template>
  <div>
    <h3 class="mb-3 text-base font-semibold">Step 3：試算結果</h3>

    <div v-if="estimate" class="rounded-md border border-border p-4">
      <p class="mb-1">方案：<strong>{{ plan.name }}</strong></p>
      <p class="mb-1">姓名：{{ basicInfo.name }}（{{ estimate.age }} 歲）</p>
      <p class="mb-3">性別：{{ genderLabel }}</p>
      <p class="text-lg">每月保費：<strong class="text-brand">{{ formatCurrency(estimate.monthly) }}</strong></p>
      <p class="text-lg">年繳保費：<strong class="text-brand">{{ formatCurrency(estimate.yearly) }}</strong></p>
    </div>
    <p v-else class="text-subtle">資料不完整，無法試算，請返回上一步補齊。</p>

    <div class="mt-4 flex justify-between">
      <button type="button" class="btn btn-ghost" @click="$emit('prev')">上一步</button>
      <button type="button" class="btn" @click="restart">重新試算</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { formatCurrency } from '@/utils/format'

const emit = defineEmits(['prev', 'restart'])

const store = useStore()
const plan = computed(() => store.getters.quoteSelectedPlan)
const basicInfo = computed(() => store.state.quote.basicInfo)
const estimate = computed(() => store.getters.quoteEstimate)

const GENDER_LABEL = { male: '男', female: '女', other: '不透露' }
const genderLabel = computed(() => GENDER_LABEL[basicInfo.value.gender] || '')

function restart() {
  store.dispatch('resetQuote')
  emit('restart')
}
</script>
