<template>
  <div>
    <div class="card">
      <h2>商品列表</h2>

      <!-- ✅ 遷移點 9：.sync 修飾詞改成 v-model:keyword -->
      <SearchBox v-model:keyword="keyword" placeholder="搜尋商品..." />

      <!-- ✅ 遷移點 10：具名 / 作用域插槽統一改成 v-slot -->
      <DataList :items="filteredProducts">
        <template v-slot:empty>
          <p>找不到符合「{{ keyword }}」的商品。</p>
        </template>

        <template v-slot:default="{ item }">
          <div class="product-row">
            <span>{{ item.name }}</span>
            <span class="price">{{ formatCurrency(item.price) }}</span>
            <!-- ✅ 遷移點 11：$listeners 已併入 $attrs，ProductRow 內部只需 v-bind="$attrs" -->
            <ProductRow :product="item" @add="addToCart(item.id)" />
          </div>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import SearchBox from '../components/SearchBox.vue'
import DataList from '../components/DataList.vue'
import ProductRow from '../components/ProductRow.vue'
import { formatCurrency } from '../utils/format'

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
</script>

<style scoped>
.product-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #eef0f4;
}
.price {
  color: #42b983;
  font-weight: 700;
}
</style>
