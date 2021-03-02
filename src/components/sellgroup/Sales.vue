<template lang="pug">
  div
    el-breadcrumb
      el-breadcrumb-item(:to="{ name: 'SellGroupIndex' }") 姐妹团
      el-breadcrumb-item 业绩
    sales-search-bar(:queryParams="queryParams", @submit="search")
    div
      el-table(:data="dataList.data", border, rowKey="id", v-loading="loading", element-loading-text="加载中", @sort-change="sortChanged")
        el-table-column(label="姐妹团ID", prop="id")
        el-table-column(label="销售额", prop="total_amount", sortable="custom")
          template(slot-scope="scope")
            div {{ scope.row.total_amount | price }}
        el-table-column(label="团长ID", prop="shop_id")
        el-table-column(label="团员数量", prop="mc", sortable="custom")
          template(slot-scope="scope")
            div {{ scope.row.member_count}}
        el-table-column(label="开团时间", prop="ct", sortable="custom")
          template(slot-scope="scope")
            div {{scope.row.start_tick | datetime}}
        el-table-column(label="状态", prop="status", sortable="custom")
          template(slot-scope="scope")
            div {{ getFriendlyStatusName(scope.row) }}
        el-table-column(label="操作", width="80")
          template(slot-scope="scope")
            div
              el-button(size="mini", @click="showSellGroupDetail(scope.row)") 详情
    div.bottom-tool-bar
      | 合计: {{ summary.count }}个团，{{ summary.mc }}人次参团，销售总额{{ getSummaryPrice }}
    div.pager-wrapper
      el-pagination(layout="total, prev, pager, next", :total="dataList.total", :currentPage="currentPage", :pageSize="pageSize", @current-change="changePage")
    sell-group-detail(ref="dlgSellGroupDetail")
</template>

<script>
  import SalesSearchBar from './SalesSearchBar.vue'
  import SellGroupDetail from './SellGroupDetail.vue'
  import LoadPageData from 'src/mixins/LoadPagerData'
  import * as SellGroupApi from 'src/api/sellgroup'
  import * as ObjectUtil from 'src/utils/objectUtil'
  import * as SellGroupUtil from 'src/utils/sell-group-util'

  export default {
    mixins: [LoadPageData],
    components: {
      SalesSearchBar,
      SellGroupDetail
    },
    props: {
      autoLoadData: false,
      queryParams: {
        type: Object,
        default: () => {
          return {
            status: '',
            res: '',
            openstart: '',
            openend: '',
            leader: '',
            gid: ''
          }
        }
      }
    },
    data () {
      return {
        summary: {
          count: 0,
          mc: 0,
          total_amount: 0
        }
      }
    },
    computed: {
      getSummaryPrice () {
        let val = this.summary.total_amount / 100
        if (val < 10000) {
          return `¥${val}`
        } else if (val > 100000000) {
          return `¥${(val / 100000000).toFixed(2)}亿`
        } else {
          return `¥${(val / 10000).toFixed(2)}万`
        }
      }
    },
    methods: {
      getQueryApi (params) {
        return SellGroupApi.getSales(params)
      },
      search (model) {
        this.queryParams = Object.assign(this.queryParams, model)
        let query = ObjectUtil.filterEmpty(this.queryParams)
        query._t = new Date().getTime()
        this.refreshSummary()
        this.$router.replace({
          name: 'SellGroupSales',
          query: query

        })
      },
      resetParam () {
        this.queryParams.status = ''
        this.queryParams.res = ''
        this.queryParams.openstart = ''
        this.queryParams.openend = ''
        this.queryParams.leader = ''
        this.queryParams.gid = ''
      },
      showSellGroupDetail (row) {
        this.$refs.dlgSellGroupDetail.show(row)
      },
      getFriendlyStatusName (group) {
        return SellGroupUtil.getFriendlyStatusName(group)
      },
      async refreshSummary () {
        try {
          const resData = await SellGroupApi.summary(this.queryParams)
          this.summary = resData.data
        } catch (e) {
          this.$myErrorHandler.handle(this, e)
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      let query = to.query
      next(vm => {
        vm.resetParam()
        vm.queryParams = Object.assign(vm.queryParams, query)
        vm.loadFirstPageDataList()
        vm.refreshSummary()
      })
    },
    beforeRouteUpdate (to, from, next) {
      if (to.fullPath !== from.fullPath) {
        let query = to.query
        this.resetParam()
        this.queryParams = Object.assign(this.queryParams, query)
        this.loadFirstPageDataList()
        next()
      }
    }
  }
</script>

<style lang="scss" scoped>

  .action-wrapper {
    & > a {
      margin-right: 20px;
    }
  }

  .list-wrapper {
    margin-top: 20px;
  }

  .control-wrapper {
    :first-child {
      margin-left: 10px;
    }
    .btn {
      width: 60px;
    }
  }

  .pager-wrapper {
    text-align: center;
  }

  .bottom-tool-bar {
    margin-top: 15px;
  }


</style>
