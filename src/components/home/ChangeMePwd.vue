<template>
  <el-dialog title="修改密码" width="40%" :visible.sync="dialogVisible">
    <el-form ref="changePwdForm" v-loading="loading" :model="form" :rules="rules">
      <el-form-item label="原密码" prop="oldPwd">
        <el-input type="password" v-model="form.oldPwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input type="password" v-model="form.newPwd"></el-input>
      </el-form-item>
      <el-form-item label="确定新密码" prop="confirmNewPwd">
        <el-input type="password" v-model="form.confirmNewPwd"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="changePwd">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import auth from '../../api/auth'

  export default {
    data() {
      const validateSamePwd = (rule, value, callback) => {
        if (this.form.newPwd && this.form.confirmNewPwd) {
          if (this.form.newPwd === this.form.confirmNewPwd) {
            callback()
          } else {
            callback(new Error('两次输入密码不一致'))
          }
        }
        callback()
      }
      return {
        loading: false,
        form: {
          oldPwd: '',
          newPwd: '',
          confirmNewPwd: ''
        },
        dialogVisible: false,
        rules: {
          oldPwd: [
            {required: true, message: '请输入原密码', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur,change'}
          ],
          newPwd: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur,change'},
            {validator: validateSamePwd, trigger: 'blur'}
          ],
          confirmNewPwd: [
            {required: true, message: '请确认新密码', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur,change'},
            {validator: validateSamePwd, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      show() {
        this.dialogVisible = true
      },
      changePwd() {
        this.$refs.changePwdForm.validate((valid) => {
          if (valid) {
            this.loading = true
            auth.changeMePwd(this.form.oldPwd, this.form.newPwd)
              .then((res) => {
                this.loading = false
                this.$message({
                  message: '修改密码成功',
                  type: 'success',
                  showClose: true
                })
                this.dialogVisible = false
              })
              .catch((err) => {
                this.loading = false
                this.$refs.changePwdForm.resetFields()
                this.$myErrorHandler.handle(this, err, '修改密码失败')
              })
          }
        })
      }
    },
    watch: {
      dialogVisible: function (newVal, oldVal) {
        if (newVal) {
          try {
            this.$refs.changePwdForm.resetFields()
          } catch (err) {}
        }
      }
    }
  }

</script>

<style lang="less">

</style>
