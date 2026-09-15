<template>
  <div>
    <div class="card">
      <!-- ✅ 遷移點 2：filter 管線語法改成 computed -->
      <h2 class="mb-2 text-lg font-semibold">{{ upperTitle }}</h2>
      <p class="mb-1">這是一個刻意寫成 Vue 2 舊風格的專案，每個檔案都標了「遷移點」。</p>
      <p>目前時間戳（filter 格式化）：{{ formattedTimestamp }}</p>
    </div>

    <div class="card">
      <h3 class="mb-2 text-base font-semibold">Event Bus 示範</h3>
      <p class="mb-3">點按鈕會透過 <code>$bus.emit</code> 廣播事件，訊息會從畫面正上方推播下來，
        <code>$bus.on</code> 接收後可以連續疊加多則。</p>
      <button class="btn" @click="ping">發送 ping</button>
    </div>

    <!-- 從畫面正上方往下推播、可堆疊的訊息（同一元件內 emit/on，純粹練習 Event Bus 用法）。
         堆疊 + 滑入滑出的視覺邏輯抽成共用的 StackedToast（DRY：跟 App.vue 的購物車 toast
         共用同一套動畫實作，這裡只是換成 position="top"） -->
    <StackedToast :items="messages" position="top" />
  </div>
</template>

<script setup>
// ⚠️ Composition API 版本
import { ref, computed, onBeforeUnmount } from 'vue'
import { formatCurrency, toUppercase } from '../utils/format'
import { EventBus } from '../eventBus'
import { useLogger } from '../composables/useLogger'
import StackedToast from '../components/StackedToast.vue'

// $bus 本身就是 main.js 掛在 globalProperties 上的同一個 mitt 實例，setup 裡可以直接 import 用
// $log（遷移點 4）已經從全域 mixin 改寫成 composable，直接 import useLogger() 取用即可
const { log } = useLogger()

const title = ref('Vue 2 legacy playground')
const timestamp = ref(19999)

// 用陣列（而不是單一字串）存目前顯示中的訊息，讓連續 ping 時是疊加一則新的，
// 各自用自己的 timer 到期後移除，不會互相打斷——寫法跟 App.vue 的 cart toast 堆疊一致
const messages = ref([])
let messageSeq = 0

const upperTitle = computed(() => toUppercase(title.value))
const formattedTimestamp = computed(() => formatCurrency(timestamp.value))

function onPing(time) {
  const id = ++messageSeq
  // unshift 讓最新的訊息出現在最上面，舊訊息被往下推，呼應「從上往下」的堆疊效果
  messages.value.unshift({ id, text: '收到 ping @ ' + time })
  setTimeout(() => {
    messages.value = messages.value.filter(m => m.id !== id)
  }, 2500)
}

function ping() {
  EventBus.emit('ping', new Date().toLocaleTimeString())
  log('emit ping') // 來自 useLogger composable（遷移點 4）
}

// setup() 執行的時機對應 Options API 的 created()，所以這裡直接註冊即可，不需要 onMounted
EventBus.on('ping', onPing)

// beforeUnmount 選項的 Composition API 對應寫法
onBeforeUnmount(() => {
  EventBus.off('ping', onPing)
})

/* ---- 下面是這個 repo 官方遷移範圍（Options API 版）對照，保留來比較兩種寫法 ----

export default {
  name: 'Home',
  data() {
    return {
      title: 'Vue 2 legacy playground',
      timestamp: 19999,
      messages: []
    }
  },
  computed: {
    upperTitle() {
      return toUppercase(this.title)
    },
    formattedTimestamp() {
      return formatCurrency(this.timestamp)
    }
  },
  // ✅ 遷移點 5：改用 mitt 的 on/off，事件匯流排不再靠空的 Vue 實例
  created() {
    this.$bus.on('ping', this.onPing)
  },
  // ✅ 遷移點 13：beforeDestroy 改名為 beforeUnmount
  beforeUnmount() {
    this.$bus.off('ping', this.onPing)
  },
  methods: {
    ping() {
      this.$bus.emit('ping', new Date().toLocaleTimeString())
      this.$log('emit ping') // 來自全域 mixin（已改寫成 composable，見上方 Composition API 版本）
    },
    onPing(time) {
      this.messages.push('收到 ping @ ' + time)
    }
  }
}
*/
</script>
