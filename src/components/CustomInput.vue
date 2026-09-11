<template>
  <div class="mb-3">
    <label v-if="label" class="mb-1 block text-[13px] text-[#6b7280]">{{ label }}</label>
    <input
      type="text"
      class="field-input mb-0"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: 'CustomInput',
  // ✅ 遷移點 12：Vue 2 的 model 選項移除，改用 modelValue prop
  //    + update:modelValue 事件（v-model 的預設值）
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, default: '' }
  },
  emits: ['update:modelValue']
}
</script>
