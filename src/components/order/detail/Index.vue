<template>
  <div v-loading="loading">
    <div class="breadcrumb">
      <template v-if="$route.name !== 'CustomerOrderDetail'">
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ name: 'orderIndex' }">订单</el-breadcrumb-item>
          <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
      </template>
      <template v-else>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ name: 'customer' }">消费者</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'CustomerOrder', params: {id: $route.params.uid} }">购买记录</el-breadcrumb-item>
          <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
      </template>
    </div>
    <div class="content" v-if="model.id">
      <div class="section" style="width: 100%">
        <detail-status :order="model" @editRemark="_onEditRemark"></detail-status>
      </div>
      <div class="section">
        <detail-recipient :order="model"></detail-recipient>
      </div>
      <div class="section">
        <detail-info :order="model" :expressList="expressList" @refresh="refreshOrder"></detail-info>
      </div>

    </div>
    <edit-remark-dialog ref="dlgEditRemark" @updated="remarkUpdated"></edit-remark-dialog>
  </div>
</template>

<script>
  import DetailStatus from './Status'
  import DetailInfo from './Info'
  import DetailRecipient from './Recipient'
  import DetailTraffic from './ExpressInfo'
  import ChooseExpressDialog from './ChooseExpress'
  import EditRemarkDialog from '../EditRemark'
  import OrderApi from 'src/api/order'

  export default {
    name: 'OrderDetail',
    components: {
      DetailStatus,
      DetailInfo,
      DetailRecipient,
      DetailTraffic,
      ChooseExpressDialog,
      EditRemarkDialog
    },
    data() {
      return {
        loading: false,
        model: {},
        expressList: []
      }
    },
    methods: {
      _submit() {
      },
      _openCallback() {
        this.$nextTick(() => {
        })
      },
      _onEditRemark() {
        this.$refs.dlgEditRemark.show(this.model.id, this.model.sys_remark)
      },
      remarkUpdated(remark) {
        this.model.sys_remark = remark
      },
      async refreshOrder() {
        this.loading = true
        try {
          this.loading = true
          const res = await OrderApi.getItem(this.$route.params.id)
          this.model = res.data
          this.loading = false
        } catch (ex) {
          this.$myErrorHandler.handle(this, ex)
          this.loading = false
        }
      }
    },
    async mounted() {
      this.refreshOrder()
    }
  }
</script>

<style lang="less" scoped>

  .content {
    vertical-align: middle;
    font-size: 14px;

    .section {
      padding-bottom: 8px;
      margin-bottom: 0px;
      border-bottom: solid 1px #efefef;
    }

  }

</style>
