<template>
  <div>
    <div>
      <el-table class="list-wrapper" :data="order.items" border row-key="id"
                v-loading="loading"
                element-loading-text="加载中">
        <el-table-column label="商品" min-width="500">
          <template slot-scope="scope">
            <div class="info-wrapper">
              <div class="icon-wrapper" v-lazy:background-image="scope.row.img">
              </div>
              <div class="name">
                {{scope.row.name}} ,&nbsp;
                <span v-if="scope.row.spec">
                  <span>规格：</span>{{scope.row.spec}},&nbsp;</span>
                  <span>{{scope.row | skuCurrentPrice}} x {{scope.row.count}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="退款状态" width="210" v-if="hasRefund">
          <template slot-scope="scope">
            <div class="status">
              <el-button type="text" @click="goRefundDetail(scope.row)" v-if="refundBtnText(scope.row)">
                {{refundBtnText(scope.row)}}
              </el-button>
            </div>
            <div class="status" v-if="enableRefundToWx(scope.row)">
              <el-button type="text" @click="refundToWx(scope.row)">
                退款至微信
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="物流状态" width="210">
          <template slot-scope="scope">
            <div class="status">
              <div v-if="scope.row.dev_status === 1">
                <el-button type="text" @click="showExpress(scope.row)">已发货(点击查看物流信息)</el-button>
              </div>
              <div v-else>待发货</div>
              <div v-if="scope.row.dev_status === 1"><span>{{scope.row.dt | datetime}}</span></div>
            </div>
          </template>
        </el-table-column>


      </el-table>
    </div>
    <div class="items-wrapper">
      <div class="info-item-wrapper">
        <div class="txt-info"></div>
        <div class="txt-info">
          <span>商品金额：</span>{{order.product_total_price | price}},&nbsp;&nbsp;
          <span>优惠券：</span>{{Math.abs(order.share_fee)| price}},&nbsp;&nbsp;
          <span>运费：</span>{{order.postage | price}},&nbsp;&nbsp;
          <span>实付：</span>{{order.total_price | price}},&nbsp;&nbsp;
          <span>达人利润：</span>{{order.profit | price}}
        </div>
      </div>
    </div>
    <express-dialog ref="dlgExpress"></express-dialog>
    <agree ref="agree" :orderItem="currentOrderItem" @submit="agreeSuccess"></agree>
  </div>
</template>

<script>
  import ExpressDialog from '../express/Index'
  import OrderUtil from 'src/utils/orderUtil'
  import * as RefundUtil from 'src/utils/refund'
  import Agree from 'src/components/order/refund/Agree.vue'
  import { REFUND_STATUS_NO_APPLY } from 'src/constants/orderItem'
  import OrderApi from 'src/api/order'
  import * as RefundApi from 'src/api/refund'

  export default {
    props: {
      order: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    components: {
      ExpressDialog,
      Agree
    },
    data() {
      return {
        currentOrderItem: {},
        loading: false
      }
    },
    computed: {
      hasRefund() {
        console.log(this.order)
        return OrderUtil.hasRefund(this.order)
      }
    },
    methods: {
      showExpress(orderItem) {
        this.$refs.dlgExpress.show(this.order.id, orderItem.dev_name, orderItem.dev_no)
      },
      refundBtnText(orderItem) {
        const text = RefundUtil.refundBtnText(orderItem)
        if (text === '申请退款') {
          return ''
        }
        return text
      },
      enableRefundToWx(orderItem) {
        return RefundUtil.enableRefundToWx(orderItem)
      },
      async goRefundDetail(row) {
        if (row.refund_status === REFUND_STATUS_NO_APPLY) {
          const resRefund = await OrderApi.getChildItem(row.oid, row.id)
          this.currentOrderItem = resRefund.data
          this.$refs.agree.show()
        } else {
          this.$router.push({
            name: 'orderRefundDetail',
            params: {
              id: row.oid,
              oiid: row.id
            }
          })
        }
      },
      agreeSuccess() {
        this.$emit('refresh')
      },
      refundToWx(row) {
        this.$confirm('退款至微信?').then(async () => {
          try {
            this.loading = true
            await RefundApi.refundToWx(row.oid, row.id)
            this.$message({
              showClose: true,
              message: '退款已成功',
              type: 'success'
            })
            this.$emit('refresh')
          } catch (e) {
            this.$myErrorHandler.handle(this, e)
          } finally {
            this.loading = false
          }
        }).catch(() => {})
      }
    }
  }
</script>

<style lang="less" scoped>

  .title {
    color: #48576a;
    line-height: 1;
    padding: 11px 12px 11px 0;
    box-sizing: border-box;
  }

  .list-wrapper {
    margin-top: 5px;
    .info-wrapper {
      display: flex;
      padding-top: 8px;
      padding-bottom: 8px;
      .icon-wrapper {
        padding-right: 5px;
        padding-top: 5px;
        width: 60px;
        height: 60px;
        background-size: cover;
      }
    }
  }

  .items-wrapper {
    padding-top: 5px;
    .info-item-wrapper {
      display: flex;
      padding-bottom: 5px;
      justify-content: space-between;
      text-align:right;
      padding-top: 5px;
    }

  }
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
        background-image: url("~@/assets/img/dianpu_img.png") !important;
      }
    }

    .name {
      flex: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-height: 17px;
      max-height: 34px;
      padding-left: 5px;
      text-overflow: ellipsis;
      word-break: break-all;
      overflow: hidden;
    }
  }
</style>
