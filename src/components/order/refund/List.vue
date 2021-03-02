<template>
  <div class="list-wrapper">
    <div>
      <el-table :data="dataList.data" border row-key="id"
                v-loading="loading"
                element-loading-text="加载中">
        <el-table-column label="订单信息">
          <template slot-scope="scope">
            <div class="info-wrapper">
              <div class="icon-wrapper"
                   v-lazy:background-image="scope.row.img">
              </div>
              <div class="desc-wrapper">
                <div><span>订单号:{{scope.row.ocode}}</span></div>
                <div>
                  {{scope.row.name}}
                </div>
                <div v-if="scope.row.spec">规格：{{scope.row.spec}}</div>
                <div>{{scope.row | skuCurrentPrice}} X {{scope.row.count}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="收货信息">
          <template slot-scope="scope">
            <div v-if="scope.row.order_addr">
              <div>
                {{scope.row.order_addr.name}} {{scope.row.order_addr.mobile}}
              </div>
              <div>
                {{scope.row.order_addr.province}}{{scope.row.order_addr.city}}{{scope.row.order_addr.district}}{{scope.row.order_addr.town}}{{scope.row.order_addr.address}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="退款状态" width="200">
          <template slot-scope="scope">
            <div class="control-wrapper">
              <el-button size="mini" @click="goDetail(scope.row)">{{buttonText(scope.row)}}</el-button>
            </div>
            <div class="control-wrapper" v-if="lastRemark(scope.row)">
              {{lastRemark(scope.row)}}
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
  import LoadPageData from 'src/mixins/LoadPagerData'
  import * as RefundApi from 'src/api/refund'
  import { refundBtnText } from 'src/utils/refund'

  export default {
    mixins: [LoadPageData],
    props: {
      uid: '',
      queryParams: {
        type: Object,
        default: () => {
          return {
            status: 100
          }
        }
      }
    },
    data() {
      return {
        dataList: {}
      }
    },
    computed: {},
    methods: {
      getQueryApi(params) {
        if (!params.status) {
          params.status = 100
        }
        if (this.uid) {
          params.uid = this.uid
        }
        return RefundApi.getList(params)
      },
      buttonText(orderItem) {
        return refundBtnText(orderItem)
      },
      lastRemark(orderItem) {
        const rp = orderItem.refund_processes || []
        if (rp.length > 0) {
          return rp[0].sys_remark
        }
        return ''
      },
      goDetail(row) {
        this.$router.push({
          name: 'orderRefundDetail',
          params: {
            id: row.oid,
            oiid: row.id
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>

  .list-wrapper {
    margin-top: 20px;

    .info-wrapper {
      display: flex;
      padding-top: 8px;
      padding-bottom: 8px;

      .icon-wrapper {
        width: 60px;
        height: 60px;
        background-size: cover;
        margin-right: 10px;
      }

      .desc-wrapper {
        flex: 1;

      }
    }

    .control-wrapper {
    }

    .remark {
      position: relative;
      margin-top: 10px;
      margin-bottom: 10px;
      padding: 5px;
      border: solid 1px #ddd;
      border-radius: 5px;
      min-height: 50px;

      .title {
        font-size: 14px;
      }

      .edit {
        position: absolute;
        right: 10px;
        bottom: 0;
      }
    }

    .pager-wrapper {
      text-align: center;
    }
  }

</style>
