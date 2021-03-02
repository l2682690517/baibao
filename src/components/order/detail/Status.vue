<template>
  <div>
    <div class="status">
      <span class="section-title">订单状态:</span><span>{{order | orderFullStatus}}</span>&nbsp;&nbsp;
      <span class="section-title">订单编号:</span><span style="margin-right: 15px">{{order.code}}</span>
      <span class="section-title">消费者ID:</span><span style="margin-right: 15px">{{order.uid}}</span>
      <span class="section-title">店铺ID:</span><span>{{order.spid}}</span>
    </div>
    <div class="remark-wrapper" v-show="false">
      <span class="title">备注:</span>
      <span>{{order.sys_remark}}</span>
      <span class="edit">
            <el-button type="text" icon="el-icon-edit" @click="_editRemark"></el-button>
      </span>
    </div>
  </div>
</template>

<script>
  import OrderUtil from '../../../utils/orderUtil'

  export default {
    props: {
      order: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    components: {},
    computed: {
      _deliverButtonText () {
        if (OrderUtil.checkPartDeliver(this.order)) {
          return '继续发货'
        } else {
          return '发货'
        }
      }
    },
    methods: {
      _sendProduct () {
        this.$emit('sendProduct')
      },
      _editRemark () {
        this.$emit('editRemark')
      }
    }
  }
</script>

<style lang="less" scoped>

  .status {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .control {
    margin-left: 5px;
  }

  .remark-wrapper {
    position: relative;
    margin-top: 8px;
    border: solid 1px #eeeeee;
    padding: 5px;
    border-radius: 5px;
    font-size: 12px;
    min-height: 50px;

    .edit {
      position: absolute;
      right: 10px;
      bottom: 0;
    }
  }

</style>
