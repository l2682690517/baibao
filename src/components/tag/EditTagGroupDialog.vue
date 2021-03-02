<template>
  <el-dialog :title="title" width="30%" :visible.sync="dialogVisible">
    <el-form ref="form" v-loading="loading" :model="form" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="_submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import TagApi from '../../api/tag'
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
      editTagGroup: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        form: {
          name: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {max: 20, message: '长度在需要小于20 个字称', trigger: 'blur,change'}
          ]
        }
      }
    },
    computed: {
      title() {
        if (this.mode === MODE_EDIT) {
          return '编辑标签组'
        } else {
          return '创建标签组'
        }
      }
    },
    watch: {
      dialogVisible: function (newVal, oldVal) {
        if (newVal) {
          try {
            this.$refs.form.resetFields()
          } catch (err) {}
          if (this.mode === MODE_EDIT) {
            Vue.util.extend(this.form, this.editTagGroup)
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
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.mode === MODE_EDIT) {
              this._updateTagGroup()
            } else {
              this._createdTagGroup()
            }
          }
        })
      },
      _updateTagGroup() {
        this.loading = true
        TagApi.editTagGroup(this.editTagGroup, this.form)
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
      _createdTagGroup() {
        this.loading = true
        TagApi.createTagGroup(this.form)
          .then((res) => {
            this.loading = false
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'info'
            })
            this.hide()
            this.$emit('created', res.data)
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err)
          })
      }
    }
  }

</script>

<style lang="less">

</style>
