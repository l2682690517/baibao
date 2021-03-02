<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ name: 'custompage' }">自定义首页</el-breadcrumb-item>
      <el-breadcrumb-item>编辑模块</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <module-form :mode="1"></module-form>
    </div>
  </div>
</template>

<script>
  import ModuleForm from './Form'
  import * as CustomPageApi from 'src/api/custompage'
  import Vue from 'vue'

  export default {
    name: 'EditCustomPage',
    components: {
      ModuleForm
    },
    async beforeRouteEnter (to, from, next) {
      if (!Vue.$store.state.custompage.customsPages) {
        await CustomPageApi.getList()
      }
      next((vm) => {
      })
    }
  }

</script>

<style lang="scss" scoped>

</style>
