<template>
  <!-- ⚠️ 遷移點：v-on="$listeners" 在 Vue 3 移除，$listeners 已併入 $attrs
       inheritAttrs: false + v-bind="$attrs" 的行為在 Vue 3 也有變化 -->
  <button class="ghost" v-bind="$attrs" v-on="$listeners" @click="onClick">
    加入購物車
  </button>
</template>

<script>
export default {
  name: 'ProductRow',
  inheritAttrs: false,
  props: {
    product: { type: Object, required: true }
  },
  methods: {
    onClick() {
      // 也可直接 this.$emit('add')，這裡示範 $listeners 透傳
      this.$emit('add', this.product.id)
    }
  }
}
</script>
