<template>
  <div>
    <div class="card">
      <!-- ⚠️ 遷移點：模板中的 filter 管線語法 {{ value | filter }} 在 Vue 3 被移除 -->
      <h2>{{ title | uppercase }}</h2>
      <p>這是一個刻意寫成 Vue 2 舊風格的專案，每個檔案都標了「遷移點」。</p>
      <p>目前時間戳（filter 格式化）：{{ timestamp | currency }}</p>
    </div>

    <div class="card">
      <h3>Event Bus 示範</h3>
      <p>點按鈕會透過 <code>$bus.$emit</code> 廣播事件，下方訊息由 <code>$bus.$on</code> 接收。</p>
      <button @click="ping">發送 ping</button>
      <ul>
        <li v-for="(m, i) in messages" :key="i">{{ m }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      title: 'Vue 2 legacy playground',
      timestamp: 19999,
      messages: []
    }
  },
  // ⚠️ 遷移點：透過 $bus.$on 訂閱事件
  //    Vue 3 實例移除了 $on/$off/$once，需改用 mitt / tiny-emitter 等外部套件
  created() {
    this.$bus.$on('ping', this.onPing)
  },
  // ⚠️ 遷移點：beforeDestroy 在 Vue 3 改名為 beforeUnmount
  beforeDestroy() {
    this.$bus.$off('ping', this.onPing)
  },
  methods: {
    ping() {
      this.$bus.$emit('ping', new Date().toLocaleTimeString())
      this.$log('emit ping') // 來自全域 mixin
    },
    onPing(time) {
      this.messages.push('收到 ping @ ' + time)
    }
  }
}
</script>
