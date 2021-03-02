<template>
  <div class="list-wrapper">
    <div>
      <el-table :data="dataList.data" border row-key="id" :show-header="false">
        <el-table-column label="">
          <template slot-scope="scope">
          </template>
        </el-table-column>
        <el-table-column label="">
          <template slot-scope="scope">
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="_handleEdit">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import LoadFullData from '../../mixins/LoadFullData'
  import OrderApi from '../../api/order'

  export default {
    mixins: [LoadFullData],
    methods: {
      getQueryApi(params) {
        return OrderApi.getList(params)
      },
      _handleEdit() {
        this.$router.push({
          name: 'manageNotice'
        })
      }
    }
  }
</script>

<style lang="less" scoped>


</style>
