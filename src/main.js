import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { EventBus } from './eventBus'
import './style.css'

const app = createApp(App)

// ✅ 遷移點 2：filters 已移除，改成 src/utils/format.js 內的純函式，
//    各元件自行在 computed / methods 呼叫

// ✅ 遷移點 3：全域自訂指令，鉤子名稱改為 mounted（原 Vue 2 的 inserted）
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// ✅ 遷移點 4：全域 mixin（曾過渡成 app.mixin）進一步改寫成 composable，
//    見 src/composables/useLogger.js —— 元件各自 import useLogger() 取用，
//    不再靠 app.mixin 隱式掛在每個 instance 上

// ✅ 遷移點 5：Event Bus 改用 mitt，實例不再有 $on/$off/$emit
//    用法示範：Home.vue（同元件內 emit/on，練習用）、
//    store/index.js 的 addToCart → App.vue 的 toast（真正跨元件、無父子關係的用法）
app.config.globalProperties.$bus = EventBus

// ✅ 遷移點 1：new Vue({...}).$mount('#app') 改成 createApp(App).use(...).mount('#app')
app.use(router)
app.use(store)
app.mount('#app')
