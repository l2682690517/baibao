<template>
  <div class="cash">
    <el-breadcrumb >
      <el-breadcrumb-item>推送</el-breadcrumb-item>
    </el-breadcrumb>
    <search-bar ref="searchbar" @filter="filter" :model="queryParams"></search-bar>
    <router-link :to="{name: 'CreatePush'}">
      <el-button size="medium" type="primary" :disabled="count >= max">添加</el-button>
    </router-link>
    <span class="input-tip">&nbsp;今日已推{{count}}/{{max}}</span>
    <list ref="list" :queryParams="queryParams" :autoLoadData="false"></list>
  </div>
</template>

<script>
  import List from './List'
  import PushApi from '../../api/push'
  import SearchBar from './SearchBar'
  import * as ObjectUtil from '../../utils/objectUtil'

  export default {
    name: 'PushIndex',
    components: {
      List,
      SearchBar
    },
    data() {
      return {
        count: 0,
        max: 0,
        loading: false,
        queryParams: {
          title: '',
          startTime: []
        }
      }
    },
    methods: {
      _getPushCount() {
        PushApi.getPushCount()
          .then((res) => {
            let data = res.data
            this.count = data.count
            this.max = data.max
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err)
          })
      },
      filter(model) {
        let query = ObjectUtil.filterEmpty(this.queryParams)
        query._t = new Date().getTime()
        this.$router.replace({
          path: '/push',
          query: query
        })
      },
      resetParam(query) {
        this.queryParams.title = ''
        this.queryParams.startTime = []
        this.queryParams = Object.assign(this.queryParams, query)
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        let query = to.query
//        if (from.name === 'CreateDiscount') {
//          query = {}
//          vm.$router.replace({
//            path: '/discount',
//            query: query
//          })
//        }
        vm.resetParam(query)
        vm.$refs.list.loadFirstPageDataList()
        vm._getPushCount()
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

<style lang="less" scoped>

</style>
