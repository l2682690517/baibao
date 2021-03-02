<template>
  <div class="export_task" v-loading="loading">
    <div class="breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ name: 'orderIndex' }" v-if="fromCat == EXPORT_TASK.CAT_ORDER">订单</el-breadcrumb-item>
        <el-breadcrumb-item>导出任务</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <list ref="list" :queryParams="queryParams" :autoLoadData="false" @beforeLoad="_taskBeforeLoad" @loadCompleted="_taskLoadCompleted"></list>
  </div>
</template>

<script>
  import List from './List'
  import * as EXPORT_TASK from 'src/constants/export_task'

  export default {
    components: {
      List
    },
    data() {
      return {
        fromCat: 0,
        loading: false,
        EXPORT_TASK: EXPORT_TASK,
        queryParams: {
        }
      }
    },
    methods: {
      _taskBeforeLoad() {
        this.loading = true
      },
      _taskLoadCompleted() {
        this.loading = false
      },
      resetParam() {
        this.queryParams = {
        }
      },
      setFromCat(query) {
        this.fromCat = query.fromCat
        delete query['fromCat']
      }
    },
    beforeRouteEnter(to, from, next) {
      let query = to.query
      next(async vm => {
        vm.resetParam()
        vm.setFromCat(query)
        vm.queryParams = Object.assign(vm.queryParams, query)
        await vm.$nextTick()
        vm.$refs.list.loadFirstPageDataList()
      })
    }
  }

</script>
