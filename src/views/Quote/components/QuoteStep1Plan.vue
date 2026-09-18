<template>
  <div>
    <h3 class="mb-3 text-base font-semibold">Step 1：選擇方案</h3>

    <div class="grid gap-3 sm:grid-cols-3">
      <button
        v-for="plan in plans"
        :key="plan.id"
        type="button"
        class="cursor-pointer rounded-md border p-4 text-left transition-colors"
        :class="plan.id === selectedPlanId
          ? 'border-brand bg-brand-soft'
          : 'border-border-input hover:border-brand'"
        @click="selectPlan(plan.id)"
      >
        <p class="font-semibold">{{ plan.name }}</p>
        <p class="my-1 text-sm text-secondary">{{ plan.desc }}</p>
        <p class="font-bold text-brand">{{ formatCurrency(plan.monthlyRate) }} / 月起</p>
      </button>
    </div>

    <div class="mt-4 flex justify-end">
      <button
        type="button"
        class="btn"
        :class="{ 'cursor-not-allowed opacity-50 hover:bg-brand': !selectedPlanId }"
        :disabled="!selectedPlanId"
        @click="$emit('next')"
      >
        下一步
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { formatCurrency } from '@/utils/format'

defineEmits(['next'])

const store = useStore()
const plans = computed(() => store.state.quote.plans)
const selectedPlanId = computed(() => store.state.quote.selectedPlanId)

function selectPlan(planId) {
  // 選取結果直接 dispatch 回共用的 store，不留在這個元件自己的 data 裡
  store.dispatch('setQuotePlan', planId)
}
</script>
