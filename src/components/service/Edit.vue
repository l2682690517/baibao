<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/service' }">售后模板</el-breadcrumb-item>
      <el-breadcrumb-item>编辑售后模板</el-breadcrumb-item>
    </el-breadcrumb>
    <service-form :mode="0"></service-form>
  </div>
</template>

<script>
  import ServiceForm from './Form'

  export default {
    name: 'EditService',
    components: {
      ServiceForm
    }
  }
</script>

<style lang="less" scoped>
</style>
