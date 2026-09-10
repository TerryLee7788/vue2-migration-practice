<template>
  <div id="app">
    <header class="topbar">
      <h1>Vue 2 → Vue 3 遷移練習場</h1>
      <nav>
        <router-link to="/">首頁</router-link>
        <router-link to="/products">商品</router-link>
        <router-link to="/cart">購物車 ({{ cartCount }})</router-link>
        <router-link to="/form">表單</router-link>
      </nav>
    </header>

    <main class="content">
      <router-view />
    </main>

    <footer class="footer">
      <small>每個元件的註解都標了「遷移點」，練習時可以逐一改成 Vue 3 寫法。</small>
    </footer>
  </div>
</template>

<script>
// ⚠️ 遷移點：mapGetters 來自 vuex 3，Vue 3 要換成 vuex 4 (createStore) 或 Pinia
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters(['cartCount'])
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, 'Segoe UI', system-ui, sans-serif;
  color: #2c3e50;
  background: #f5f6f8;
}
.topbar {
  background: #35495e;
  color: #fff;
  padding: 16px 24px;
}
.topbar h1 {
  margin: 0 0 12px;
  font-size: 20px;
}
.topbar nav a {
  color: #b0c4de;
  margin-right: 16px;
  text-decoration: none;
  font-weight: 600;
}
.topbar nav a.router-link-exact-active {
  color: #42b983;
}
.content {
  max-width: 860px;
  margin: 24px auto;
  padding: 0 16px;
}
.footer {
  text-align: center;
  color: #8a94a6;
  padding: 24px;
}
.card {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
}
button {
  cursor: pointer;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  background: #42b983;
  color: #fff;
  font-weight: 600;
}
button.ghost {
  background: #e5e9f0;
  color: #35495e;
}
</style>
