<template>
  <div class="order" v-loading="loading">
    <el-breadcrumb>
      <el-breadcrumb-item>订单</el-breadcrumb-item>
    </el-breadcrumb>
    <search-tool-bar :model="queryParams" ref="searchToolbar" @submit="_search"
                     @create_export_task="_createExportTask"></search-tool-bar>
    <tool-bar></tool-bar>
    <list ref="list" :queryParams="queryParams" :autoLoadData="false" @beforeLoad="_orderBeforeLoad"
          @loadCompleted="_orderLoadCompleted"></list>
  </div>
</template>

<script>
  import SearchToolBar from './SearchToolBar'
  import ToolBar from './ToolBar'
  import List from './List'
  import OrderApi from '../../api/order'
  import * as ObjectUtil from '../../utils/objectUtil'

  export default {
    name: 'OrderList',
    components: {
      SearchToolBar,
      ToolBar,
      List
    },
    data () {
      return {
        loading: false,
        queryParams: {
          status: ['3', '4', '5'],
          code: '', // 订单编号
          name: '', // 买家姓名
          mobile: '', // 买家手机号
          del_no: '',  // 物流单号
          orderStartTime: '',  // 下单时间开始
          orderEndTime: '',  // 时间结束
          pn: '', // 商品名称,
          spid: '', // 店铺id
          uid: '', // 消费者id
          buyers: [],
          cate: []
        }
      }
    },
    methods: {
      _orderBeforeLoad () {
        this.loading = true
      },
      _orderLoadCompleted () {
        this.loading = false
      },
      _filter (model) {
        this.queryParams = Object.assign(this.queryParams, model)
      },
      _search (model) {
        this._filter(model)
        let query = ObjectUtil.filterEmpty(this.queryParams)
        query._t = new Date().getTime()
        this.$router.push({
          path: '/order',
          query: query

        })
      },
      _createExportTask (model) {
        this._filter(model)
        OrderApi.getList(Object.assign({export: 1}, this.queryParams)).then((res) => {
          this.$message({
            showClose: true,
            message: res.data,
            type: 'success'
          })
        }).catch((err) => {
          this.$myErrorHandler.handle(this, err)
        })
      },
      resetParam () {
        this.queryParams.status = ['3', '4', '5']
        this.queryParams.code = ''
        this.queryParams.name = ''
        this.queryParams.mobile = ''
        this.queryParams.del_no = ''
        this.queryParams.orderStartTime = ''
        this.queryParams.orderEndTime = ''
        this.queryParams.pn = ''
        this.queryParams.spid = ''
        this.queryParams.uid = ''
        this.queryParams.buyers = []
        this.queryParams.cate = []
      }
    },
    beforeRouteEnter (to, from, next) {
      let query = to.query
      next(vm => {
        vm.resetParam()
        vm.queryParams = Object.assign(vm.queryParams, query)
        vm.$refs.list.loadFirstPageDataList()
      })
    },
    beforeRouteUpdate (to, from, next) {
      if (to.fullPath !== from.fullPath) {
        let query = Object.assign({}, to.query)
        if (query.status !== undefined) {
          if (query.status.length === 1) {
            let data = []
            data[0] = String(query.status)
            query.status = data
          }
        }
        if (query.buyers !== undefined) {
          if (typeof (query.buyers) === 'string') {
            let data = []
            data[0] = query.buyers
            query.buyers = data
          }
        }
        if (query.cate !== undefined) {
          if (typeof (query.cate) === 'string') {
            let data = []
            data[0] = query.cate
            query.cate = data
          }
        }
        this.resetParam()
        this.queryParams = Object.assign(this.queryParams, query)
        this.$refs.list.loadFirstPageDataList()
        next()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
