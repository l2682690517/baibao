<template>
  <div class="list-wrapper">
    <div>
      <el-table :data="dataList.data" border row-key="id"
                v-loading="loading"
                element-loading-text="加载中">
        <el-table-column label="类型" width="120">
          <template slot-scope="scope">
            <div>
             {{scope.row.typeName}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="反馈" >
          <template slot-scope="scope">
            <div>
              {{scope.row.content}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="联系方式">
          <template slot-scope="scope">
              {{scope.row.mobile}}
          </template>
        </el-table-column>
        <el-table-column label="消费者">
          <template slot-scope="scope">
            <div class="info-wrapper">
              <div class="icon" :class="{default:!scope.row.user.icon}" v-lazy:background-image="scope.row.user.icon">
              </div>
              <div class="name">
                <div><span>{{scope.row.user.nickname}}</span></div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" width="120">
          <template slot-scope="scope">
            <div>
              {{scope.row.ct | date}}
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
  import FeedBackApi from '../../api/feedback'
  export default {
    mixins: [LoadPageData],
    components: {
    },
    props: {
      queryParams: {
        type: Object,
        default: () => {
          return {
            type: ''
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
        return FeedBackApi.getList(params)
      }

    }
  }
</script>

<style lang="less" scoped>

  .list-wrapper {
    margin-top: 20px;

    .info-wrapper {
      display: flex;
      align-items: center;
      padding-top: 5px;
      padding-bottom: 5px;

      .icon {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        background-size: cover;
        border-radius: 50%;

        &.default {
          background-image: url("~@/assets/img/user-avatar.png") !important;
        }
      }
    }

    .name {
      flex: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-height: 17px;
      max-height: 34px;
      text-overflow: ellipsis;
      word-break: break-all;
      overflow: hidden;
    }
  }

  .img {
    height:25px;
    width: 25px;
  }
</style>
