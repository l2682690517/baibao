<template>
  <div v-loading="loading">
    <el-breadcrumb>
      <el-breadcrumb-item>商品</el-breadcrumb-item>
    </el-breadcrumb>

    <tool-bar ref="toolBar" :selection="selection" :model="queryParams"
              @filter="filter"
              @export="exportCsv"
              @chooseCategory="chooseCategory"
              @chooseTag="chooseTag"
              @updateStatus="updateStatus"></tool-bar>
    <div>
      <list ref="list" :autoLoadData="false" :queryParams="queryParams" @selectionChange="selectionChange"></list>
    </div>
  </div>

</template>

<script>
  import ToolBar from './TooBar.vue'
  import List from './List.vue'
  import ProductApi from '@/api/product'
  import * as ObjectUtil from '../../utils/objectUtil'

  export default {
    components: {
      ToolBar,
      List
    },
    data() {
      return {
        loading: false,
        queryParams: {
          status: ToolBar.SS_ALL,
          cates: '',
          tags: '',
          sort: '',
          order: '',
          top: false,
          trash: false,
          upStartDate: '',
          upEndDate: '',
          id: '',
          name: '',
          sku_code: '',
          buyers: []
        },
        selectionIds: [],
        selection: []
      }
    },
    methods: {
      filter(model) {
        this.filterNotLoad(model)
        let query = ObjectUtil.filterEmpty(this.queryParams)
        query._t = new Date().getTime()
        this.$router.push({
          path: '/product',
          query: query
        })
      },
      filterNotLoad(model) {
        this.queryParams = Object.assign(this.queryParams, model)
      },
      selectionChange(items) {
        this.selectionIds = items.map(({id}) => id)
        this.selection = items
      },
      chooseCategory(id) {
        this.loading = true
        ProductApi.batchUpdateCate(this.selectionIds, id)
          .then((res) => {
            this.loading = false
            this.$message({
              message: '操作成功',
              showClose: true,
              type: 'success'
            })
            this.$refs.list.loadDataList()
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err)
          })
      },
      chooseTag(result) {
        this.loading = true
        ProductApi.batchUpdateTags(this.selectionIds, result)
          .then((res) => {
            this.loading = false
            this.$message({
              message: '操作成功',
              showClose: true,
              type: 'success'
            })
            this.$refs.list.loadDataList()
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err)
          })
      },
      updateStatus(status) {
        let targetStatus = this.queryParams.status === ToolBar.SS_DOWN ? ToolBar.STATUS_UP : ToolBar.STATUS_DOWN
        let msg = targetStatus === ToolBar.STATUS_DOWN ? '下架商品' : '上架商品'
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          ProductApi.batchUpdateStatus(this.selectionIds, targetStatus)
            .then((res) => {
              this.loading = false
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$refs.list.loadDataList()
            })
            .catch((err) => {
              this.loading = false
              this.$myErrorHandler.handle(this, err, '操作失败')
            })
        }).catch(() => {
        })
      },
      exportCsv(filter) {
        this.filterNotLoad(filter)
        ProductApi.getList(Object.assign({export: 1}, this.queryParams))
      },
      resetParam(query) {
        this.queryParams.status = ToolBar.SS_ALL
        this.queryParams.id = ''
        this.queryParams.cates = ''
        this.queryParams.tags = ''
        this.queryParams.sort = ''
        this.queryParams.order = ''
        this.queryParams.top = false
        this.queryParams.trash = false
        this.queryParams.upStartDate = ''
        this.queryParams.upEndDate = ''
        this.queryParams.name = ''
        this.queryParams.sku_code = ''
        this.queryParams.buyers = []
        this.queryParams = Object.assign(this.queryParams, query)
        this.queryParams.top = this.queryParams.top === 'true' || this.queryParams.top
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        let query = to.query
        if (from.name === 'CreateProduct') {
          query = {}
          vm.$router.replace({
            path: '/product',
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
        if (query.buyers !== undefined) {
          if (typeof (query.buyers) === 'string') {
            let data = []
            data[0] = query.buyers
            query.buyers = data
          }
        }
        this.resetParam(query)
        this.$refs.list.loadFirstPageDataList()
        next()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
