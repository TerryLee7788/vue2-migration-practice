import { createStore } from 'vuex'

// ✅ 遷移點 7：Vuex 4 用 createStore(...) 取代 Vue.use(Vuex) + new Vuex.Store(...)
const store = createStore({
  state: {
    products: [
      { id: 1, name: '機械鍵盤', price: 2890 },
      { id: 2, name: '人體工學滑鼠', price: 1290 },
      { id: 3, name: '4K 螢幕', price: 8990 }
    ],
    // cart: { [productId]: quantity }
    cart: {}
  },
  getters: {
    cartCount(state) {
      return Object.values(state.cart).reduce((sum, qty) => sum + qty, 0)
    },
    cartItems(state) {
      return state.products
        .filter(p => state.cart[p.id])
        .map(p => ({ ...p, qty: state.cart[p.id] }))
    },
    cartTotal(state, getters) {
      return getters.cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)
    }
  },
  mutations: {
    ADD_TO_CART(state, productId) {
      const current = state.cart[productId] || 0
      // ✅ 遷移點 8：Vue 3 的 Proxy 響應式讓直接賦值就有響應性，不再需要 Vue.set
      state.cart[productId] = current + 1
    },
    REMOVE_FROM_CART(state, productId) {
      // ✅ 遷移點 8：直接用 delete，不再需要 Vue.delete
      delete state.cart[productId]
    }
  },
  actions: {
    addToCart({ commit }, productId) {
      commit('ADD_TO_CART', productId)
    },
    removeFromCart({ commit }, productId) {
      commit('REMOVE_FROM_CART', productId)
    }
  }
})

export default store
