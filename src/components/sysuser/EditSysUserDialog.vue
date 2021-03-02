<template>
  <el-dialog :title="title" width="40%" :visible.sync="dialogVisible">
    <el-form ref="sysUserForm" v-loading="loading" :model="form" :rules="rules">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="passwd">
        <el-input type="password" v-model="form.passwd"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="_submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import SysUserApi from '../../api/sysuser'
  import Vue from 'vue'

  const MODE_EDIT = 0
  const MODE_CREATE = 1

  export default {
    MODE_EDIT,
    MODE_CREATE,
    props: {
      mode: {
        type: Number,
        default: 0
      },
      editId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        form: {
          name: '',
          mobile: '',
          passwd: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入名字', trigger: 'blur'},
            {max: 20, message: '长度在需要小于20 个字符', trigger: 'blur,change'}
          ],
          mobile: [
            {required: true, message: '手机号码', trigger: 'blur'}
          ],
          passwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur,change'}
          ]
        }
      }
    },
    computed: {
      title() {
        if (this.mode === MODE_EDIT) {
          return '编辑管理员'
        } else {
          return '创建管理员'
        }
      }
    },
    watch: {
      dialogVisible: function (newVal, oldVal) {
        if (newVal) {
          try {
            this.$refs.sysUserForm.resetFields()
          } catch (err) {}
          if (this.mode === MODE_EDIT) {
            SysUserApi.getSysUser(this.editId)
              .then((res) => {
                Vue.util.extend(this.form, res.data)
              })
              .catch((err) => {
                this.$myErrorHandler.handle(this, err)
              })
          }
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
      _submitForm() {
        this.$refs.sysUserForm.validate((valid) => {
          if (valid) {
            if (this.mode === MODE_EDIT) {
              this._updateManager()
            } else {
              this._createdManager()
            }
          }
        })
      },
      _updateManager() {
        this.loading = true
        SysUserApi.editSysUser(this.editId, this.form)
          .then((res) => {
            this.loading = false
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'info'
            })
            this.hide()
            this.$emit('updated')
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err)
          })
      },
      _createdManager() {
        this.loading = true
        SysUserApi.createSysUser(this.form)
          .then((res) => {
            this.loading = false
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'info'
            })
            this.$emit('created', res.data)
            this.hide()
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err)
          })
      }
    }
  }
</script>

<style scoped lang="less">

</style>
