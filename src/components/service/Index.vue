<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>售后模板</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-button type="primary" icon="plus" @click="create">添加售后模板</el-button>
      <list></list>
    </div>
  </div>
</template>

<script>
  import List from './List'

  export default {
    components: {
      List
    },
    methods: {
      create() {
        this.$router.push({
          name: 'createService'
        })
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
