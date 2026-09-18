<template>
  <div>
    <h3 class="mb-3 text-base font-semibold">Step 2：填寫基本資料</h3>

    <div class="mb-3">
      <label class="mb-1 block text-[13px] text-secondary">姓名</label>
      <input type="text" class="field-input mb-0" v-model.lazy="name" />
    </div>

    <div class="mb-3">
      <label class="mb-1 block text-[13px] text-secondary">生日</label>
      <input type="date" class="field-input mb-0" v-model="birthday" />
    </div>

    <div class="mb-3">
      <label class="mb-1 block text-[13px] text-secondary">性別</label>
      <select class="field-input mb-0" v-model="gender">
        <option value="" disabled>請選擇</option>
        <option value="male">男</option>
        <option value="female">女</option>
        <option value="other">不透露</option>
      </select>
    </div>

    <div class="mt-4 flex justify-between">
      <button type="button" class="btn btn-ghost" @click="$emit('prev')">上一步</button>
      <button
        type="button"
        class="btn"
        :class="{ 'cursor-not-allowed opacity-50 hover:bg-brand': !canProceed }"
        :disabled="!canProceed"
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

defineEmits(['prev', 'next'])

const store = useStore()

// ✅ 跨元件共享機制：這三個欄位不是這個元件自己的 data，而是直接讀寫 Vuex store 裡
//    quote.basicInfo 的 computed getter/setter。每次輸入就即時 commit 回 store，
//    所以就算填到一半按「上一步」讓這個元件被卸載重新掛載，資料也不會不見
//    （不是等按下一步才存，那樣中途返回就會遺失）。
const name = computed({
  get: () => store.state.quote.basicInfo.name,
  set: (value) => store.dispatch('setQuoteBasicInfo', { name: value })
})
const birthday = computed({
  get: () => store.state.quote.basicInfo.birthday,
  set: (value) => store.dispatch('setQuoteBasicInfo', { birthday: value })
})
const gender = computed({
  get: () => store.state.quote.basicInfo.gender,
  set: (value) => store.dispatch('setQuoteBasicInfo', { gender: value })
})

const canProceed = computed(() =>
  name.value.trim().length > 0 && !!birthday.value && !!gender.value
)
</script>
