<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ name: 'shop' }">达人</el-breadcrumb-item>
      <el-breadcrumb-item>指量定向发券</el-breadcrumb-item>
    </el-breadcrumb>
    <list ref="list" :queryParams="queryParams" :type="type" :autoLoadData="false"></list>
  </div>
</template>

<script>
  import List from '../couponHistory/List.vue'
  import { HISTORY_TYPE_SHOP } from 'src/constants/voucher'

  export default {
    props: {},
    components: {List},
    data () {
      return {
        type: HISTORY_TYPE_SHOP,
        queryParams: {}
      }
    },
    computed: {},
    watch: {},
    methods: {},
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.$refs.list.loadFirstPageDataList()
      })
    }
  }
</script>


<style lang="less" scoped>

</style>
