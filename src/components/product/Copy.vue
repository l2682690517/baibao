<template>
  <div class="copy">
    <div class="breadcrumb">
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/product' }">商品</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <product-form :mode="2" :editId="parseInt($route.params.id)"></product-form>
    </div>
  </div>
</template>

<script>
  import ProductForm from './Form.vue'

  export default {
    name: 'CopyProduct',
    components: {
      ProductForm
    }
  }
</script>

<style lang="less" scoped>

</style>
