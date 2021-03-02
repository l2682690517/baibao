<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ name: 'custompage' }">自定义首页</el-breadcrumb-item>
      <el-breadcrumb-item>创建模块</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <module-form :mode="0"></module-form>
    </div>
  </div>
</template>

<script>
  import ModuleForm from './Form'

  export default{
    name: 'CreateCustomPage',
    components: {
      ModuleForm
    }
  }

</script>

<style lang="scss" scoped>

</style>
