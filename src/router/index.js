import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import ProductList from '../views/ProductList.vue'
import Cart from '../views/Cart.vue'
import FormDemo from '../views/FormDemo.vue'

// ⚠️ 遷移點：Vue Router 3 需要 Vue.use(VueRouter)
//    Vue 3 + Router 4 改成 createRouter({ history: createWebHistory() })
Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/products', name: 'products', component: ProductList },
  { path: '/cart', name: 'cart', component: Cart },
  { path: '/form', name: 'form', component: FormDemo }
]

// ⚠️ 遷移點：mode: 'history' 在 Router 4 換成 history: createWebHistory()
const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
