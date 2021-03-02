<template lang="pug">
  div
    el-breadcrumb
      el-breadcrumb-item(:to="{ name: 'MicroPageIndex' }") 微页面
      el-breadcrumb-item 编辑微页面
    div
      module-form
</template>

<script>
  import ModuleForm from './Form'

  export default {
    name: 'EditMicroPage',
    components: {
      ModuleForm
    }
  }
</script>

<style lang="scss" scoped></style>
