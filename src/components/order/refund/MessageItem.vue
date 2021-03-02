<template>
  <div class="item">
    <div><span>{{title}}</span><span class="time txt-info">{{data.ct | datetime}}</span></div>
    <div v-if="data.status === 5 && data.is_refund_voucher"><span>优惠券已退回</span></div>
    <div v-if="data.status === 5"><span>{{data.amount|price}}将由微信原路退给买家</span></div>
    <div v-if="data.status === 5"><span>{{data.profit|price}}利润被追回</span></div>
    <div class="txt-info">{{data.txt}}</div>
    <div v-if="data.sys_remark">
      <div class="txt-info txt-info-tip">以下内容消费者不可见</div>
      <div ><span>{{data.sys_user_name}}:{{data.sys_remark}}</span></div>
    </div>
    <div v-if="data.tp === 1" class="txt-info">申请退款 {{data.amount | price}}</div>
    <div class="images">
      <div v-for="(imgItem,index) in data.images" v-lazy:background-image="imgItem"
           @click="previewImage(imgItem)"></div>
    </div>
    <image-preview-dialog ref="dlgPreview"></image-preview-dialog>
  </div>
</template>

<script>
  import * as RefundStatus from 'src/constants/refund'
  import ImagePreviewDialog from 'src/common/widgets/ImagePreviewDialog'

  export default{
    components: {
      ImagePreviewDialog
    },
    props: {
      data: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {}
    },
    computed: {
      title() {
        if (this.data.status === RefundStatus.STATUS_CANCELED) {
          return '买家：退款已撤销'
        } else if (this.data.status === RefundStatus.STATUS_AGREED) {
          return '诚之优品：退款成功'
        } else if (this.data.status === RefundStatus.STATUS_REJECTED) {
          return '诚之优品：退款已撤销'
        } else {
          if (this.data.tp === 1) {
            if (this.data.parent_id === 0) {
              return '买家申请退款'
            } else {
              return '买家：申请已修改'
            }
          } else if (this.data.tp === 2) {
            return '诚之优品回复'
          } else {
            return ''
          }
        }
      }
    },
    methods: {
      previewImage(imgItem) {
        this.$refs.dlgPreview.show(imgItem)
      }
    }
  }
</script>

<style lang="less" scoped>

  .item {
    margin-bottom: 10px;
    padding: 10px;
    border: solid 1px #efefef;

    & > div {
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }

  }

  .time {
    margin-left: 10px;
  }

  .images {
    & > div {
      display: inline-block;
      width: 100px;
      height: 100px;
      margin-right: 8px;
      background-size: cover;
      background-image: url("http://temp.im/754x754");
    }
  }
  .txt-info-tip {
    font-size: 12px;
    padding: 15px 0px;
  }

</style>
