<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/order' }">订单</el-breadcrumb-item>
      <el-breadcrumb-item>退款中</el-breadcrumb-item>
    </el-breadcrumb>
    <search-tool-bar :uid="this.$route.params.uid" ref="searchToolbar"  @submit="_search"></search-tool-bar>
    <list  ref="list" :queryParams="queryParams" :uid="this.$route.params.uid" :autoLoadData="false"></list>
  </div>
</template>

<script>
  import SearchToolBar from './RefundSearchToolBar'
  import List from './List.vue'

  export default {
    components: {
      SearchToolBar,
      List
    },
    data() {
      return {
        loading: false,
        queryParams: {
          status: '100',
          code: '', // 订单编号
          name: '', // 买家姓名
          mobile: '', // 买家手机号
          del_no: '',  // 物流单号
          orderStartTime: '',  // 下单时间开始
          orderEndTime: '',  // 时间结束
          pn: '' // 商品名称,
        }
      }
    },
    methods: {
      _search() {
        this.queryParams = Object.assign(this.queryParams, this.$refs.searchToolbar.model)
        this.$refs.list.loadDataList()
      },
      reset() {
        this.queryParams.status = '100'
        this.queryParams.code = '' // 订单编号
        this.queryParams.name = '' // 买家姓名
        this.queryParams.mobile = '' // 买家手机号
        this.queryParams.del_no = ''  // 物流单号
        this.queryParams.orderStartTime = ''  // 下单时间开始
        this.queryParams.orderEndTime = ''  // 时间结束
        this.queryParams.pn = '' // 商品名称,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.reset()
        vm.$refs.searchToolbar.reset()
        vm.$refs.list.loadFirstPageDataList()
      })
    }
  }
</script>

<style lang="less" scoped>

</style>
