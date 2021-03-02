<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/service' }">售后模板</el-breadcrumb-item>
      <el-breadcrumb-item>添加售后模板</el-breadcrumb-item>
    </el-breadcrumb>
    <service-form></service-form>
  </div>
</template>

<script>

  import ServiceForm from './Form'

  export default {
    name: 'CreateService',
    components: {
      ServiceForm
    }
  }
</script>

<style lang="less" scoped>

  .action {
    margin-top: 30px;
  }

</style>
