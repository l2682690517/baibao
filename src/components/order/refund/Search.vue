<template>
  <div class="order" v-loading="loading">
    <div class="nav">
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/order' }">订单</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/order/refund' }">退款中</el-breadcrumb-item>
        <el-breadcrumb-item>搜索结果</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <search-tool-bar :model="searchModel" @submit="_search"></search-tool-bar>
    <list ref="list" :queryParams="queryParams" mode="search" @beforeLoad="_orderBeforeLoad"
          @loadCompleted="_orderLoadCompleted"></list>
  </div>
</template>

<script>
  import Vue from 'vue'
  import SearchToolBar from './RefundSearchToolBar'
  import List from './List'

  export default {
    name: 'SearchOrder',
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
        },
        searchModel: {
          status: '100',
          code: '', // 订单编号
          name: '', // 买家姓名
          mobile: '', // 买家手机号
          del_no: '',  // 物流单号
          orderStartTime: '',  // 发货时间开始
          orderEndTime: '',  // 发货时间结束
          pn: '' // 商品名称
        }
      }
    },
    methods: {
      _orderBeforeLoad() {
        this.loading = true
      },
      _orderLoadCompleted() {
        this.loading = false
      },
      _search() {
        Vue.util.extend(this.queryParams, this.searchModel)
        this.$refs.list.loadFirstPageDataList()
      }
    },
    created() {
      Vue.util.extend(this.searchModel, this.$route.query)
      Vue.util.extend(this.queryParams, this.$route.query)
    }
  }
</script>

<style lang="less" scoped>

  .nav {
    margin-bottom: 17px;

    .el-breadcrumb {
      font-size: 15px;
    }
  }


</style>
