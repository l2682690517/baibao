<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ name: 'Voucher' }">优惠券</el-breadcrumb-item>
      <el-breadcrumb-item>编辑优惠券</el-breadcrumb-item>
    </el-breadcrumb>
    <voucher-form :mode="formMode"></voucher-form>
  </div>
</template>

<script>
  import VoucherForm from './Form'

  export default{
    name: 'EditVoucher',
    components: {
      VoucherForm
    },
    computed: {
      formMode() {
        return VoucherForm.MODE_EDIT
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
