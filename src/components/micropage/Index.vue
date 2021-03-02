<template lang="pug">
  div
    el-breadcrumb
      el-breadcrumb-item 微页面
    router-link(:to="{name: 'CreateMicroPage'}")
      el-button(type="primary", icon="el-icon-plus", size="medium") 添加
    list(ref="list")
</template>

<script>
  import List from './List'

  export default {
    components: {
      List
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.$refs.list.loadDataList()
      })
    }
  }
</script>

<style lang="scss">
</style>
