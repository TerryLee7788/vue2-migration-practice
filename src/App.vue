<template>
  <div id="app" class="min-h-screen bg-[#f5f6f8] font-sans text-[#2c3e50]">
    <header class="bg-[#35495e] px-6 py-4 text-white">
      <h1 class="mb-3 text-xl">Vue 2 → Vue 3 遷移練習場</h1>
      <nav>
        <router-link to="/" class="nav-link" exact-active-class="text-[#42b983]">首頁</router-link>
        <router-link to="/products" class="nav-link" exact-active-class="text-[#42b983]">商品</router-link>
        <router-link to="/cart" class="nav-link" exact-active-class="text-[#42b983]">購物車 ({{ cartCount }})</router-link>
        <router-link to="/form" class="nav-link" exact-active-class="text-[#42b983]">表單</router-link>
      </nav>
    </header>

    <main class="mx-auto max-w-215 px-4 py-6">
      <router-view />
    </main>

    <footer class="p-6 text-center text-[#8a94a6]">
      <small>每個元件的註解都標了「遷移點」，練習時可以逐一改成 Vue 3 寫法。</small>
    </footer>
  </div>
</template>

<script>
// ✅ 遷移點 7：mapGetters 用法不變，store 已改用 vuex 4 的 createStore
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters(['cartCount'])
  }
}
</script>
