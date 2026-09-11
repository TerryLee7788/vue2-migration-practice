---
name: vue3-frontend-conventions
description: 在這個 Vue 2→Vue 3 遷移練習專案（vue3-migration 分支）中新增或修改 Vue 元件、views、router 路由、Vuex store 邏輯時使用這個 skill。它記錄了這個 repo 統一遵守的 Vue 3 寫法慣例（只用 Options API、不用 <script setup> / Composition API、mitt event bus、filters 改純函式、自訂 v-model、$attrs/$listeners + emits），確保新程式碼跟現有程式碼風格一致。當使用者要求「新增一個元件」「加一個頁面/路由」「加 Vuex action/getter」「幫這個元件加 v-model」「這段要怎麼寫成 Vue 3」等任務時，即使沒有明講「Vue 3」或「遷移」，也應該觸發這個 skill。
---

# Vue 3 前端撰寫慣例（vue2-migration-practice）

這個專案是刻意寫成「Vue 2 風格」再逐點改寫成 Vue 3 的練習場（`main` = Vue 2 baseline，目前分支
`vue3-migration` = 已完成遷移）。**任何新增的程式碼都要延續已遷移完成的 Vue 3 寫法**，不要退回
Vue 2 語法，也不要跳過頭直接上 Composition API（見下方「不要做的事」）。

## 為什麼要照著這套慣例

這個 repo 的價值在於「同一件事在 Vue 2 / Vue 3 下怎麼寫」的對照練習。如果新程式碼混用不同風格
（例如一半 Options API 一半 `<script setup>`，或又用回 filters），會讓對照失焦，也會讓
`README.md` 的遷移對照表和 `✅ 遷移點 N` 註解失去意義。所以這裡的規則不是「最佳實踐潔癖」，
而是維持這個練習場本身的教學目的。

## 元件寫法

- 一律用 Options API 的單檔元件（`.vue`，`<script>` 內 `export default { ... }`）。
- **不要**改用 `<script setup>` 或 Composition API（`ref`/`reactive`/`setup()`）。這個練習場的
  遷移範圍就是「Vue 2 Options API → Vue 3 Options API」，不是再往 Composition API 遷移一次。
- 元件檔案放在 `src/components/`（可重用的小元件），頁面放在 `src/views/`（掛在路由上的頁面）。

## 常見情境要怎麼接（附範例檔）

### 新增一個頁面（view）並掛路由
1. 在 `src/views/` 建立 `.vue` 檔，Options API 寫法。
2. 到 `src/router/index.js` 補一筆 `{ path, name, component }`，沿用現有 `createRouter({
   history: createWebHistory(), routes })` 的寫法（不要用 `mode: 'history'` 這種 Vue Router 3
   的選項）。

### 新增 Vuex state / getter / mutation / action
參考 `src/store/index.js`（`createStore({...})`）：
- 需要新增/刪除 state 上動態的 key 時，**直接賦值或 `delete`** 就好，不需要 `Vue.set` /
  `Vue.delete` —— Vue 3 的 Proxy 響應式已經涵蓋這種情況（見該檔第 30、34 行的
  `✅ 遷移點 8` 註解）。

### 元件內要用 filter 顯示格式化文字（金額、日期…）
Vue 3 已經**移除 filters**。不要在 template 裡寫 `{{ value | xxx }}`。改成：
1. 在 `src/utils/format.js` 加一個純函式（參考現有的 `formatCurrency` / `toUppercase`）。
2. 在元件的 `computed` 或 `methods` 裡呼叫它，template 直接綁 computed/method 結果。

### 元件需要跨元件通訊、但沒有父子關係
用 `src/eventBus.js` 匯出的 `EventBus`（`mitt()` 實例），呼叫 `EventBus.emit(...)` /
`EventBus.on(...)` / `EventBus.off(...)`。**不要**用 `new Vue()` 當 event bus —— Vue 3 實例
已經沒有 `$on`/`$off`/`$emit` 了。全域也可以透過 `this.$bus`（見 `main.js` 掛在
`app.config.globalProperties.$bus` 上）存取同一個實例。

### 元件要支援 `v-model`
不要用 Vue 2 的 `model: { prop, event }` 選項。改成參考 `src/components/CustomInput.vue`：
```js
props: {
  modelValue: { type: String, default: '' }
},
emits: ['update:modelValue']
```
並在 template 觸發時 `$emit('update:modelValue', newValue)`。如果一個元件要支援多個
`v-model:xxx`，對應的 prop 叫 `xxx`、事件叫 `update:xxx`（例如 `.sync` 修飾詞的替代方案）。

### 元件要把未宣告的 attribute／原生事件透傳給內層 DOM
參考 `src/components/ProductRow.vue`：
```js
inheritAttrs: false,
emits: ['add']   // 有宣告在 emits 的事件才不會落入 $attrs
```
template 上用 `v-bind="$attrs"`（**不要**再寫 `v-on="$listeners"` —— Vue 3 把 `$listeners`
併入 `$attrs` 了，`v-bind="$attrs"` 已經包含事件監聽）。

### 具名插槽 / scoped slot
父層用 `v-slot:name="{...}"` 或簡寫 `#name="{...}"`，不要再用 `slot="name"` /
`slot-scope="{...}"`（Vue 2 語法）。子元件的 `<slot name="x" :item="item">` 本身寫法不變，
差異只在父層消費插槽的語法。參考 `src/components/DataList.vue` 與呼叫它的
`ProductList.vue`。

## `✅ 遷移點 N：...` 註解慣例

這個 repo 用 `✅ 遷移點 N：說明` 這種註解標記「這裡本來是 Vue 2 寫法、改成了 Vue 3 寫法」的
位置，`README.md` 有完整對照表（目前到第 14 點）。當你：

- **修改**現有標了 `遷移點` 的程式碼：保留註解，如果寫法有變就同步更新文字，不要整段刪掉。
- **新增**一段程式碼剛好示範某個 Vue 2 → Vue 3 的差異（例如又寫了一個自訂 v-model 元件）：
  可以比照既有格式加上新的 `✅ 遷移點 N：...` 註解（N 接續現有最大值），並視情況更新
  `README.md` 的對照表，讓這個新範例也能被找到。
- 純粹新增功能、跟 Vue 2/3 差異無關（例如新增一個沒有特殊 API 差異的一般元件）：不需要硬加
  遷移點註解。

需要盤點目前有哪些遷移點時，直接對 `src/` 底下 grep `遷移點` 即可，或查
`C:\Users\TerryPC\Desktop\practice\vue2-migration-practice\README.md` 的表格。

## 不要做的事

- 不要引入 `<script setup>`、Composition API、Pinia —— 這個練習場刻意停在 Options API +
  Vuex 4，跟 `main` 分支的 Vue 2 Options API 對照。
- 不要重新加回 Webpack 設定（`webpack.config.js` / `.babelrc`）—— 建置工具已經改成 Vite
  （`vite.config.js`），不要往回改。
- 不要把 `Vue.set` / `Vue.delete`、`Vue.filter`、`this.$on/$off`、`slot-scope`、`.sync` 這些
  Vue 2 專屬寫法帶進新程式碼裡。
