<template>
  <div class="cash">
    <el-breadcrumb >
      <el-breadcrumb-item>apk版本管理</el-breadcrumb-item>
    </el-breadcrumb>
    <router-link :to="{name: 'CreateVersion'}">
      <el-button type="primary">添加版本</el-button>
    </router-link>
    <list ref="list" :queryParams="queryParams" :autoLoadData="false"></list>
  </div>
</template>

<script>
  import List from './List'

  export default {
    name: 'VersionIndex',
    components: {
      List
    },
    data() {
      return {
        loading: false,
        queryParams: {
        }
      }
    },
    methods: {
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$refs.list.loadFirstPageDataList()
      })
    }
  }
</script>

<style lang="less" scoped>

</style>
