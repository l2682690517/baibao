<template>

  <div class="recipient">
    <div class="items-wrapper">
      <div class="info-item-wrapper">
        <div class="txt-info">
          <div class="txt-info"><span>买家：</span>{{order.addr.name}}&nbsp;&nbsp;{{order.addr.mobile}}&nbsp;&nbsp;
          {{order.addr.province}}{{order.addr.city}}{{order.addr.district}}{{order.addr.town}}{{order.addr.address}}
          </div>
          <div class="txt-info" v-if="order.remark"><span>留言：</span>{{order.remark}}</div>
          <div class="txt-info" v-if="order.idcard"><span>身份证号：</span>{{order.idcard}}</div>
        </div>
        <div class="txt-info" style="border-left:1px #efefef solid;">
          <div class="txt-info txt-info-time"><span>下单时间：</span>{{order.ct | datetime}}</div>
          <div class="txt-info txt-info-time" v-if="order.pt"><span>付款时间：</span>{{order.pt | datetime}}</div>
          <div class="txt-info txt-info-time" v-if="order.dt"><span>发货时间：</span>{{order.dt | datetime}}</div>
          <div class="txt-info txt-info-time" v-if="order.rt"><span>收货时间：</span>{{order.rt | datetime}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      order: {
        type: Object,
        default() {
          return {}
        }
      }
    }
  }
</script>

<style lang="less" scoped>

  .txt-info {
    margin-top: 8px;
  }
  .txt-info-time {
    width: 200px;
    min-width: 200px;
    text-align: right;
  }
  .item {
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .items-wrapper {
    padding-top: 0px;
    .info-item-wrapper {
      display: flex;
      justify-content: space-between;
      padding: 0px;
    }

  }
</style>
