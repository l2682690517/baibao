<template>
  <div class="list-wrapper">
    <div>
      <el-table :data="dataList.data" @sort-change="sortChanged" border row-key="id"
                v-loading="loading"
                element-loading-text="加载中">
        <el-table-column label="ID" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="消费者" min-width="150">
          <template slot-scope="scope">
            <div class="info-wrapper">
              <div class="icon" :class="{default:!scope.row.icon}" v-lazy:background-image="scope.row.icon">
              </div>
              <el-tooltip :content="scope.row.nickname" >
                <div class="name">
                  {{scope.row.nickname}}
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="总交易额" prop="total_amount" sortable="custom" width="120">
          <template slot-scope="scope">
            {{scope.row.total_amount | price}}
          </template>
        </el-table-column>
        <el-table-column label="单笔最高" prop="max_amount" sortable="custom" width="120">
          <template slot-scope="scope">
            {{scope.row.max_amount | price}}
          </template>
        </el-table-column>
        <el-table-column label="最近购买" prop="last_time" sortable="custom" width="120">
          <template slot-scope="scope">
            {{scope.row.last_time | date}}
          </template>
        </el-table-column>
        <el-table-column label="平均交易额" width="110">
          <template slot-scope="scope">
            <span
              v-if="scope.row.total_time > 0">{{parseInt(scope.row.total_amount / scope.row.total_time) | price}}</span>
            <span v-else>0</span>
          </template>
        </el-table-column>
        <el-table-column label="购买次数" prop="total_time" sortable="custom" width="120">
          <template slot-scope="scope">
            {{scope.row.total_time}}
          </template>
        </el-table-column>
        <el-table-column label="关注" width="65">
          <template slot-scope="scope">
            <el-icon name="circle-check" v-if="scope.row.ext && scope.row.ext.follow"></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="开店" width="65">
          <template slot-scope="scope">
            <el-icon name="circle-check" v-if="scope.row.shop "></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="ct" sortable="custom" width="120">
          <template slot-scope="scope">
            {{scope.row.ct | date}}
          </template>
        </el-table-column>
        <el-table-column label="" width="90">
          <template slot-scope="scope">
            <router-link :to="{name: 'orderIndex',query: {'uid': scope.row.id}}">
              <el-button type="text">购买记录</el-button>
            </router-link>
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
  import CustomerApi from '../../api/customer'

  export default {
    mixins: [LoadPageData],
    props: {
      queryParams: {
        type: Object,
        default: () => {
          return {
            nickname: '',
            sort: 'ct',
            order: 'desc'
          }
        }
      }
    },
    methods: {
      getQueryApi(params) {
        return CustomerApi.getList(params)
      },
      getTotal () {
        this.$emit('total', this.dataListTotal)
      }
    },
    updated () {
      this.getTotal()
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
        width: 35px;
        height: 35px;
        margin-right: 10px;
        background-size: cover;
        border-radius: 50%;

        &.default {
          background-image: url("~@/assets/img/user-avatar.png") !important;
        }
      }

      .name {
        flex: 1;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-height: 24px;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
        white-space:nowrap
      }
    }

  }

</style>
