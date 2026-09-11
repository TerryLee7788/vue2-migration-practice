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

// ✅ 遷移點 4：全域 mixin 改掛在 app 實例上
app.mixin({
  methods: {
    $log(msg) {
      // eslint-disable-next-line no-console
      console.log('[global mixin]', msg)
    }
  }
})

// ✅ 遷移點 5：Event Bus 改用 mitt，實例不再有 $on/$off/$emit
app.config.globalProperties.$bus = EventBus

// ✅ 遷移點 1：new Vue({...}).$mount('#app') 改成 createApp(App).use(...).mount('#app')
app.use(router)
app.use(store)
app.mount('#app')
