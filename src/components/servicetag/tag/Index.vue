<template>
  <div>
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="create">添加</el-button>
      <list ref="list"></list>
    </div>

  </div>
</template>

<script>

  import List from './List.vue'

  export default {
    components: {
      List
    },
    methods: {
      create() {
        this.$refs.list.create()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
