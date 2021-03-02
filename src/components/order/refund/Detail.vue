<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/order' }">订单</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'orderDetail' ,params: {id: $route.params.id} }">订单详情</el-breadcrumb-item>
      <el-breadcrumb-item>退款详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="left">
        <div>
          <div class="txt-info">
            <div class="icon" v-lazy:background-image="data.img">

            </div>
            <div><span>订单编号：</span>{{data.ocode}}</div>
            <div v-if="data.spec"><span>规格：</span>{{data.spec}}</div>
            <div><span>金额：</span>{{data | skuCurrentPrice}} × {{data.count}}</div>
            <div><span>达人利润：</span>{{data.profit | price}}</div>
            <div>
              <span v-if="!data.dev_status">物流：{{devStatusText}}</span>
              <span v-else>物流：<el-button type="text" @click="showExpress">
                {{devStatusText}}
              </el-button></span>
            </div>
            <div class="voucher-wrapper">
              <div><span>分摊优惠：</span>{{data.share_fee | price}}</div>
              <div><span>优惠总额：</span>{{data.share_total_fee | price}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div v-if="isActionVisible">
          <el-button size="small" type="primary" @click="reply">回复</el-button>
          <el-button size="small" type="primary" @click="reject">拒绝退款</el-button>
          <el-button size="small" type="danger" @click="agree">同意退款</el-button>
        </div>
        <div>
          <messge-item v-for="item in data.refund_processes" :data="item" :key="item.id"></messge-item>
        </div>
      </div>
    </div>
    <reply ref="reply" :oiid="data.id" @submit="replySuccess"></reply>
    <reject ref="reject" :oiid="data.id" @submit="rejectSuccess"></reject>
    <agree ref="agree" :orderItem="data" @submit="agreeSuccess"></agree>
    <oi-express-dialog ref="dlgExpress"></oi-express-dialog>
  </div>
</template>

<script>
  import MessgeItem from './MessageItem'
  import Reply from './Reply'
  import Reject from './Reject'
  import Agree from './Agree'
  import OiExpressDialog from 'src/components/order/express/OiIndex.vue'
  import * as RefundStatus from 'src/constants/refund'
  import * as RefundApi from 'src/api/refund'
  import OrderApi from 'src/api/order'

  export default {
    name: 'RefundDetail',
    components: {
      MessgeItem,
      Reply,
      Reject,
      Agree,
      OiExpressDialog
    },
    data() {
      return {
        data: {},
        isSigned: false
      }
    },
    computed: {
      devStatusText() {
        if (this.data.dev_status === 1) {
          return this.isSigned ? '已签收' : '已发货'
        } else {
          return '未发货(可能有延迟，请在ERP系统中核实)'
        }
      },
      isActionVisible() {
        return this.data.refund_status === RefundStatus.STATUS_WAIT_ADMIN || this.data.refund_status === RefundStatus.STATUS_WAIT_CUSTOMER
      }
    },
    methods: {
      reply() {
        this.$refs.reply.show()
      },
      reject() {
        this.$refs.reject.show()
      },
      async agree() {
        const resRefund = await RefundApi.getItem(this.$route.params.oiid)
        this.data = resRefund.data
        this.$refs.agree.show()
      },
      replySuccess(result) {
        this.data.refund_processes.unshift(result)
      },
      rejectSuccess(result) {
        this.data.refund_processes.unshift(result)
        this.data.refund_status = RefundStatus.STATUS_REJECTED
      },
      agreeSuccess(result) {
        this.data.refund_processes.unshift(result)
        this.data.refund_status = RefundStatus.STATUS_AGREED
      },
      showExpress() {
        this.$refs.dlgExpress.show(this.data.id)
      }
    },
    async mounted() {
      const resRefund = await RefundApi.getItem(this.$route.params.oiid)
      this.data = resRefund.data
      if (this.data.dev_status === 1) {
        try {
          const resExpress = await OrderApi.getOiExpress(this.data.id)
          if (resExpress.data.deliverystatus === '4') {
            this.isSigned = true
          }
        } catch (e) {}
      }
    }
  }
</script>

<style lang="less" scoped>

  .content {
    display: flex;

    .left {
      width: 200px;
      & > div {
        border: solid 1px #efefef;
        padding: 10px;
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      width: 550px;
      margin-left: 30px;

      & > div:last-child {
        flex: 1;
      }

      & > div:first-child {
        margin-bottom: 10px;
      }
    }

    .voucher-wrapper {
      margin-top: 5px;
      padding: 10px;
      border: solid 1px #efefef;
    }
  }

  .txt-info {
    margin-top: 8px;

    & > div {
      padding-top: 5px;
      padding-bottom: 5px;
    }

    .icon {
      width: 100px;
      height: 100px;
      margin-bottom: 8px;
      background-size: cover;
      background-image: url("http://temp.im/754x754");
    }
  }


</style>
