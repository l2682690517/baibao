<template lang="pug">
  div
    el-dialog.dialog(title="关店?", width="40%",  :visible.sync="dialogVisible" , @close="closeCallback")
      el-form(ref="form", :model="formData", :rules="rules", labelWidth="60px")
        el-form-item(label="店铺ID:", v-if="shop") {{ shop.id }}
        el-form-item(label="退费:", prop="amount")
          span.input
            el-input(v-model.trim="formData.amount")
          span 最多可退{{ limitAmount | price(false) }}元
        el-form-item(labelWidth="0")
          span.warn 提醒：开店优惠券被使用时不能关店
      div.dialog-footer(slot="footer")
        el-button(size="medium", @click="dialogVisible = false") 取消
        el-button(size="medium", type="primary", :loading="loading", @click="submit") 确定


</template>


<script>

  import ShopApi from 'src/api/shop'
  import { convertYuanToFen } from 'src/utils/moneyUtil'

  export default {
    data () {
      const validateAmount = async (rule, value, callback) => {
        if (this.formData.amount) {
          let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
          if (reg.test(this.formData.amount)) {
            let p = parseFloat(this.formData.amount)
            if (p < 0) {
              callback(new Error('退费不能小于0'))
              return
            }
            let fen = convertYuanToFen(p)
            if (fen > this.limitAmount) {
              callback(new Error('超过最大限制'))
            }
            callback()
          } else {
            callback(new Error('请输入正确的价格'))
          }
        }
        callback()
      }
      return {
        loading: false,
        dialogVisible: false,
        shop: null,
        limitAmount: 0,
        formData: {
          amount: ''
        },
        rules: {
          amount: [
            {required: true, message: '请输入价格', trigger: 'blur'},
            {validator: validateAmount, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {},
    methods: {
      async show (shop) {
        try {
          this.shop = shop
          const resData = await ShopApi.readyCloseShop(this.shop.id)
          this.limitAmount = resData.data.amount
          this.dialogVisible = true
        } catch (err) {
          this.$myErrorHandler.handle(this, err)
        }
      },
      hide () {
        this.dialogVisible = false
      },
      closeCallback () {
        this.$refs.form.resetFields()
        this.shop = null
      },
      async submit () {
        this.$refs.form.validate(async (validFrom) => {
          if (validFrom) {
            this.loading = true
            try {
              await ShopApi.closeShop(this.shop.id, this.formData)
              this.$message({
                message: `店铺ID:${this.shop.id} 关店成功`,
                showClose: true,
                type: 'success'
              })
              this.$emit('refresh')
              this.hide()
            } catch (err) {
              this.$myErrorHandler.handle(this, err)
            } finally {
              this.loading = false
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .input {
    display: inline-block;
    width: 150px;
    margin-right: 5px;
  }

  .input-remark {
    display: inline-block;
    width: 680px;
    margin-right: 5px;
  }

  .warn {
    color: red;
  }

</style>

