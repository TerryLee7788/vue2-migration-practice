import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import ProductList from '../views/ProductList.vue'
import Cart from '../views/Cart.vue'
import FormDemo from '../views/FormDemo.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/products', name: 'products', component: ProductList },
  { path: '/cart', name: 'cart', component: Cart },
  { path: '/form', name: 'form', component: FormDemo }
]

// ✅ 遷移點 6：Vue Router 4 用 createRouter + createWebHistory() 取代
//    Vue.use(VueRouter) + new VueRouter({ mode: 'history' })
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
