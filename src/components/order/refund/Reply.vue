<template>
  <el-dialog title="回复" :visible.sync="dialogVisible" width="40%" @open="openCallback" @close="closeCallback"
             loading="loading">
    <el-form ref="formReply" :model="form" :rules="rules">
      <el-form-item prop="text">
        <el-input v-model="form.text" placeholder="请输入内容" type="textarea" :rows="3" :maxlength="maxLength"></el-input>
        <span class="input-tip">{{form.text.length}} / {{maxLength}}</span>
      </el-form-item>
      <el-form-item prop="remark" label-width="0px">
        <span>备注(消费者不可见)</span>
        <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" :rows="2" :maxlength="remarkMaxLength"></el-input>
        <span class="input-tip">{{form.remark.length}} / {{remarkMaxLength}}</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit" :disabled="!form.text">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import * as RefundApi from 'src/api/refund'

  export default {
    props: {
      oiid: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        maxLength: 100,
        remarkMaxLength: 30,
        form: {
          text: '',
          remark: ''
        },
        rules: {
          text: [
            {max: 100, message: '最大100个字符', trigger: 'blur'}
          ],
          remark: [
            {max: 30, message: '最大30个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      show() {
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },
      openCallback() {
        this.form.text = ''
        this.form.remark = ''
      },
      closeCallback() {
      },
      async submit() {
        this.$refs.formReply.validate(async (valid) => {
          if (valid) {
            this.loading = true
            try {
              const resResult = await RefundApi.reply(this.oiid, this.form.text, this.form.remark)
              this.loading = false
              this.hide()
              this.$emit('submit', resResult.data)
            } catch (e) {
              this.loading = false
              this.$myErrorHandler.handle(this, e)
            }
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
