<template>
  <div class="list-wrapper service-list">
    <el-table :data="dataList" border row-key="id" :show-header="false" v-loading="loading"
              element-loading-text="加载中">
      <el-table-column label="" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import ServiceApi from 'src/api/service'

  export default {
    data() {
      return {
        dataList: [],
        loading: false
      }
    },
    methods: {
      getQueryApi(params) {
        return ServiceApi.getList(params)
      },
      async loadDataList() {
        try {
          this.loading = true
          const res = await this.getQueryApi()
          this.dataList = res.data
          if (!this.dataList) {
            this.dataList = []
          }
          this.loading = false
        } catch (err) {
          this.$myErrorHandler.handle(this, err, '查询失败')
          this.loading = false
        }
      },
      handleEdit(text) {
//        this.$router.push({
//          name: 'product'
//        })
        this.$router.push({
          name: 'editService',
          query: {name: text}
        })
      },
      handleDelete(name) {
        this.$confirm('确定要删除吗？', '提示', ({
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })).then(async () => {
          try {
            await ServiceApi.delItem(name)
          } catch (ex) {
            this.$myErrorHandler.handle(this, ex)
          }
          this.loadDataList()
        }).catch(() => {})
      }
    },
    activated() {
      this.loadDataList()
    }
  }
</script>

<style lang="less" scoped>
  .service-list {
    width: 500px;
  }
</style>
