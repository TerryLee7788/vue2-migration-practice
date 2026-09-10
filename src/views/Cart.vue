<template>
  <div class="card">
    <h2>購物車</h2>
    <p v-if="!cartItems.length">購物車是空的，去<router-link to="/products">逛逛商品</router-link>吧。</p>

    <ul v-else class="cart-list">
      <li v-for="item in cartItems" :key="item.id">
        <span>{{ item.name }} × {{ item.qty }}</span>
        <span>{{ (item.price * item.qty) | currency }}</span>
        <button class="ghost" @click="removeFromCart(item.id)">移除</button>
      </li>
    </ul>

    <h3 v-if="cartItems.length">總計：{{ cartTotal | currency }}</h3>
  </div>
</template>

<script>
// ⚠️ 遷移點：mapGetters / mapActions 來自 vuex 3
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Cart',
  computed: {
    ...mapGetters(['cartItems', 'cartTotal'])
  },
  methods: {
    ...mapActions(['removeFromCart'])
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
