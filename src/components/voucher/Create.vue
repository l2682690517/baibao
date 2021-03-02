<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ name: 'Voucher' }">优惠券</el-breadcrumb-item>
      <el-breadcrumb-item>创建优惠券</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="warn-text">优惠券提交后，仅能修改名称和有限的添加商品，请谨慎操作!</div>
    <voucher-form></voucher-form>
  </div>
</template>

<script>
  import VoucherForm from './Form'

  export default{
    name: 'CreateVoucher',
    components: {
      VoucherForm
    }
  }
</script>

<style lang="scss" scoped>

  .warn-text {
    color: #ff4949;
    font-size: 14px;
    margin-bottom: 10px;
  }


</style>
