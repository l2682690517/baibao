<template>
  <div class="create">
    <div class="breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/product' }">商品</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <product-form :mode="1"></product-form>
    </div>
  </div>
</template>

<script>
  import ProductForm from './Form.vue'

  export default {
    name: 'CreateProduct',
    components: {
      ProductForm
    }
  }
</script>

<style lang="less" scoped>

</style>
