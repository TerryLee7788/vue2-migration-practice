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
      <p class="mb-3">點按鈕會透過 <code>$bus.emit</code> 廣播事件，下方訊息由 <code>$bus.on</code> 接收。</p>
      <button class="btn" @click="ping">發送 ping</button>
      <ul class="mt-3 list-none p-0">
        <li v-for="(m, i) in messages" :key="i" class="py-1 text-sm text-[#5b6472]">{{ m }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { formatCurrency, toUppercase } from '../utils/format'

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
      this.$log('emit ping') // 來自全域 mixin
    },
    onPing(time) {
      this.messages.push('收到 ping @ ' + time)
    }
  }
}
</script>
