<template>
  <div>
    <!-- ✅ 遷移點 9：defineModel('keyword') 取代 update:keyword 事件手動宣告，
         父層 v-model:keyword 寫法本身不變（原本取代的是 .sync） -->
    <input
      v-focus
      class="field-input"
      v-model="keyword"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup>
defineProps({
  placeholder: { type: String, default: '' }
})
const keyword = defineModel('keyword', { type: String, default: '' })
</script>
