<template>
  <div class="mb-3">
    <label v-if="label" class="mb-1 block text-[13px] text-secondary">{{ label }}</label>
    <input
      type="text"
      class="field-input mb-0"
      v-model.lazy="modelValue"
    />
  </div>
</template>

<script setup>
// ✅ 遷移點 12：Vue 2 的 model 選項移除，改用 defineModel() 巨集
//    （取代 Options API 寫法的 modelValue prop + update:modelValue 事件）
defineProps({
  label: { type: String, default: '' }
})
const modelValue = defineModel({ type: String, default: '' })
</script>
