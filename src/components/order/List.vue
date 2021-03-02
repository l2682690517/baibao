<template>
  <div class="list-wrapper">
    <el-table :data="dataList.data" :border="true" row-key="id"
              v-loading="loading"
              element-loading-text="加载中">
      <el-table-column label="订单信息" width="">
        <template slot-scope="scope">
          <div class="info-wrapper">
            <div class="head-wrapper" v-if="scope.row.items && scope.row.items.length > 0">
              <div class="icon-wrapper"
                   v-lazy:background-image="scope.row.items[0].cover || scope.row.items[0].img">
              </div>
            </div>
            <div class="desc-wrapper">
              <div>订单号:<span class="txt-blod">{{scope.row.code}}</span> <span>&nbsp;&nbsp;({{scope.row | orderFullStatus}})&nbsp;&nbsp;<span>{{scope.row.ct | datetime}}下单</span> </span>
              </div>
              <div class="name-wrapper">
                <div class="left">{{scope.row.items[0].name}}</div>
                <div class="right">{{countPurchased(scope.row)}}件商品</div>
              </div>
              <div>
                <span>实付:{{scope.row.total_price | price}}</span>
                <span
                  v-if="queryParams.status === '3'  && scope.row.items.length > 1 && countDelivered(scope.row.items) >0 ">&nbsp;{{countDelivered(scope.row.items)}}/{{scope.row.items.length}}已发货</span>&nbsp;&nbsp;
                <span class="txt-blod" v-if="scope.row.refunding_count">{{scope.row.refunding_count}}件退款中</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="买家信息" width="334">
        <template slot-scope="scope">
          <div v-if="scope.row.addr">
            <div>
              {{scope.row.addr.name}} {{scope.row.addr.mobile}}
            </div>
            <div v-if="scope.row.remark">
              留言:{{scope.row.remark}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="119">
        <template slot-scope="scope">
          <div class="control-wrapper">
            <el-button class="btn" size="mini" @click="_goToDetail(scope.row.id)">订单详情</el-button>
            <el-button style="margin-left: 0;width: 80px" v-if="scope.row.dev_count > 0" size="mini" type="primary"
                       @click="openExpress(scope.row.id)">
              {{scope.row.dev_count}}件快递
            </el-button>
            <el-tooltip placement="bottom" effect="light" v-if="scope.row.reminds && scope.row.reminds.length > 0">
              <div slot="content">
                <div v-for="remind in scope.row.reminds" :key="remind.id">{{remind.ct | datetime}}</div>
              </div>
              <el-button class="btn" type="text" size="mini">{{scope.row.reminds.length}}次催单</el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom-tool-bar">
      实付合计: {{showPrice(dataList.stat)}} &nbsp;&nbsp; 商品数量: {{showSold(dataList.stat)}}
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
    <express-dialog ref="dlgExpress"></express-dialog>
  </div>
</template>

<script>
  import LoadPageData from '../../mixins/LoadPagerData'
  import OrderApi from '../../api/order'
  import CustomerApi from 'src/api/customer'
  import OrderUtil from '../../utils/orderUtil'
  import ExpressDialog from './express/Index.vue'
  import { getShowPrice } from '../../utils/moneyUtil'
  import { getShowCount } from '../../utils/numberUtil'

  const MODE_DEFAULT = 'default'
  const MODE_CUSTOMER = 'customer'

  export default {
    mixins: [LoadPageData],
    components: {
      ExpressDialog
    },
    props: {
      mode: {
        type: String,
        default: MODE_DEFAULT
      },
      queryParams: {
        type: Object,
        default: () => {
          return {
            status: 3
          }
        }
      },
      customerId: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        dataList: {}
      }
    },
    methods: {
      getQueryApi (params) {
        if (this.mode === MODE_CUSTOMER) {
          return CustomerApi.getOrderList(this.customerId, params)
        } else {
          return OrderApi.getList(params)
        }
      },
      showPrice (stat) {
        let price = 0
        if (stat && stat.sum) {
          price = stat.sum
        }
        return getShowPrice(price)
      },
      showSold (stat) {
        let sold = 0
        if (stat && stat.count) {
          sold = stat.count
        }
        return getShowCount(sold)
      },
      _goToDetail (id) {
        if (this.mode !== MODE_CUSTOMER) {
          this.$router.push({
            name: 'orderDetail',
            params: {
              id: id
            }
          })
        } else {
          this.$router.push({
            name: 'CustomerOrderDetail',
            params: {
              uid: this.$route.params.uid,
              id: id
            }
          })
        }
      },
      _chooseExpressCompleted () {
        this.loadDataList()
      },
      _deliverButtonText (order) {
        return OrderUtil.checkPartDeliver(order) ? '继续发货' : '发货'
      },
      openExpress (id) {
        this.$refs.dlgExpress.show(id)
      },
      remarkUpdated () {
        this.loadDataList()
      },
      countDelivered (items) {
        let count = 0
        items.forEach((item) => {
          if (item.dev_status === 1) {
            count++
          }
        })
        return count
      },
      countPurchased (prod) {
        let count = 0
        if (prod.items instanceof Array) {
          prod.items.forEach((item) => {
            count += item.count
          })
        }
        return count
      }
    }
  }
</script>

<style lang="less" scoped>

  .list-wrapper {
    margin-top: 20px;
    .info-wrapper {
      display: flex;

      .head-wrapper {
        width: 70px;
        margin-right: 10px;
      }
      .icon-wrapper {
        width: 60px;
        height: 60px;
        background-size: cover;
        margin: 5px 10px 5px 0px;
      }

      .desc-wrapper {
        flex: 1;

        .name-wrapper {
          display: flex;

          .left {
            flex: 1;
            max-height: 28px;
            width: 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
          }
          .right {
            padding-left: 5px;
          }
        }
      }
    }

    /*.control-wrapper {*/
    /*:first-child {*/
    /*margin-left: 10px;*/
    /*}*/
    /*}*/

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

    .txt-blod {
      font-size: 14px;
      font-weight: bold;
    }
  }

  .bottom-tool-bar {
    margin-top: 15px;
  }
</style>
