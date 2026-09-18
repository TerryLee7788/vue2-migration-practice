<template>
  <!-- ✅ 遷移點 11：$listeners 已併入 $attrs，移除 v-on="$listeners"，
       只需 v-bind="$attrs" -->
  <button class="btn btn-ghost" v-bind="$attrs" @click="onClick">
    加入購物車
  </button>
</template>

<script setup>
// ✅ 遷移點 11：defineOptions({ inheritAttrs: false }) + defineEmits(['add'])
//    取代 Options API 的 inheritAttrs: false + emits: ['add']，
//    宣告在 defineEmits 的事件才不會落入 $attrs
defineOptions({ inheritAttrs: false })

const props = defineProps({
  product: { type: Object, required: true }
})
const emit = defineEmits(['add'])

function onClick() {
  emit('add', props.product.id)
}
</script>
