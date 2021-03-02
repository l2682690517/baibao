<template>
  <div class="edit">
    <div class="breadcrumb">
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ name: 'Discount' }">折扣</el-breadcrumb-item>
        <el-breadcrumb-item>编辑折扣</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <discount-form :mode="0" :editId="parseInt($route.params.id)"></discount-form>
    </div>
  </div>
</template>

<script>
  import DiscountForm from './Form.vue'

  export default {
    name: 'EditDiscount',
    components: {
      DiscountForm
    }
  }
</script>

<style lang="less" scoped>

</style>
