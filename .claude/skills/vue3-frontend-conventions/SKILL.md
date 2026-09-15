---
name: vue3-frontend-conventions
description: 在這個 Vue 2→Vue 3 遷移練習專案（vue3-migration 分支）中新增或修改 Vue 元件、views、router 路由、Vuex store 邏輯時使用這個 skill。它記錄了這個 repo 統一遵守的 Vue 3 寫法慣例（只用 `<script setup>` Composition API、不用 Options API、mitt event bus、filters 改純函式、`defineModel`/`defineProps`/`defineEmits`、`$attrs` + `defineEmits`），確保新程式碼跟現有程式碼風格一致。當使用者要求「新增一個元件」「加一個頁面/路由」「加 Vuex action/getter」「幫這個元件加 v-model」「這段要怎麼寫成 Vue 3」等任務時，即使沒有明講「Vue 3」或「遷移」，也應該觸發這個 skill。
---

# Vue 3 前端撰寫慣例（vue2-migration-practice）

這個專案是刻意寫成「Vue 2 風格」再逐點改寫成 Vue 3 的練習場（`main` = Vue 2 baseline，目前分支
`vue3-migration` = 正在遷移中）。**遷移目標是 Composition API（`<script setup>`）**，不是
Options API。`src/` 底下有些檔案還停留在「Options API 版 Vue 3」這個中繼站，那是還沒轉完的
歷史狀態，不是目標寫法——**任何新增的程式碼都要直接寫成 Composition API**，碰到 Options API
的舊檔案時優先順手轉成 Composition API，而不是延續 Options API 寫法。

## 為什麼要照著這套慣例

這個 repo 的價值在於「同一件事在 Vue 2 / Vue 3 下怎麼寫」的對照練習，而這個練習場的遷移終點
現在訂為 Composition API。如果新程式碼混用不同風格（一半 Options API 一半
`<script setup>`，或又用回 filters），會讓對照失焦，也會讓 `README.md` 的遷移對照表和
`✅ 遷移點 N` 註解失去意義。所以這裡的規則不是「最佳實踐潔癖」，而是維持這個練習場本身的
教學目的。

## 元件寫法

- 一律用 `<script setup>` 的單檔元件（`.vue`）搭配 Composition API（`ref`/`reactive`/
  `computed`/`watch`/`onMounted`/`onBeforeUnmount`…）。
- **不要**新寫 Options API（`export default { data() {...}, methods: {...}, ... }`）。
  舊檔案裡還留著的 Options API 版本，觸碰到時優先轉成 Composition API，除非使用者特別說
  「先不要動這個檔案的寫法」。
- 元件檔案放在 `src/components/`（可重用的小元件），頁面放在 `src/views/`（掛在路由上的頁面）。
- 需要用到跨元件共用的邏輯（例如記錄 log）或掛在 `app.config.globalProperties` 上的東西
  （例如 `$bus`）時，`<script setup>` 裡沒有 `this`：
  - 有對應的原始值可以直接 import 的，優先直接 import（例如 `$bus` 就是
    `src/eventBus.js` 匯出的 `EventBus`，直接 `import { EventBus } from '../eventBus'`）。
  - 純邏輯共用（原本 Vue 2 會用 mixin 做的事），改寫成 `src/composables/` 底下的
    `useXxx()` 函式，各元件自己 `import` 取用（例如 `useLogger()`）。**不要**再用
    `app.mixin(...)` 掛全域方法——composable 是 Composition API 下取代 mixin 的標準做法：
    來源清楚、可以 tree-shake、也不會跟元件自身方法撞名。
- 需要存取 Vuex store／router 時，用 Composition API 提供的 hook，不要用 `this.$store` /
  `this.$route` / `this.$router`：
  ```js
  import { useStore } from 'vuex'
  import { useRoute, useRouter } from 'vue-router'

  const store = useStore()
  const route = useRoute()
  const router = useRouter()
  ```

## 常見情境要怎麼接（附範例檔）

### 新增一個頁面（view）並掛路由
1. 在 `src/views/` 建立 `.vue` 檔，`<script setup>` Composition API 寫法。
2. 到 `src/router/index.js` 補一筆 `{ path, name, component }`，沿用現有 `createRouter({
   history: createWebHistory(), routes })` 的寫法（不要用 `mode: 'history'` 這種 Vue Router 3
   的選項）——router 設定本身跟元件用 Options/Composition API 無關，不用改。

### 多個元件要共用同一段邏輯（原本 Vue 2 會用 mixin 的情境）
不要用 `app.mixin(...)` 或單一元件的 `mixins: [...]` 選項。改成參考
`src/composables/useLogger.js`：寫一個 `useXxx()` 函式，內部要共用的方法/狀態用一般變數或
`ref`/`reactive` 實作，最後 `return { ... }` 把要暴露的東西丟出去。哪個元件要用，就自己在
`<script setup>` 頂層 `import { useXxx } from '../composables/useXxx'` 再呼叫、解構取用
（Options API 元件一樣可以在 `<script>` 模組層級 import 呼叫，不需要 `setup()`）。

### 新增 Vuex state / getter / mutation / action
參考 `src/store/index.js`（`createStore({...})`）：
- Vuex store 的定義本身（`state`/`getters`/`mutations`/`actions`）不是元件，維持現有
  `createStore({...})` 的寫法即可，不需要、也不要為了「Composition API 化」改用 Pinia 或
  `defineStore` —— 這個練習場刻意停在 Vuex 4。
- 需要新增/刪除 state 上動態的 key 時，**直接賦值或 `delete`** 就好，不需要 `Vue.set` /
  `Vue.delete` —— Vue 3 的 Proxy 響應式已經涵蓋這種情況（見該檔第 30、34 行的
  `✅ 遷移點 8` 註解）。
