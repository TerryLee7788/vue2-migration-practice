<template>
  <div class="card">
    <h2 class="mb-3 text-lg font-semibold">表單 / 自訂 v-model 示範</h2>

    <Form class="space-y-1" @submit="submit">
      <!-- ✅ 遷移點 12：CustomInput 已改用 modelValue/update:modelValue，
           父層 v-model 寫法本身不變 -->
      <Field name="name" :rules="requiredRule" v-model="name" v-slot="{ errorMessage }">
        <CustomInput v-model="name" label="姓名" />
        <p v-if="errorMessage" class="-mt-2 mb-3 text-sm text-red-500">{{ errorMessage }}</p>
      </Field>

      <Field name="email" :rules="emailRule" v-model="email" v-slot="{ errorMessage }">
        <CustomInput v-model="email" label="Email" />
        <p v-if="errorMessage" class="-mt-2 mb-3 text-sm text-red-500">{{ errorMessage }}</p>
      </Field>

      <p class="mb-3">即時預覽：<strong>{{ upperName }}</strong> &lt;{{ email }}&gt;</p>

      <button type="submit" class="btn">送出</button>
    </Form>

    <!-- ✅ 遷移點 14：<transition> 仍在，class 名稱已改用 v-enter-from -->
    <transition name="fade">
      <p v-if="submitted" class="ok mt-3">已送出（僅前端示範）</p>
    </transition>
  </div>
</template>

<script>
// ✅ 新增：表單驗證改用 vee-validate 的 <Form>/<Field> 元件。
//    這兩個元件可以直接在 template 用、規則用一般函式傳入，
//    不需要 setup() 或 useForm/useField，跟這個專案「只用 Options API」的慣例相容。
//    姓名/Email 同時 v-model 在 <Field> 和 CustomInput 上、綁同一個 data 屬性，
//    讓 Field 能追蹤到 CustomInput（透過 modelValue/update:modelValue）產生的變化並觸發驗證，
//    同時保留原本 CustomInput 的自訂 v-model 遷移示範不必更動。
import { Form, Field } from 'vee-validate'
import CustomInput from '../components/CustomInput.vue'
import { toUppercase } from '../utils/format'

function requiredRule(value) {
  return (value && String(value).trim().length > 0) || '此欄位為必填'
}

function emailRule(value) {
  if (!value || !String(value).trim()) return 'Email 為必填'
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(value) || 'Email 格式不正確'
}

export default {
  name: 'FormDemo',
  components: { Form, Field, CustomInput },
  data() {
    return {
      name: '',
      email: '',
      submitted: false,
      requiredRule,
      emailRule
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
