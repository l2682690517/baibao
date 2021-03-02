<template>
  <div class="index">
    <el-breadcrumb >
      <el-breadcrumb-item>百宝协议</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="section">
      <list ref="list"></list>
    </div>
  </div>
</template>

<script>
  import List from './List'

  export default {
    components: {
      List
    },
    data() {
      return {
      }
    },
    methods: {
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$refs.list.loadDataList()
      })
    }
  }
</script>

<style lang="less" scoped>

  .section:last-child {
    margin-top: 20px;
  }

</style>
