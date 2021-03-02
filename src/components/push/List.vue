<template>
  <div class="list-wrapper">
    <div>
      <el-table :data="dataList.data" border row-key="id"
                v-loading="loading"
                element-loading-text="加载中">
        <el-table-column label="推送" header-align="center">
          <template slot-scope="scope">
            <div class="info-wrapper">
              <div class="desc-wrapper">
                <div>标题:{{scope.row.title}}
                </div>
                <div class="name-wrapper">
                  <div class="left">内容:{{scope.row.content}}</div>
                </div>
                <div v-if="scope.row.raw_go">
                  <span>跳转:{{_getGoText(scope.row)}}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="推送时间" header-align="center" align="center" width="300">
          <template slot-scope="scope">
            {{scope.row.ct | datetime}}
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
  import PushApi from '../../api/push'
  import { getFriendlyModuleType } from 'src/utils/cmsUtil'

  export default {
    mixins: [LoadPageData],
    components: {
    },
    props: {
      queryParams: {
        type: Object,
        default: () => {
          return {
            title: '',
            startTime: []
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
        return PushApi.getList(params)
      },
      _getGoText(row) {
        try {
          if (row.raw_go) {
            let go = JSON.parse(row.raw_go)
            return this._showName(go.data)
          }
          return ''
        }catch(err) {
          return ''
        }
      },
      _showName(mod) {
        return `[${getFriendlyModuleType(mod.type)}] ${mod.name}`
      }
    }
  }
</script>

<style lang="less" scoped>

  .list-wrapper {
    margin-top: 20px;
  }

</style>
