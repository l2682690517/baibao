<template>
  <div class="edit" v-loading="loading">
    <div class="breadcrumb">
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/agreement' }">百宝协议</el-breadcrumb-item>
        <el-breadcrumb-item>{{currentBreadcrumb}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="contentForm">
      <el-form ref="form" label-width="80px" :model="formData" :rules="rules">
        <el-form-item label="编码:" prop="name">
          <el-input class="input-name" :disabled="isEdit()" placeholder="请输入字母或数字" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="标题:" prop="title">
          <el-input class="input-name" placeholder="" v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="内容:" prop="content" style="width: 75%;">
          <el-input type="textarea" v-model="formData.content" :rows="15" style="width: 75%;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="_submit">确定</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Editor from '../../common/widgets/Editor'
  import AgreementApi from '../../api/agreement'

  const MODE_CREATE_AGREEMENT = 'create_agreement'
  const MODE_EDIT_AGREEMENT = 'edit_agreement'

  export default {
    MODE_CREATE_AGREEMENT,
    MODE_EDIT_AGREEMENT,
    name: 'EditAgreement',
    components: {
      Editor
    },
    data() {
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入字母或数字'))
        } else {
          var reg = /^[A-Za-z0-9]+$/
          if (!reg.test(value)) {
            callback(new Error('请输入字母或数字'))
          }
          callback()
        }
      }
      var validateContent = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入内容'))
        }
        callback()
      }

      return {
        loading: false,
        mode: MODE_CREATE_AGREEMENT,
        rules: {
          name: [
            { validator: validateName, trigger: 'blur' }
          ],
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          content: [
            { validator: validateContent, trigger: 'blur' }
          ]
        },
        formData: {
          name: '',
          title: '',
          content: ''
        }
      }
    },
    computed: {
      currentBreadcrumb() {
        switch (this.mode) {
          case MODE_CREATE_AGREEMENT:
            return '创建协议'
          default:
            return '编辑协议'
        }
      }
    },
    methods: {
      _initMode() {
        let currentPath = this.$route.path
        if (currentPath.indexOf('agreement/create') !== -1) {
          this.mode = MODE_CREATE_AGREEMENT
        } else {
          this.mode = MODE_EDIT_AGREEMENT
        }
      },
      isEdit() {
        return this.mode === MODE_EDIT_AGREEMENT
      },
      _editorContentChanged(html, txt) {
        this.formData.content = html
        this.formData.txt = txt
      },
      async getEditItem(name, item) {
        try {
          let atreementItem = null
          if (!item) {
            atreementItem = await AgreementApi.getItem(name)
          } else {
            atreementItem = JSON.parse(item.j).data
          }
          this.formData.name = atreementItem.name
          Object.assign(this.formData, atreementItem)
        } catch (e) {
          console.log(e)
          this.$myErrorHandler.handle(this, e)
        }
      },
      _createAgreement() {
        this.loading = true
        AgreementApi.createAgreementItem(this.formData.name, this.formData)
          .then((res) => {
            this.loading = false
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'info'
            })
            this.$router.back()
          }).catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err)
          })
      },
      _updateAgreement() {
        this.loading = true
        AgreementApi.updateAgreementItem(this.formData.name, this.formData)
          .then((res) => {
            this.loading = false
            this.$message({
              showClose: true,
              message: '编辑成功',
              type: 'info'
            })
            this.$router.back()
          }).catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err)
          })
      },
      _submit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.isEdit()) {
              this._updateAgreement()
            } else {
              this._createAgreement()
            }
          }
        })
      }
    },
    mounted() {
    },
    created() {
      this._initMode()
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (vm.isEdit()) {
          let params = to.params
          vm.getEditItem(params.name, params.item)
        }
      })
    }
  }
</script>

<style lang="scss">
  .ql-container .ql-editor {
    min-height: 200px;
    padding-bottom: 1px;
    max-height: 600px;
  }

</style>
