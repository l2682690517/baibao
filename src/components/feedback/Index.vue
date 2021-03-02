<template>
  <div class="cash">
    <el-breadcrumb >
      <el-breadcrumb-item>建议与反馈</el-breadcrumb-item>
    </el-breadcrumb>
    <status-tool-bar @change="_statusChanged"></status-tool-bar>
    <list ref="list" :queryParams="queryParams" :autoLoadData="false"></list>
  </div>
</template>

<script>
  import StatusToolBar from './StatusToolBar'
  import List from './List'

  export default {
    name: 'CashList',
    components: {
      StatusToolBar,
      List
    },
    data() {
      return {
        loading: false,
        queryParams: {
          type: ''
        }
      }
    },
    methods: {
      _statusChanged(type) {
        this.queryParams.type = type
        this.$refs.list.loadFirstPageDataList()
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$refs.list.loadDataList()
      })
    }
  }
</script>

<style lang="less" scoped>

</style>
