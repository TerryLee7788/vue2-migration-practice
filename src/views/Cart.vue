<template>
  <div class="card">
    <h2>購物車</h2>
    <p v-if="!cartItems.length">購物車是空的，去<router-link to="/products">逛逛商品</router-link>吧。</p>

    <ul v-else class="cart-list">
      <li v-for="item in cartItems" :key="item.id">
        <span>{{ item.name }} × {{ item.qty }}</span>
        <span>{{ formatCurrency(item.price * item.qty) }}</span>
        <button class="ghost" @click="removeFromCart(item.id)">移除</button>
      </li>
    </ul>

    <h3 v-if="cartItems.length">總計：{{ formatCurrency(cartTotal) }}</h3>
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

<style scoped>
.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.cart-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #eef0f4;
}
</style>
