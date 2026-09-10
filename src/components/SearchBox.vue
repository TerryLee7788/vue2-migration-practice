<template>
  <div class="search-box">
    <!-- ⚠️ 遷移點：透過 $emit('update:keyword') 搭配父層 .sync
         Vue 3 改用 v-model:keyword，事件名不變但父層寫法變了 -->
    <input
      v-focus
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

<style scoped>
.search-box input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #d5dae2;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: 14px;
}
</style>
