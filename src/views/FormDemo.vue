<template>
  <div class="card">
    <h2>表單 / 自訂 v-model 示範</h2>

    <!-- ⚠️ 遷移點：對自訂元件用 v-model，靠子元件的 model 選項 (checked/change)
         Vue 3 要改成 modelValue / update:modelValue -->
    <CustomInput v-model="name" label="姓名" />
    <CustomInput v-model="email" label="Email" />

    <p>即時預覽：<strong>{{ name | uppercase }}</strong> &lt;{{ email }}&gt;</p>

    <button @click="submit">送出</button>

    <!-- ⚠️ 遷移點：<transition> 在 Vue 3 仍在，但 class 名稱 v-enter → v-enter-from -->
    <transition name="fade">
      <p v-if="submitted" class="ok">已送出（僅前端示範）</p>
    </transition>
  </div>
</template>

<script>
import CustomInput from '../components/CustomInput.vue'

export default {
  name: 'FormDemo',
  components: { CustomInput },
  data() {
    return {
      name: '',
      email: '',
      submitted: false
    }
  },
  methods: {
    submit() {
      this.submitted = true
      this.$log('form submitted: ' + this.name)
    }
  }
}
</script>

<style scoped>
.ok {
  color: #42b983;
  font-weight: 700;
}
/* ⚠️ 遷移點：v-enter / v-leave-to 的 v-enter 在 Vue 3 改名為 v-enter-from */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
