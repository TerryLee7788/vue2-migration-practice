<template>
  <div class="data-list">
    <!-- ✅ 遷移點 10：具名插槽 <slot name="empty"> 本身不變，
         父層已把 slot="empty" 改成 v-slot:empty -->
    <template v-if="!items.length">
      <slot name="empty">預設：沒有資料</slot>
    </template>

    <ul v-else>
      <li v-for="item in items" :key="item.id">
        <!-- ✅ 遷移點 10：作用域插槽本身不變，父層已把
             slot-scope="{ item }" 改成 v-slot="{ item }" -->
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
