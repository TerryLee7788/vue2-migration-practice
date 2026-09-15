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

    <!-- ✅ EventBus 真正的用途示範：ProductList 加入購物車（透過 store action）時 emit，
         App 這個跟它沒有父子關係的元件監聽並顯示 toast。堆疊 + 滑入滑出的視覺邏輯抽成
         共用的 StackedToast（DRY：跟 Home.vue 的 ping 推播共用同一套動畫實作） -->
    <StackedToast :items="toasts" position="bottom" />
  </div>
</template>

<script setup>
import { computed, ref, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { EventBus } from './eventBus'
import StackedToast from './components/StackedToast.vue'

// ✅ 遷移點 7：mapGetters（Options API）改成 useStore() + computed（Composition API）
const store = useStore()
const cartCount = computed(() => store.getters.cartCount)

// 用陣列（而不是單一字串）存目前顯示中的 toast，讓連續觸發時是「疊加一則新的」，
// 每則各自用自己的 timer 到期移除，不會互相打斷
const toasts = ref([])
let toastSeq = 0

function onCartAdd(productName) {
  const id = ++toastSeq
  toasts.value.push({ id, text: `已加入購物車：${productName}` })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 2000)
}

EventBus.on('cart:add', onCartAdd)

onBeforeUnmount(() => {
  EventBus.off('cart:add', onCartAdd)
})
</script>