- 元件裡要用這些 state/getters/mutations/actions 時，透過 `useStore()`（見上方「元件寫法」）。

### 元件內要用 filter 顯示格式化文字（金額、日期…）
Vue 3 已經**移除 filters**。不要在 template 裡寫 `{{ value | xxx }}`。改成：
1. 在 `src/utils/format.js` 加一個純函式（參考現有的 `formatCurrency` / `toUppercase`）。
2. 在 `<script setup>` 裡用 `computed(() => formatCurrency(value.value))` 包一層，template
   直接綁這個 computed 結果。

### 元件需要跨元件通訊、但沒有父子關係
用 `src/eventBus.js` 匯出的 `EventBus`（`mitt()` 實例），直接 import 使用：
```js
import { EventBus } from '../eventBus'
import { onBeforeUnmount } from 'vue'

function onPing(time) { /* ... */ }

EventBus.on('ping', onPing)          // 對應 Options API 的 created()：setup 執行時機本身就相當於 created
onBeforeUnmount(() => EventBus.off('ping', onPing))
```
**不要**用 `new Vue()` 當 event bus —— Vue 3 實例已經沒有 `$on`/`$off`/`$emit` 了。

### 元件要支援 `v-model`
不要用 Vue 2 的 `model: { prop, event }` 選項，也不要用 Options API 的
`props: { modelValue }` + `emits: ['update:modelValue']`。優先用 `defineModel()` 巨集
（Vue 3.5 已穩定，這個專案的 Vue 版本支援）：
```js
const modelValue = defineModel({ type: String, default: '' })
// template 裡用 modelValue.value 讀寫，或 <input v-model="modelValue" >
```
如果一個元件要支援多個 `v-model:xxx`，用具名的 `defineModel('xxx')`。參考
`src/components/CustomInput.vue`（目前還是 Options API 版本，轉換時可以當作第一個練習對象）。

### 元件要把未宣告的 attribute／原生事件透傳給內層 DOM
`<script setup>` 裡用 `defineOptions({ inheritAttrs: false })` + `defineEmits(['add'])`
（有宣告在 `defineEmits` 的事件才不會落入 `$attrs`），template 上用 `v-bind="$attrs"`
（`<script setup>` 的 template 可以直接存取 `$attrs`，不用另外從 `useAttrs()` 拿，除非要在
`<script>` 邏輯裡用到才需要 `useAttrs()`）。**不要**再寫 `v-on="$listeners"` —— Vue 3 把
`$listeners` 併入 `$attrs` 了。參考 `src/components/ProductRow.vue`（轉換範例）。

### 具名插槽 / scoped slot
父層用 `v-slot:name="{...}"` 或簡寫 `#name="{...}"`，不要再用 `slot="name"` /
`slot-scope="{...}"`（Vue 2 語法）。子元件的 `<slot name="x" :item="item">` 本身寫法不變，
這一點跟元件用 Options 或 Composition API 無關。參考 `src/components/DataList.vue` 與呼叫它的
`ProductList.vue`。

## `✅ 遷移點 N：...` 註解慣例

這個 repo 用 `✅ 遷移點 N：說明` 這種註解標記「這裡本來是 Vue 2 寫法、改成了 Vue 3 寫法」的
位置，`README.md` 有完整對照表。當你：

- **把一個現有標了 `遷移點` 的 Options API 檔案轉成 Composition API**：保留註解，但把說明文字
  同步改成 Composition API 的對應寫法（例如原本寫「`beforeDestroy` 改名為 `beforeUnmount`」的
  地方，轉成 Composition API 後應改成「`beforeDestroy`/`beforeUnmount` 選項 → `onBeforeUnmount()`
  生命週期 hook」），不要整段刪掉、也不要留著只描述 Options API 寫法的舊文字。
- **新增**一段程式碼剛好示範某個 Vue 2 → Vue 3 (Composition API) 的差異：可以比照既有格式加上
  新的 `✅ 遷移點 N：...` 註解（N 接續現有最大值），並視情況更新 `README.md` 的對照表，讓這個
  新範例也能被找到。
- 純粹新增功能、跟 Vue 2/3 差異無關（例如新增一個沒有特殊 API 差異的一般元件）：不需要硬加
  遷移點註解。

需要盤點目前有哪些遷移點、或哪些檔案還沒從 Options API 轉成 Composition API 時，直接對 `src/`
底下 grep `遷移點` 或 `export default {`，或查
`C:\Users\TerryPC\Desktop\practice\vue2-migration-practice\README.md` 的表格。

## 不要做的事

- 不要新寫 Options API 元件（`export default { data/methods/computed/... }`）——這個練習場的
  遷移終點是 Composition API + `<script setup>`。
- 不要引入 Pinia —— store 維持 Vuex 4（`createStore`），元件端改用 `useStore()` 存取即可，
  不用整個 store 架構都換掉。
- 不要重新加回 Webpack 設定（`webpack.config.js` / `.babelrc`）—— 建置工具已經改成 Vite
  （`vite.config.js`），不要往回改。
- 不要把 `Vue.set` / `Vue.delete`、`Vue.filter`、`this.$on/$off`、`slot-scope`、`.sync`、
  `this.$store`/`this.$route`/`this.$router`（Options API 的存取方式）這些寫法帶進新程式碼裡。
- 不要用 `app.mixin(...)` / `mixins: [...]` 共用跨元件邏輯——改寫成 `src/composables/`
  底下的 `useXxx()` 函式（見 `useLogger.js`）。
