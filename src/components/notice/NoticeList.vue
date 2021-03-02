<template>
  <div class="list-wrapper">
    <div>
      <el-table :data="dataList.data" :show-header="false" row-key="id">
        <el-table-column label="">
        </el-table-column>
        <el-table-column label="">
          <template slot-scope="scope">
          </template>
        </el-table-column>
        <el-table-column label="">
          <template slot-scope="scope">
            <el-button type="el-icon-primary" size="mini">编辑</el-button>
            <el-button type="el-icon-danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pager-wrapper" v-show="isEnabledPager">
      <el-pagination
        layout="total, prev, pager, next"
        :total="dataListTotal"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import LoadPageData from '../../mixins/LoadPagerData'
  import OrderApi from '../../api/order'

  export default {
    mixins: [LoadPageData],
    props: {
      queryParams: {
        type: Object,
        default: () => {
          return {
            page: 1,
            limit: 5,
            sort: '',
            order: ''
          }
        }
      }
    },
    methods: {
      getQueryApi(params) {
        return OrderApi.getList(params)
      }
    }
  }
</script>

<style lang="less" scoped>

  .list-wrapper {
    margin-top: 20px;

  }

</style>
