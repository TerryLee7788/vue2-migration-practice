<template>
  <div class="data-list">
    <!-- ⚠️ 遷移點：具名插槽用 <slot name="empty">；
         這裡沒問題，但父層的 slot="empty" 舊語法要改成 v-slot -->
    <template v-if="!items.length">
      <slot name="empty">預設：沒有資料</slot>
    </template>

    <ul v-else>
      <li v-for="item in items" :key="item.id">
        <!-- ⚠️ 遷移點：作用域插槽向父層傳資料
             父層用 slot-scope 接收，Vue 3 改為 v-slot="{ item }" -->
        <slot :item="item">{{ item.name }}</slot>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DataList',
  props: {
    items: { type: Array, default: () => [] }
  }
}
</script>

<style scoped>
.data-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
