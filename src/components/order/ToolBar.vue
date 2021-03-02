<template>
  <div class="tool-bar">
    <div class="export">
      <el-button class="refunding" @click="refunding">退款中({{refundCount}})</el-button>
    </div>
  </div>
</template>

<script>
  import { getRefundingCount } from 'src/api/refund'

  export default {
    components: {},
    data() {
      return {
        refundCount: 0
      }
    },
    props: {
      customerId: {
        default: ''
      }
    },
    methods: {
      refunding() {
        this.$router.push({
          params: {uid: this.customerId},
          name: 'orderRefund'
        })
      }
    },
    async activated() {
      try {
        const resCount = await getRefundingCount(this.customerId)
        this.refundCount = resCount.data.count
      } catch (e) {
        this.$myErrorHandler.handle(this, e)
      }
    }
  }
</script>

<style lang="less" scoped>
  .tool-bar {
    height: 30px;
    margin-bottom: 20px;
  }

  .refunding {
    margin-left: 30px;
  }
  .export {
    display: inline-block;
    float: right;
  }
</style>
