import { createStore } from 'vuex'
import { EventBus } from '@/eventBus'
import { calculateEstimate } from '@/utils/quote'

// ✅ 遷移點 7：Vuex 4 用 createStore(...) 取代 Vue.use(Vuex) + new Vuex.Store(...)
const store = createStore({
  state: {
    products: [
      { id: 1, name: '機械鍵盤', price: 2890 },
      { id: 2, name: '人體工學滑鼠', price: 1290 },
      { id: 3, name: '4K 螢幕', price: 8990 },
      { id: 4, name: '4K 螢幕2', price: 18990 }
    ],
    // cart: { [productId]: quantity }
    cart: {},
    // 多步驟試算（/quote）用的共用狀態：選了哪個方案、填了哪些基本資料。
    // 放進 store 而不是留在某一步驟元件自己的 data 裡，是因為 Step1/2/3 用 v-if
    // 切換時元件會整個卸載重新掛載，區域 state 會被清空——放 store 才能讓使用者
    // 在任一步驟點「上一步」時，已經填好（甚至填到一半）的資料還在。
    quote: {
      plans: [
        { id: 'basic', name: '基本方案', monthlyRate: 300, desc: '基礎意外保障' },
        { id: 'standard', name: '標準方案', monthlyRate: 600, desc: '意外＋醫療保障' },
        { id: 'premium', name: '尊爵方案', monthlyRate: 1200, desc: '全方位保障＋海外醫療' }
      ],
      selectedPlanId: null,
      basicInfo: { name: '', birthday: '', gender: '' }
    }
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
    },
    quoteSelectedPlan(state) {
      return state.quote.plans.find(p => p.id === state.quote.selectedPlanId) || null
    },
    quoteEstimate(state, getters) {
      return calculateEstimate(getters.quoteSelectedPlan, state.quote.basicInfo)
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
    },
    SET_QUOTE_PLAN(state, planId) {
      state.quote.selectedPlanId = planId
    },
    SET_QUOTE_BASIC_INFO(state, partialInfo) {
      Object.assign(state.quote.basicInfo, partialInfo)
    },
    RESET_QUOTE(state) {
      state.quote.selectedPlanId = null
      state.quote.basicInfo = { name: '', birthday: '', gender: '' }
    }
  },
  actions: {
    addToCart({ commit, state }, productId) {
      commit('ADD_TO_CART', productId)
      // ✅ EventBus 真正的用途：這裡跟顯示 toast 的 App.vue 沒有父子關係，
      // 用 props/emit 傳不過去，把「一次性通知」塞進 Vuex state 又要多處理「顯示完要自己清掉」，
      // 這種純通知、不需要長期共享狀態的情境，用 event bus 廣播比較合適
      const product = state.products.find(p => p.id === productId)
      if (product) EventBus.emit('cart:add', product.name)
    },
    removeFromCart({ commit }, productId) {
      commit('REMOVE_FROM_CART', productId)
    },
    setQuotePlan({ commit }, planId) {
      commit('SET_QUOTE_PLAN', planId)
    },
    setQuoteBasicInfo({ commit }, partialInfo) {
      commit('SET_QUOTE_BASIC_INFO', partialInfo)
    },
    resetQuote({ commit }) {
      commit('RESET_QUOTE')
    }
  }
})

export default store
