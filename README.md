# Vue 2 → Vue 3 遷移練習場

一個刻意用「Vue 2 舊風格」寫成的小型購物車專案，搭配 **Webpack 5**（手動設定，非 vue-cli），
**沒有 TypeScript**。程式碼裡每個會在 Vue 3 壞掉或需要改寫的地方都標了 `⚠️ 遷移點` 註解，
適合拿來練習 Vue 2 → Vue 3 的 migration 面試題。

## 技術棧
- Vue **2.6.14**（Options API，未用 Composition API）
- Vue Router **3.x**
- Vuex **3.x**
- Webpack 5 + vue-loader 15 + Babel（無 TS）

## 啟動
```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # 打包到 dist/
```

## 頁面與對應練習點
| 路由 | 檔案 | 練習主題 |
| --- | --- | --- |
| `/` | `views/Home.vue` | filters、Event Bus、`beforeDestroy` |
| `/products` | `views/ProductList.vue` | `.sync`、`slot-scope`、具名插槽、`$listeners` |
| `/cart` | `views/Cart.vue` | Vuex 3 getters/actions、filter |
| `/form` | `views/FormDemo.vue` | 自訂 `v-model`（`model` 選項）、`<transition>` class |

## 遷移對照 checklist（練習時逐項改）

| # | Vue 2 寫法 | Vue 3 做法 | 出現位置 |
| --- | --- | --- | --- |
| 1 | `new Vue({...}).$mount('#app')` | `createApp(App).use(...).mount('#app')` | `main.js` |
| 2 | `Vue.filter(...)` + 模板 `{{ x \| f }}` | 移除 filters，改用 computed / method | `main.js`, 各 view |
| 3 | `Vue.directive` 的 `bind/inserted/update` | 改名 `beforeMount/mounted/updated` 等 | `main.js` |
| 4 | `Vue.mixin(...)` 掛全域 | `app.mixin(...)`（或改 composable） | `main.js` |
| 5 | Event Bus：`new Vue()` + `$on/$off/$emit` | 實例不再有 `$on/$off`，改用 `mitt` 等 | `main.js`, `Home.vue` |
| 6 | `Vue.use(Router)` + `new VueRouter({ mode:'history' })` | `createRouter({ history: createWebHistory() })` | `router/index.js` |
| 7 | `Vue.use(Vuex)` + `new Vuex.Store()` | `createStore()`（或改 Pinia） | `store/index.js` |
| 8 | `Vue.set` / `Vue.delete` | Proxy 響應式，直接賦值 / `delete` | `store/index.js` |
| 9 | `.sync` 修飾詞 | `v-model:propName` | `ProductList.vue`, `SearchBox.vue` |
| 10 | `slot="name"` / `slot-scope="{}"` | `v-slot:name="{}"` | `ProductList.vue`, `DataList.vue` |
| 11 | `v-on="$listeners"` / `$listeners` | `$listeners` 併入 `$attrs`，只用 `v-bind="$attrs"` | `ProductRow.vue` |
| 12 | 自訂 v-model 的 `model: { prop, event }` | `modelValue` + `update:modelValue` | `CustomInput.vue`, `FormDemo.vue` |
| 13 | `beforeDestroy` / `destroyed` | `beforeUnmount` / `unmounted` | `Home.vue` |
| 14 | `<transition>` 的 `v-enter` / `v-leave` | `v-enter-from` / `v-leave-from` | `FormDemo.vue` |

> 建議練法：先 `git init` 存一份 baseline，接著開一條分支逐項改成 Vue 3，
> 邊改邊跑 `npm run dev` 對照行為差異。
