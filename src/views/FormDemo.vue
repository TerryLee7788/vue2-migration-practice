<template>
  <div class="card">
    <h2>表單 / 自訂 v-model 示範</h2>

    <!-- ✅ 遷移點 12：CustomInput 已改用 modelValue/update:modelValue，
         父層 v-model 寫法本身不變 -->
    <CustomInput v-model="name" label="姓名" />
    <CustomInput v-model="email" label="Email" />

    <p>即時預覽：<strong>{{ upperName }}</strong> &lt;{{ email }}&gt;</p>

    <button @click="submit">送出</button>

    <!-- ✅ 遷移點 14：<transition> 仍在，class 名稱已改用 v-enter-from -->
    <transition name="fade">
      <p v-if="submitted" class="ok">已送出（僅前端示範）</p>
    </transition>
  </div>
</template>

<script>
import CustomInput from '../components/CustomInput.vue'
import { toUppercase } from '../utils/format'

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
  computed: {
    upperName() {
      return toUppercase(this.name)
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
/* ✅ 遷移點 14：v-enter 改名為 v-enter-from，v-leave-to 名稱不變 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
