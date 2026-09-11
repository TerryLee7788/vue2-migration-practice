<template>
  <!-- ✅ 遷移點 11：$listeners 已併入 $attrs，移除 v-on="$listeners"，
       只需 v-bind="$attrs" -->
  <button class="btn btn-ghost" v-bind="$attrs" @click="onClick">
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
  // 宣告 emits，避免 @add 監聽器被當成一般屬性落入 $attrs
  emits: ['add'],
  methods: {
    onClick() {
      this.$emit('add', this.product.id)
    }
  }
}
</script>
