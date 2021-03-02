<template>
  <div v-loading="loading">
    <el-breadcrumb>
      <el-breadcrumb-item>优惠券</el-breadcrumb-item>
    </el-breadcrumb>
    <search-bar ref="searchbar" @filter="filter" :model="queryParams"></search-bar>
    <div class="tool-bar">
      <el-button size="medium" type="primary" icon="el-icon-plus" @click="create">添加优惠券</el-button>
      <el-button size="medium" type="primary"  @click="showGiftPackDialog">生成优惠券礼包链接</el-button>
    </div>
    <list ref="list" :queryParams="queryParams" :autoLoadData="false"></list>
    <choose-voucher-dialog ref="dlgChooseVouche"></choose-voucher-dialog>

  </div>
</template>

<script>
  import List from './List'
  import ChooseVoucherDialog from './ChooseVoucherDialog'
  import SearchBar from './SearchBar'
  import * as ObjectUtil from '../../utils/objectUtil'

  export default {
    components: {
      List,
      ChooseVoucherDialog,
      SearchBar
    },
    data() {
      return {
        loading: false,
        queryParams: {
          expiry: false,
          put_status_stop: false,
          put_tp: '',
          name: '',
          sys_remark: '',
          voucher_id: ''
        }
      }
    },
    methods: {
      create() {
        this.$router.push({
          name: 'CreateVoucher'
        })
      },
      showGiftPackDialog() {
        this.$refs.dlgChooseVouche.show()
      },
      filter(model) {
        let query = ObjectUtil.filterEmpty(this.queryParams)
        query._t = new Date().getTime()
        this.$router.replace({
          path: '/voucher',
          query: query
        })
      },
      resetParam(query) {
        this.queryParams.voucher_id = ''
        this.queryParams.put_tp = ''
        this.queryParams.name = ''
        this.queryParams.sys_remark = ''
        this.queryParams = Object.assign(this.queryParams, query)
        this.queryParams.put_status_stop = this.queryParams.put_status_stop === 'true' || this.queryParams.put_status_stop
        this.queryParams.expiry = this.queryParams.expiry === 'true' || this.queryParams.expiry
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        let query = to.query
        if (from.name === 'CreateVoucher') {
          query = {}
          vm.$router.replace({
            path: '/voucher',
            query: query
          })
        }
        vm.resetParam(query)
        vm.$refs.list.loadFirstPageDataList()
      })
    },
    beforeRouteUpdate(to, from, next) {
      if (to.fullPath !== from.fullPath) {
        let query = to.query
        this.resetParam(query)
        this.$refs.list.loadFirstPageDataList()
        next()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
