<template>
  <div class="edit">
    <div class="breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/product' }">商品</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.params.recycle===3" :to="{ name: 'RecycleProduct' }">回收站</el-breadcrumb-item>
        <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <product-form :mode="0" :editId="parseInt($route.params.id)"></product-form>
    </div>
  </div>
</template>

<script>
  import ProductForm from './Form.vue'

  export default {
    name: 'EditProduct',
    components: {
      ProductForm
    }
  }
</script>

<style lang="less" scoped>

</style>
