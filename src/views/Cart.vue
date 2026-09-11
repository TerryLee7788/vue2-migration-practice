<template>
  <div class="card">
    <h2 class="mb-3 text-lg font-semibold">購物車</h2>
    <p v-if="!cartItems.length" class="text-[#5b6472]">
      購物車是空的，去<router-link to="/products" class="text-[#42b983]">逛逛商品</router-link>吧。
    </p>

    <ul v-else class="m-0 list-none p-0">
      <li
        v-for="item in cartItems"
        :key="item.id"
        class="flex items-center justify-between gap-3 border-b border-[#eef0f4] py-2.5"
      >
        <span>{{ item.name }} × {{ item.qty }}</span>
        <span>{{ formatCurrency(item.price * item.qty) }}</span>
        <button class="btn btn-ghost" @click="removeFromCart(item.id)">移除</button>
      </li>
    </ul>

    <h3 v-if="cartItems.length" class="mt-3 text-base font-semibold">總計：{{ formatCurrency(cartTotal) }}</h3>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { formatCurrency } from '../utils/format'

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
</script>
