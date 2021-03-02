<template>
  <div class="create">
    <div class="breadcrumb">
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ name: 'Discount' }">折扣</el-breadcrumb-item>
        <el-breadcrumb-item>添加折扣</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <discount-form :mode="1"></discount-form>
    </div>
  </div>
</template>

<script>
  import DiscountForm from './Form.vue'

  export default {
    name: 'CreateDiscount',
    components: {
      DiscountForm
    }
  }
</script>

<style lang="less" scoped>

</style>
