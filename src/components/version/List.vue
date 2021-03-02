<template>
  <div class="list-wrapper">
    <div>
      <el-table :data="dataList.data" border row-key="id"
                v-loading="loading"
                element-loading-text="加载中">
        <el-table-column label="CODE"  prop="code" width="100">
        </el-table-column>
        <el-table-column label="版本名称" prop="name" width="120">
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            <div>
              {{scope.row.ct | datetime}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="URL"  prop="url">
        </el-table-column>
        <el-table-column label="描述" prop="desc">
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.enabled === true" type="success">有效</el-tag>
              <el-tag v-if="scope.row.enabled === false" type="danger">无效</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <div>
              <div>
                <el-button type="danger"  size="mini" @click="handleDel(scope.row)">删除</el-button>
                <el-button type="primary"  size="mini" @click="handleEdit(scope.row.id)">修改</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pager-wrapper" v-show="isEnabledPager">
      <el-pagination
        layout="total, prev, pager, next"
        :total="dataList.total"
        :current-page='currentPage'
        :page-size="pageSize"
        @current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import LoadPageData from '../../mixins/LoadPagerData'
  import VersionApi from '../../api/version'
  export default {
    mixins: [LoadPageData],
    components: {
    },
    props: {
      queryParams: {
        type: Object,
        default: () => {
          return {
          }
        }
      }
    },
    data() {
      return {
        dataList: {}
      }
    },
    methods: {
      getQueryApi(params) {
        return VersionApi.getList(params)
      },
      handleEdit(id) {
        this.$router.push({
          name: 'EditVersion',
          params: {
            id: id
          }
        })
      },
      handleDel(ver) {
        this.$confirm(`删除版本:'${ver.name}' ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          VersionApi.deleteVersion(ver.id)
            .then((res) => {
              this.loading = false
              this.$message({
                type: 'success',
                message: '操作成功',
                showClose: true
              })
              this.loadDataList()
            })
            .catch((err) => {
              this.$myErrorHandler.handle(this, err, '删除版本失败')
            })
        }).catch(() => {})
      }
    }
  }
</script>

<style lang="less" scoped>

  .list-wrapper {
    margin-top: 20px;
  }

</style>
