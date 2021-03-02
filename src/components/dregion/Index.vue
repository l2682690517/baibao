<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>配送区域</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="tool-bar">
      <el-button type="primary" icon="el-icon-plus" @click="create">添加</el-button>
    </div>
    <div class="intro">限区说明将自动显示在商品详情中</div>
    <el-table :data="dataList.data" border v-loading="loading"
              element-loading-text="加载中">
      <el-table-column label="名称" prop="name" :width="200"></el-table-column>
      <el-table-column label="限区说明">
        <template slot-scope="scope">
          {{regionText(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column label="应用商品" width="150">
        <template slot-scope="scope">
          {{scope.row.product_count}}款商品
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editItem(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" :disabled="scope.row.product_count > 0" @click="delItem(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  import * as DRegionApi from 'src/api/dregion'
  import * as AddressUtil from 'src/utils/addressUtil'

  export default {
    data () {
      return {
        loading: false,
        dataList: {}
      }
    },
    methods: {
      create () {
        this.$router.push({
          name: 'CreateDRegion'
        })
      },
      editItem (row) {
        this.$router.push({
          name: 'EditDRegion',
          params: {
            id: row.id
          }
        })
      },
      delItem (row) {
        this.$confirm('确定删除?').then(async () => {
          try {
            this.loading = true
            await DRegionApi.deleteItem(row.id)
            this.refreshDataList()
          } catch (e) {
            this.$myErrorHandler.handle(this, e)
          } finally {
            this.loading = false
          }
        }).catch(() => {})
      },
      async refreshDataList () {
        this.loading = true
        try {
          const res = await DRegionApi.getList()
          this.dataList = res.data
        } catch (e) {
          this.$myErrorHandler.handle(this, e)
        } finally {
          this.loading = false
        }
      },
      regionText (row) {
        let isInclude
        let provinceArr
        if (row.include) {
          if (row.province.length < AddressUtil.allProvince.length / 2) {
            isInclude = true
            provinceArr = row.province
          } else {
            isInclude = false
            provinceArr = AddressUtil.reverseProvince(row.province)
          }
        } else {
          if (row.province.length < AddressUtil.allProvince.length / 2) {
            isInclude = false
            provinceArr = row.province
          } else {
            isInclude = true
            provinceArr = AddressUtil.reverseProvince(row.province)
          }
        }
        if (isInclude) {
          return `配送范围支持${provinceArr.join('、')}。`
        } else {
          return `配送范围支持除${provinceArr.join('、')}以外的中国大陆地区。`
        }
      }
    },
    activated () {
      this.refreshDataList()
    }
  }
</script>

<style lang="scss" scoped>
  .tool-bar {
    margin-bottom: 20px;
  }

  .intro {
    color: $color-default;
    font-size: 14px;
    margin-bottom: 10px;
  }
</style>
