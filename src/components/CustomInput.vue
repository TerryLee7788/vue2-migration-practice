<template>
  <div class="custom-input">
    <label v-if="label">{{ label }}</label>
    <!-- 內部固定用 checked prop + change 事件，由下方 model 選項對應 -->
    <input
      type="text"
      :value="checked"
      @change="$emit('change', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: 'CustomInput',
  // ⚠️ 遷移點：Vue 2 的 model 選項可自訂 v-model 對應的 prop / event
  //    Vue 3 移除 model 選項，改用 v-model 綁 modelValue + update:modelValue，
  //    或 v-model:foo 具名多重綁定
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: { type: String, default: '' },
    label: { type: String, default: '' }
  }
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
