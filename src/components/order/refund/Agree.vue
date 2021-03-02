<template>
  <el-dialog title="同意退款" :visible.sync="dialogVisible" size="tiny" @open="openCallback" @close="closeCallback"
             loading="loading">
    <el-form ref="formAgree" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="退款金额" prop="amount">
        <div>
          <span class="input">
                <el-input v-model="form.amount"></el-input>
          </span>
        </div>
      </el-form-item>
      <div style="color: rgb(153, 153, 153);font-size: 12px;margin-bottom: 10px">
        <span>最多退款{{orderItem.total_price + orderItem.order_postage | price}}</span>
        <span>，其中商品金额{{orderItem.total_price | price}}</span>
        <span>，{{orderItem.count }}</span>
        <span>件商品运费总额{{orderItem.order_postage | price}}</span>
      </div>
      <el-form-item label="" prop="can_refund_voucher" v-if="orderItem.can_refund_voucher">
        <div>
          <el-checkbox v-model="form.is_refund_voucher">退回优惠券</el-checkbox>
        </div>
      </el-form-item>
      <el-form-item label="追回利润" prop="profit">
        <div>
          <span class="input">
                <el-input v-model="form.profit"></el-input>
          </span>
          <span>最多最多{{orderItem.profit | price}}</span>
        </div>
      </el-form-item>
      <el-form-item prop="txt" label-width="0px">
        <el-input v-model="form.txt" placeholder="请输入内容" type="textarea" :rows="3" :maxlength="maxLength"></el-input>
        <span class="input-tip">{{form.txt.length}} / {{maxLength}}</span>
      </el-form-item>
      <el-form-item prop="remark" label-width="0px">
        <span>备注(消费者不可见)</span>
        <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" :rows="2"
                  :maxlength="remarkMaxLength"></el-input>
        <span class="input-tip">{{form.remark.length}} / {{remarkMaxLength}}</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import * as MoneyUtil from 'src/utils/moneyUtil'
  import * as RefundApi from 'src/api/refund'

  export default {
    components: {},
    props: {
      orderItem: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      const validateAmount = (rule, value, callback) => {
        if (value) {
          if (MoneyUtil.checkIsMoney(value)) {
            if (parseFloat(value) <= 0) {
              callback(new Error('价格必须大于0'))
              return
            }
          } else {
            callback(new Error('请输入适合的数字'))
          }
          if (MoneyUtil.convertYuanToFen(value) > (this.orderItem.total_price + this.orderItem.order_postage)) {
            callback(new Error('请输入适合的数字'))
          }
        }
        callback()
      }
      const validateProfit = (rule, value, callback) => {
        if (value) {
          if (MoneyUtil.checkIsMoney(value)) {
            if (parseFloat(value) < 0) {
              callback(new Error('价格不能小于0'))
              return
            }
          } else {
            callback(new Error('请输入适合的数字'))
          }
          if (MoneyUtil.convertYuanToFen(value) > this.orderItem.profit) {
            callback(new Error('请输入适合的数字'))
          }
        }
        callback()
      }
      return {
        loading: false,
        dialogVisible: false,
        form: {
          txt: '',
          amount: '',
          profit: '',
          is_refund_voucher: false,
          remark: ''
        },
        rules: {
          amount: [
            {required: true, message: '请输入适合的数字', trigger: 'blur'},
            {validator: validateAmount, trigger: 'blur'}
          ],
          profit: [
            {required: true, message: '请输入适合的数字', trigger: 'blur'},
            {validator: validateProfit, trigger: 'blur'}
          ],
          txt: [
            {max: 100, message: '最大100个字符', trigger: 'blur'}
          ],
          remark: [
            {max: 30, message: '最大30个字符', trigger: 'blur'}
          ]
        },
        maxLength: 100,
        remarkMaxLength: 30
      }
    },
    methods: {
      show () {
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      openCallback () {
        this.form = {
          txt: '',
          amount: '',
          remark: '',
          profit: '',
          is_refund_voucher: false
        }
      },
      closeCallback () {
        this.$refs.formAgree.resetFields()
      },
      submit () {
        this.$refs.formAgree.validate(async (valid) => {
          if (valid) {
            this.$confirm('同意退款', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              this.loading = true
              try {
                const resResult = await RefundApi.agree(this.orderItem.id, MoneyUtil.convertYuanToFen(this.form.amount), MoneyUtil.convertYuanToFen(this.form.profit), this.form.txt, this.form.is_refund_voucher, this.form.remark)
                this.$emit('submit', resResult.data)
                this.loading = false
                this.hide()
              } catch (e) {
                this.loading = false
                this.$myErrorHandler.handle(this, e)
              }
            }).catch(() => {})
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .input {
    display: inline-block;
    width: 150px;
    margin-right: 5px;
  }
</style>
