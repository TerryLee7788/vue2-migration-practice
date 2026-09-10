<template>
  <div>
    <div class="card">
      <h2>商品列表</h2>

      <!-- ⚠️ 遷移點：.sync 修飾詞在 Vue 3 移除，改用 v-model:keyword -->
      <SearchBox :keyword.sync="keyword" placeholder="搜尋商品..." />

      <!-- ⚠️ 遷移點：舊版具名 / 作用域插槽語法 slot-scope + slot="..."
           Vue 3 統一改成 v-slot:name="{ ... }" -->
      <DataList :items="filteredProducts">
        <template slot="empty">
          <p>找不到符合「{{ keyword }}」的商品。</p>
        </template>

        <template slot-scope="{ item }">
          <div class="product-row">
            <span>{{ item.name }}</span>
            <!-- filter 管線再次出現 -->
            <span class="price">{{ item.price | currency }}</span>
            <!-- ⚠️ 遷移點：子元件對外事件；ProductRow 內部用 $listeners 透傳 -->
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

export default {
  name: 'ProductList',
  components: { SearchBox, DataList, ProductRow },
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    // ⚠️ 遷移點：this.$store 仍可用，但 store 本身要從 vuex3 換成 vuex4/pinia
    filteredProducts() {
      const kw = this.keyword.trim().toLowerCase()
      return this.$store.state.products.filter(p =>
        p.name.toLowerCase().includes(kw)
      )
    }
  },
  methods: {
    ...mapActions(['addToCart'])
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
