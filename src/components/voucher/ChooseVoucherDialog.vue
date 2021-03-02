<template>
    <el-dialog title="选择优惠券" width="50%" :visible.sync="dialogVisible">
      <div class="content" v-loading="loading">
        <choose-voucher-list ref="grdVoucher"  :allItems="dataList.data" @choose="_onChooose"
                      :newItems="newItems"></choose-voucher-list>
      </div>
      <div class="pager-wrapper" v-show="dataList.total>filterForm.limit">
        <el-pagination
          layout="total, prev, pager, next"
          :total="dataList.total"
          :current-page=filterForm.page
          :page-size="filterForm.limit"
          @current-change="changePage">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" :disabled="newItems.length === 0" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

</template>

<script>
  import ChooseVoucherList from './ChooseVoucherList.vue'
  import * as VoucherApi from 'src/api/voucher'

  export default {
    components: {
      ChooseVoucherList
    },
    props: {
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        dataList: {},
        filterForm: {
          limit: 10,
          page: 1,
          shareable: true
        },
        newItems: []
      }
    },
    computed: {
    },
    methods: {
      show() {
        this.newItems = []
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },
      _onChooose(item) {
      },
      submitForm() {
        if (this.newItems.length > 10) {
          this.$message({
            showClose: true,
            message: '最多可选10张',
            type: 'info'
          })
          return
        }
        this.loading = true
        VoucherApi.genPackageShareUrl(this.newItems)
          .then((res) => {
            this.loading = false
            let shareUrl = res.data.share_url
            const h = this.$createElement
            this.$msgbox({
              title: '优惠券礼包链接',
              closeOnClickModal: false,
              message: h('div', null, [
                h('div', {style: 'word-break: break-all;'}, shareUrl),
                h('div', {style: 'margin-top: 10px'}, '请达人点击使用，直接转发此链接无效')
              ]),
              confirmButtonText: '知道了'
            }).then((action) => {
              this.hide()
            })
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err, err)
          })
      },
      changePage (current) {
        this.filterForm.page = current
        this.refreshListForm()
      },
      async refreshListForm() {
        this.loading = true
        try {
          const res = await VoucherApi.getPackageList(this.filterForm)
          this.dataList = res.data
          this.loading = false
        } catch (err) {
          this.loading = false
          this.$myErrorHandler.handle(this, err, '查询失败')
        }
      }
    },
    watch: {
      dialogVisible: function (newValue, oldValue) {
        if (newValue) {
          this.refreshListForm()
        } else {
          this.filterForm = {
            limit: 10,
            page: 1,
            shareable: true
          }
        }
      }
    },
    created() {
    }
  }
</script>

<style scoped lang="less">

  .content {
    clear: both;
  }

</style>

