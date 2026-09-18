# Vue 2 → Vue 3 遷移練習場

一個原本用「Vue 2 舊風格」寫成的小型購物車專案，這個分支（`vue3-migration`）
已經逐項改寫成 **Vue 3**，並把建置工具從 Webpack 5 換成 **Vite**。
`main` 分支保留原始 Vue 2 + Webpack baseline，方便對照練習。

## 技術棧
- Vue **3.5.x**（遷移目標為 Composition API `<script setup>`；部分檔案仍是過渡期的 Options API
  版本，尚待轉換）
- Vue Router **4.x**
- Vuex **4.x**
- Vite 8 + @vitejs/plugin-vue（無 TS）
- mitt（取代 Vue 2 的空 Vue 實例 Event Bus）
- Tailwind CSS 4（`@tailwindcss/vite`，樣式集中在 `src/style.css`，重複的視覺樣式
  用 `@layer components` 收斂成 `.card` / `.btn` / `.btn-ghost` / `.field-input` / `.nav-link`）
- vee-validate（`FormDemo.vue` 的表單驗證，用 `<Form>`/`<Field>` 元件 + 一般驗證函式，
  Options API、Composition API 下都能用）

## 啟動
```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # 打包到 dist/
```

## AI 開發同事（自動遷移工具，練習用、尚未實際驗證）
`scripts/ai-colleague/migrate-component.js` 是一個會呼叫 Claude API、動手改程式碼的小工具，
不是網頁上的聊天機器人——它會讀取 `CLAUDE.md` 跟 `.claude/skills/vue3-frontend-conventions/SKILL.md`
的內容當作規則，把指定的 Options API 元件改寫成 Composition API `<script setup>`。
**這支腳本本身尚未實際帶 API key 跑過**，行為未經驗證。

```bash
# 先設定 API 金鑰（擇一）：
export ANTHROPIC_API_KEY=sk-ant-...           # 直接匯出環境變數
echo 'ANTHROPIC_API_KEY=sk-ant-...' > .env.local   # 或建立 .env.local（已加進 .gitignore，指令會自動載入）

# 預覽改寫結果（只印出 diff，不動檔案）
npm run ai:migrate -- src/views/ProductList/components/ProductRow.vue

# 確認沒問題後才真的寫回檔案
npm run ai:migrate -- src/views/ProductList/components/ProductRow.vue --apply
```

## 頁面與對應練習點
| 路由 | 檔案 | 練習主題 |
| --- | --- | --- |
| `/` | `views/Home.vue` | filters、Event Bus、`beforeDestroy` |
| `/products` | `views/ProductList/ProductList.vue` | `.sync`、`slot-scope`、具名插槽、`$listeners` |
| `/cart` | `views/Cart.vue` | Vuex getters/actions、filter |
| `/form` | `views/FormDemo/FormDemo.vue` | 自訂 `v-model`（`model` 選項）、`<transition>` class |
| `/quote` | `views/Quote/Quote.vue` | 多步驟表單跨元件共享狀態（Vuex）、v-if 切換元件卸載重掛時的資料保留 |

## 遷移對照 checklist（已全部完成）

| # | Vue 2 寫法 | Vue 3 做法 | 出現位置 |
| --- | --- | --- | --- |
| 1 | `new Vue({...}).$mount('#app')` | `createApp(App).use(...).mount('#app')` | `main.js` |
| 2 | `Vue.filter(...)` + 模板 `{{ x \| f }}` | 移除 filters，改用 `utils/format.js` + computed / method | `main.js`, 各 view |
| 3 | `Vue.directive` 的 `bind/inserted/update` | 改名 `beforeMount/mounted/updated` 等 | `main.js` |
| 4 | `Vue.mixin(...)` 掛全域 | 先過渡成 `app.mixin(...)`，再進一步改寫成 composable（`useLogger()`） | `main.js`, `composables/useLogger.js` |
| 5 | Event Bus：`new Vue()` + `$on/$off/$emit` | 改用 `mitt`（`src/eventBus.js`） | `main.js`, `Home.vue` |
| 6 | `Vue.use(Router)` + `new VueRouter({ mode:'history' })` | `createRouter({ history: createWebHistory() })` | `router/index.js` |
| 7 | `Vue.use(Vuex)` + `new Vuex.Store()` | `createStore()` | `store/index.js` |
| 8 | `Vue.set` / `Vue.delete` | Proxy 響應式，直接賦值 / `delete` | `store/index.js` |
| 9 | `.sync` 修飾詞 | `v-model:propName` | `ProductList.vue`, `SearchBox.vue` |
| 10 | `slot="name"` / `slot-scope="{}"` | `v-slot:name="{}"` | `ProductList.vue`, `DataList.vue` |
| 11 | `v-on="$listeners"` / `$listeners` | `$listeners` 併入 `$attrs`，只用 `v-bind="$attrs"` + `emits` | `ProductRow.vue` |
| 12 | 自訂 v-model 的 `model: { prop, event }` | `defineModel()` 巨集（取代手動宣告 `modelValue` + `update:modelValue`） | `CustomInput.vue`, `FormDemo.vue` |
| 13 | `beforeDestroy` / `destroyed` | `beforeUnmount` / `unmounted` | `Home.vue` |
| 14 | `<transition>` 的 `v-enter` / `v-leave` | `v-enter-from` / `v-leave-from` | `FormDemo.vue` |

## 建置工具遷移（Webpack → Vite）
- `webpack.config.js` / `.babelrc` 移除，改用 `vite.config.js`（`@vitejs/plugin-vue`）
- `public/index.html` 移到專案根目錄 `index.html`，並加上 `<script type="module" src="/src/main.js">`
- `npm run dev` / `npm run build` 改呼叫 `vite` / `vite build`
