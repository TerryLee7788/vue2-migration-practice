<template>
  <div class="custom-input">
    <label v-if="label">{{ label }}</label>
    <input
      type="text"
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

<style scoped>
.custom-input {
  margin-bottom: 12px;
}
.custom-input label {
  display: block;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
}
.custom-input input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #d5dae2;
  border-radius: 6px;
}
</style>
