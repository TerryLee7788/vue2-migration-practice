<template>
  <div>
    <div class="card">
      <h2 class="mb-3 text-lg font-semibold">商品列表</h2>

      <!-- ✅ 遷移點 9：.sync 修飾詞改成 v-model:keyword -->
      <SearchBox v-model:keyword="keyword" placeholder="搜尋商品..." />

      <!-- ✅ 遷移點 10：具名 / 作用域插槽統一改成 v-slot -->
      <DataList :items="filteredProducts">
        <template v-slot:empty>
          <p class="text-subtle">找不到符合「{{ keyword }}」的商品。</p>
        </template>

        <template v-slot:default="{ item }">
          <div class="grid items-center grid-cols-[1fr_1fr_auto] gap-3 border-b border-border py-2.5">
            <span>{{ item.name }}</span>
            <span class="font-bold text-brand">{{ formatCurrency(item.price) }}</span>
            <!-- ✅ 遷移點 11：$listeners 已併入 $attrs，ProductRow 內部只需 v-bind="$attrs" -->
            <ProductRow :product="item" @add="addToCart(item.id)" />
          </div>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import SearchBox from './components/SearchBox.vue'
import DataList from './components/DataList.vue'
import ProductRow from './components/ProductRow.vue'
import { formatCurrency } from '@/utils/format'

// ✅ 遷移點 7：mapActions（Options API）改成 useStore() + store.dispatch（Composition API）
const store = useStore()

const keyword = ref('')
const filteredProducts = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return store.state.products.filter(p =>
    p.name.toLowerCase().includes(kw)
  )
})

function addToCart(productId) {
  store.dispatch('addToCart', productId)
}

/*
export default {
  name: 'ProductList',
  components: { SearchBox, DataList, ProductRow },
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    filteredProducts() {
      const kw = this.keyword.trim().toLowerCase()
      return this.$store.state.products.filter(p =>
        p.name.toLowerCase().includes(kw)
      )
    }
  },
  methods: {
    ...mapActions(['addToCart']),
    formatCurrency
  }
}
*/
</script>
