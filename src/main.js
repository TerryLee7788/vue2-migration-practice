import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// ⚠️ 遷移點 1：全域過濾器 (Vue 3 已移除 filters)
Vue.filter('currency', function (value) {
  if (typeof value !== 'number') return value
  return 'NT$ ' + value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

Vue.filter('uppercase', function (value) {
  return String(value || '').toUpperCase()
})

// ⚠️ 遷移點 2：全域自訂指令的鉤子名稱 (bind/inserted/update... 在 Vue 3 改名)
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})

// ⚠️ 遷移點 3：全域 mixin，透過 Vue.mixin 掛到「建構子」上
Vue.mixin({
  methods: {
    $log(msg) {
      // eslint-disable-next-line no-console
      console.log('[global mixin]', msg)
    }
  }
})

// ⚠️ 遷移點 4：Event Bus，用一個空的 Vue instance 當事件匯流排
//    Vue 3 的實例不再有 $on / $off / $once，這個模式會壞掉
export const EventBus = new Vue()
Vue.prototype.$bus = EventBus

Vue.config.productionTip = false

// ⚠️ 遷移點 5：new Vue({ ... }).$mount('#app')
//    Vue 3 改成 createApp(App).use(...).mount('#app')
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
