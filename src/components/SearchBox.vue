<template>
  <div>
    <!-- ✅ 遷移點 9：$emit('update:keyword') 事件名不變，
         父層已改用 v-model:keyword 取代 .sync -->
    <input
      v-focus
      class="field-input"
      :value="keyword"
      :placeholder="placeholder"
      @input="$emit('update:keyword', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: 'SearchBox',
  props: {
    keyword: { type: String, default: '' },
    placeholder: { type: String, default: '' }
  }
}
</script>
