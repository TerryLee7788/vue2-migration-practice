import Vue from 'vue'
import Vuex from 'vuex'

// ⚠️ 遷移點：Vuex 3 需要 Vue.use(Vuex) + new Vuex.Store(...)
//    Vue 3 要換成 Vuex 4 的 createStore(...)，或直接改用 Pinia
Vue.use(Vuex)

const store = new Vuex.Store({
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
      // ⚠️ 遷移點：Vue 2 對「新增物件屬性」不具響應性，必須用 Vue.set
      //    Vue 3 的 Proxy 響應式讓 state.cart[productId] = n 直接就會更新
      Vue.set(state.cart, productId, current + 1)
    },
    REMOVE_FROM_CART(state, productId) {
      // ⚠️ 遷移點：Vue 2 刪除屬性要用 Vue.delete；Vue 3 用 delete 即可
      Vue.delete(state.cart, productId)
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
