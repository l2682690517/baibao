<template>
  <el-dialog title="修改备注" v-model="dialogVisible" size="tiny" @close="_closeCallback" :loading="loading">
    <el-form ref="formRemark" :model="form">
      <el-form-item prop="remark">
        <el-input v-model="form.remark" placeholder="请输入内容" type="textarea" :rows="3"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="_submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import OrderApi from 'src/api/order'

  export default {
    data() {
      return {
        loading: false,
        dialogVisible: false,
        id: 0,
        form: {
          remark: ''
        }
      }
    },
    methods: {
      show(id, originalRemark) {
        this.id = id
        this.dialogVisible = true
        this.form = {remark: originalRemark}
      },
      hide() {
        this.dialogVisible = false
      },
      _submit() {
        this.$refs.formRemark.validate(async (valid) => {
          if (valid) {
            this.loading = true
            try {
              await OrderApi.editSysRemark(this.id, this.form.remark)
              this.loading = false
              this.$emit('updated', this.form.remark)
              this.$message({
                showClose: true,
                message: '编辑成功',
                type: 'info'
              })
              this.hide()
            } catch (ex) {
              this.loading = false
            }
          }
        })
      },
      _closeCallback() {
        this.$refs.formRemark && this.$refs.formRemark.resetFields()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
