<template>
  <div class="card">
    <h2 class="mb-3 text-lg font-semibold">購物車</h2>
    <p v-if="!cartItems.length" class="text-secondary">
      購物車是空的，去<router-link to="/products" class="text-brand">逛逛商品</router-link>吧。
    </p>

    <ul v-else class="m-0 list-none p-0">
      <li
        v-for="item in cartItems"
        :key="item.id"
        class="grid grid-cols-[1fr_1fr_auto] items-center justify-between gap-3 border-b border-border py-2.5"
      >
        <span>{{ item.name }} × {{ item.qty }}</span>
        <span>{{ formatCurrency(item.price * item.qty) }}</span>
        <button class="btn btn-ghost" @click="removeFromCart(item.id)">移除</button>
      </li>
    </ul>

    <h3 v-if="cartItems.length" class="mt-3 text-base font-semibold">總計：{{ formatCurrency(cartTotal) }}</h3>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { formatCurrency } from '@/utils/format'
import { computed } from 'vue'

const store = useStore()
const cartItems = computed(() => store.getters.cartItems)
const cartTotal = computed(() => store.getters.cartTotal)

function removeFromCart(productId) {
  store.dispatch('removeFromCart', productId)
}

/*
export default {
  name: 'Cart',
  computed: {
    ...mapGetters(['cartItems', 'cartTotal'])
  },
  methods: {
    ...mapActions(['removeFromCart']),
    formatCurrency
  }
}
*/
</script>
