<template>
  <div v-loading="loading">
    <el-breadcrumb>
      <el-breadcrumb-item>消费者</el-breadcrumb-item>
    </el-breadcrumb>
    <search-tool-bar :model="queryParams" @submit="_search"></search-tool-bar>
    <el-button size="medium" type="primary" @click="_showdlgCoupon">定向发券</el-button>
    <el-button size="medium" type="text" @click="_toCouponHistory">定向发券记录</el-button>
    <list :queryParams="queryParams" ref="list" :autoLoadData="false" @total="_total"></list>
    <coupon-dialog ref="dlgCoupon" @submit="_coupon" :voucherList="voucherList" :total="total"></coupon-dialog>
  </div>
</template>

<script>
  import SearchToolBar from './SearchToolBar'
  import List from './List'
  import CouponDialog from 'src/components/couponHistory/couponDialog'
  import * as VoucherApi from 'src/api/voucher'
  import CustomerApi from '../../api/customer'

  export default {
    components: {
      SearchToolBar,
      List,
      CouponDialog
    },
    data () {
      return {
        queryParams: {
          start: '',
          end: '',
          nickname: '',
          uid: '',
          consume_tp: ''
        },
        voucherList: [],
        total: 0,
        loading: false
      }
    },
    methods: {
      _total (model) {
        this.total = model
      },
      async _coupon (model) {
        let data = JSON.parse(JSON.stringify(this.queryParams))
        data = Object.assign(data, model)
        try {
          await CustomerApi.getList(data)
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
        this.$refs.list.loadFirstPageDataList()
        this.getVoucher()
        this.$refs.dlgCoupon.show()
      },
      async _toCouponHistory () {
        this.$router.push({
          name: 'customerCouponHistory'
        })
      },
      _search (model) {
        model._t = new Date().getTime()
        this.$router.push({
          path: '/customer',
          query: model
        })
      },
      resetParam () {
        this.queryParams.start = ''
        this.queryParams.end = ''
        this.queryParams.nickname = ''
        this.queryParams.uid = ''
        this.queryParams.consume_tp = ''
      },
      loadData () {
        this.$refs.list.loadFirstPageDataList()
      }
    },
    beforeRouteEnter (to, from, next) {
      let query = to.query
      next(vm => {
        vm.resetParam()
        vm.queryParams = Object.assign(vm.queryParams, query)
        vm.loadData()
      })
    },
    beforeRouteUpdate (to, from, next) {
      console.log('1')
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

  .searchWrapper {
    text-align: right;
  }

</style>
