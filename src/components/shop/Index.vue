<template>
  <div v-loading="loading">
    <el-breadcrumb>
      <el-breadcrumb-item>达人</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="tool-bar">
      <div>
        <search-tool-bar ref="searchtoolbar" :model="queryParams" @submit="_search" @export="_export"></search-tool-bar>
      </div>
    </div>
    <el-button size="medium" type="primary" @click="_showdlgCoupon">定向发券</el-button>
    <el-button size="medium" type="text" @click="_toCouponHistory">定向发券记录</el-button>
    <list ref="list" :queryParams="queryParams" :autoLoadData="false" @submit="_searchShop"
          @searchFrom="_search" @total="_total"></list>
    <coupon-dialog ref="dlgCoupon" @submit="_coupon" :voucherList="voucherList" :total="total"></coupon-dialog>
  </div>
</template>

<script>
  import SearchToolBar from './SearchToolBar'
  import List from './List'
  import * as ObjectUtil from '../../utils/objectUtil'
  import CouponDialog from 'src/components/couponHistory/couponDialog'
  import * as VoucherApi from 'src/api/voucher'
  import ShopApi from '../../api/shop'

  export default {
    components: {
      CouponDialog,
      SearchToolBar,
      List
    },
    watch: {},
    data () {
      return {
        loading: false,
        queryParams: {
          mentor: '',
          name: '',
          id: '',
          first: '',
          from: '',
          start: '',
          level: '',
          end: '',
          trial: '-1',
          sort: 'pt',
          order: 'desc',
          sale_tp: '',
          sale_frequency: '',
          up: ''
        },
        voucherList: [],
        total: 0
      }
    },
    methods: {
      _toCouponHistory () {
        this.$router.push({
          name: 'shopCouponHistory'
        })
      },
      async _coupon (model) {
        let data = JSON.parse(JSON.stringify(this.queryParams))
        data = Object.assign(data, model)
        try {
          await ShopApi.getList(data)
        } catch (err) {
          this.$myErrorHandler.handle(this, err, '提交失败')
        }
      },
      async getVoucher () {
        const params = {
          page: 0,
          limit: 0,
          name: '',
          put_tp: '3',
          sys_remark: '',
          put_status_stop: false,
          expiry: false
        }
        try {
          const res = await VoucherApi.getList(params)
          this.voucherList = res.data.data
        } catch (err) {
          this.$myErrorHandler.handle(this, err, '查询失败')
        }
      },
      _showdlgCoupon () {
        this.getVoucher()
        this.$refs.dlgCoupon.show()
      },
      _total (model) {
        this.total = model
      },
      _search (model) {
        this.queryParams = Object.assign(this.queryParams, model)
        let query = ObjectUtil.filterEmpty(this.queryParams)
        query._t = new Date().getTime()
        this.$router.push({
          path: '/shop',
          query: query
        })
      },
      _searchShop (model) {
        this.queryParams = Object.assign(this.queryParams, model)
        let query = ObjectUtil.filterEmpty(this.queryParams)
        this.$router.push({
          path: '/shop',
          query: query
        })
      },
      _export (model) {
        this.queryParams = Object.assign(this.queryParams, model)
        this.$refs.list.export()
      },
      resetParam () {
        this.queryParams.mentor = ''
        this.queryParams.name = ''
        this.queryParams.id = ''
        this.queryParams.first = ''
        this.queryParams.level = '0'
        this.queryParams.from = ''
        this.queryParams.start = ''
        this.queryParams.end = ''
        this.queryParams.trial = '-1'
        this.queryParams.sort = 'pt'
        this.queryParams.order = 'desc'
        this.queryParams.sale_tp = ''
        this.queryParams.sale_frequency = ''
        this.queryParams.from = ''
        this.queryParams.up = ''
      }
    },

    beforeRouteEnter (to, from, next) {
      let query = to.query
      next(vm => {
        vm.resetParam()
        vm.queryParams = Object.assign(vm.queryParams, query)
        vm.queryParams.mentor = parseInt(vm.queryParams.mentor) || ''
        vm.$refs.list.loadFirstPageDataList()
      })
    },
    beforeRouteUpdate (to, from, next) {
      if (to.fullPath !== from.fullPath) {
        let query = to.query
        this.resetParam()
        this.queryParams = Object.assign(this.queryParams, query)
        this.$refs.list.loadFirstPageDataList()
        next()
      }
    }
  }
</script>

<style lang="less" scoped>

  .tool-bar {
    display: flex;
    justify-content: space-between;
  }

</style>
