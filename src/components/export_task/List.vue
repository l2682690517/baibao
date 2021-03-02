<template>
  <div class="list-wrapper">
    <div>
      <el-table :data="dataList.data" border row-key="id"
                v-loading="loading" element-loading-text="加载中">
        <el-table-column label="ID" prop="id">
        </el-table-column>
        <el-table-column label="分类">
          <template slot-scope="scope">{{scope.row.cat | exportTaskCat}}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === EXPORT_TASK.STATUS_EXPORTING">{{scope.row.status | exportTaskStatus}}</el-tag>
            <el-tag v-if="scope.row.status === EXPORT_TASK.STATUS_DONE" type="success">{{scope.row.status | exportTaskStatus}}</el-tag>
            <el-tag v-if="scope.row.status === EXPORT_TASK.STATUS_ERROR" type="danger">{{scope.row.status | exportTaskStatus}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="管理员" prop="sys_name"></el-table-column>
        <el-table-column label="创建时间" prop="ct">
          <template slot-scope="scope">{{scope.row.ct | datetime}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button :diabled="scope.row.status === EXPORT_TASK.STATUS_EXPORTING || scope.row.status === EXPORT_TASK.STATUS_ERROR"
                       v-bind:type="scope.row.status === EXPORT_TASK.STATUS_ERROR ? 'danger' : 'primary'"
                       size="mini" @click="download(scope.row)">
              下载
            </el-button>
            <!--scope.row.download-->

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pager-wrapper" v-show="isEnabledPager">
      <el-pagination layout="prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="changePage"></el-pagination>
    </div>
  </div>
</template>

<script>
  import LoadPagerData from 'src/mixins/LoadPagerData'
  import ExportTaskApi from 'src/api/export_task'
  import * as EXPORT_TASK from 'src/constants/export_task'
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'

  export default {
    components: {ElButton},
    mixins: [LoadPagerData],
    props: {
      queryParams: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        dataList: {},
        EXPORT_TASK: EXPORT_TASK
      }
    },
    methods: {
      getQueryApi(params) {
        return ExportTaskApi.getList(params)
      },
      download(task) {
        if(task.download === '') {
          this.$message({
            showClose: true,
            message: '没有下载地址',
            type: 'warning'
          })
          return
        }

        window.open(task.download)
      }
    }
  }
</script>

