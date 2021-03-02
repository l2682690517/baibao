<template>
    <el-form :inline="true">
      <el-form-item label="退款状态:">
        <el-select class="status-select" v-model="model.status">
          <el-option
            v-for="item in refundOptionsStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称:">
        <el-input v-model="model.pn"></el-input>
      </el-form-item>
      <el-form-item label="买家手机:">
        <el-input  class="mobile" v-model="model.mobile" :maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="订单编号:">
        <el-input v-model="model.code"></el-input>
      </el-form-item>
      <el-form-item label="物流单号:">
        <el-input v-model="model.del_no"></el-input>
      </el-form-item>
      <el-form-item label="买家姓名:">
        <el-input class="name" v-model="model.name" :maxlength="4"></el-input>
      </el-form-item>
      <el-form-item label="下单时间:">
        <date-tool-bar :oratimeRange="oratimeRange" ref="datetoolbar" @change="_dateChanged"></date-tool-bar>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="_submit">搜&nbsp;索</el-button>
      </el-form-item>
    </el-form>
</template>

<script>
  import DateToolBar from 'src/common/widgets/DateToolBar'
  import {
    REFUND_STATUS_WAIT_ADMIN,
    REFUND_STATUS_WAIT_CUSTOMER
  } from 'src/constants/orderItem'
  const STATUS_WAIT_SEND = 0

  export default {
    components: {DateToolBar},
    STATUS_WAIT_SEND,
    props: {
      model: {
        type: Object,
        default: () => {
          return {
            status: '100',
            code: '', // 订单编号
            name: '', // 买家姓名
            mobile: '', // 买家手机号
            del_no: '',  // 物流单号
            pn: '', // 商品名称
            orderStartTime: '',  // 下单时间开始
            orderEndTime: ''  // 时间结束
          }
        }
      }
    },
    data() {
      return {
        oratimeRange: [],
        refundOptionsStatus: [
          {
            value: '100',
            label: '全部'
          }, {
            value: REFUND_STATUS_WAIT_CUSTOMER + '',
            label: '请买家处理退款'
          }, {
            value: REFUND_STATUS_WAIT_ADMIN + '',
            label: '等待处理退款'
          }
        ]
      }
    },
    methods: {
      _submit() {
        this.$emit('submit', this.model)
      },
      _dateChanged(val) {
        if (val) {
          const dates = val
          this.model.orderStartTime = dates[0]
          this.model.orderEndTime = dates.length > 1 ? dates[1] : ''
        } else {
          this.model.orderStartTime = ''
          this.model.orderEndTime = ''
        }
      },
      reset() {
        this.model.status = '100'
        this.model.code = ''
        this.model.name = ''
        this.model.mobile = ''
        this.model.del_no = ''
        this.model.pn = ''
        this.orderStartTime = ''
        this.orderEndTime = ''
        this.$refs.datetoolbar.reset()
      }
    }
  }
</script>

<style lang="less" scoped>

  .title {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #48576a;
    line-height: 1;
    box-sizing: border-box;
  }

  .status-select {
    width: 120px
  }
  .mobile {
    width: 120px;
  }
  .name {
    width: 100px;

  }

</style>
