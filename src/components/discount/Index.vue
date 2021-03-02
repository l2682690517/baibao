<template>
  <div>
    <el-breadcrumb >
      <el-breadcrumb-item>折扣</el-breadcrumb-item>
    </el-breadcrumb>
    <search-bar ref="searchbar" @filter="filter" :model="queryParams"></search-bar>
    <div class="tool-bar">
      <el-button class="create" type="primary" icon="el-icon-plus" @click="createDiscount">添加折扣</el-button>
    </div>
    <div>
      <list :queryParams="queryParams" ref="list" :autoLoadData="false"></list>
    </div>
  </div>
</template>

<script>

  import List from './List.vue'
  import SearchBar from './SearchBar'
  import * as ObjectUtil from '../../utils/objectUtil'

  export default {
    name: 'Discount',
    components: {
      List,
      SearchBar
    },
    data() {
      return {
        queryParams: {
          status: '',
          seckill: '',
          startTime: [],
          name: '',
          sort: 'pt',
          order: 'desc'
        }
      }
    },
    methods: {
      createDiscount() {
        this.$router.push({
          name: 'CreateDiscount'
        })
      },
      filter(model) {
        let query = ObjectUtil.filterEmpty(this.queryParams)
        query._t = new Date().getTime()
        this.$router.replace({
          path: '/discount',
          query: query
        })
      },
      resetParam(query) {
        this.queryParams.sort = 'pt'
        this.queryParams.order = 'desc'
        this.queryParams.status = ''
        this.queryParams.name = ''
        this.queryParams.startTime = []
        this.queryParams.seckill = ''
        this.queryParams = Object.assign(this.queryParams, query)
        this.queryParams.status = !this.queryParams.status ? '' : parseInt(this.queryParams.status, 10)
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        let query = to.query
        if (from.name === 'CreateDiscount') {
          query = {}
          vm.$router.replace({
            path: '/discount',
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

<style scoped lang="less">


</style>
