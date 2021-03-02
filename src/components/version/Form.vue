<template>
  <div>
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
      <el-form-item v-if="!isEdit" label="Code" prop="code">
        <div>
          <span class="input">
                <el-input v-model.number="formData.code"></el-input>
          </span>
        </div>
      </el-form-item>
      <el-form-item v-if="!isEdit" label="版本名称" prop="name">
        <div>
          <span class="input">
                <el-input v-model="formData.name" placeholder="v1.0.0"></el-input>
          </span>
        </div>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input
          class="name-input"
          type="textarea"
          :maxlength="500"
          :autosize="{ minRows: 3, maxRows: 10}"
          placeholder="请输入内容"
          v-model="formData.desc">
        </el-input>
      </el-form-item>
      <el-form-item v-if="!isEdit" label="apk文件" prop="url" required>
          <el-button type="primary"size="mini" @click="_showUpload">点击上传文件</el-button>
        {{formData.file_name}}
        <el-input type="hidden" v-model="formData.url"></el-input>
      </el-form-item>
      <el-form-item label="状态" >
        <el-switch
          v-model="formData.enabled">
        </el-switch>
      </el-form-item>

      <el-form-item>
        <el-button size="medium" @click="$router.back()">取 消</el-button>
        <el-button size="medium" type="primary" @click="_submitForm()" :loading="loading">保 存</el-button>
      </el-form-item>
    </el-form>
    <upload-file-dialog  ref="dlgUploadFile" :max="1" tip="只能上传apk"  ext="apk"
                         @uploadCompleted="uploadFileCompleted"></upload-file-dialog>
  </div>
</template>

<script>
  import VersionApi from '../../api/version'
  import UploadFileDialog from 'src/common/widgets/UploadFileDialog.vue'

  const MODE_EDIT = 0
  const MODE_CREATE = 1

  export default {
    MODE_EDIT,
    MODE_CREATE,
    components: {
      UploadFileDialog
    },
    props: {
      mode: {
        type: Number,
        default: MODE_CREATE
      },
      editId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        loading: false,
        fileData: {},
        formData: {
          name: '',
          code: '',
          file_name: '',
          url: '',
          desc: '',
          enabled: true
        },
        rules: {
          code: [
            {required: true, message: '请输入code'},
            {type: 'number', message: 'code 为数字'}
          ],
          name: [
            {required: true, message: '请输入版本名称', trigger: 'blur'},
            {max: 10, message: '最大10个字符', trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '请输入描述', trigger: 'blur'},
            {max: 200, message: '最大200个字符', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '请上传文件', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      isEdit() {
        return this.mode === MODE_EDIT
      }
    },
    methods: {
      async getEditVersion() {
        let res = await VersionApi.getItem(this.editId)
        Object.assign(this.formData, res.data)
      },
      uploadFileCompleted(files) {
        console.log(files)
        if (files.length !== 1) {
          this.$message({
            message: '最多可以上传1个apk',
            type: 'error',
            showClose: true
          })
          return
        }
        files.forEach((item) => {
          this.formData.url = item.ossUrl
          this.formData.file_name = item.name
        })
      },
      _showUpload() {
        this.$refs.dlgUploadFile.show()
      },
      _submitForm() {
        this.$refs.form.validate((validFrom) => {
          if (validFrom) {
            if (this.isEdit) {
              this._updateVersion()
            } else {
              this._createdVersion()
            }
          }
        })
      },
      async _createdVersion() {
        this.loading = true
        try {
          await VersionApi.create(this.formData)
          this.$message({
            showClose: true,
            message: '创建成功',
            type: 'info'
          })
          this.loading = false
          this.$router.back()
        } catch (err) {
          this.loading = false
          this.$myErrorHandler.handle(this, err)
        }
      },
      async _updateVersion() {
        this.loading = true
        try {
          await VersionApi.updateDescAndEnabled(this.editId, {enabled: this.formData.enabled, desc: this.formData.desc})
          this.loading = false
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'info'
          })
          this.$router.back()
        } catch (err) {
          this.loading = false
          this.$myErrorHandler.handle(this, err)
        }
      }
    },
    mounted() {
      if (this.mode === MODE_EDIT) {
        this.getEditVersion()
      }
    }
  }
</script>

<style lang="less" scoped>

  .drag-wrapper {
    display: inline-block;
  }

  .image-action {
    position: absolute !important;
    bottom: 0;
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
    cursor: move !important;
    & > div {
      padding-left: 10px;
      padding-right: 10px;
      cursor: pointer;
    }
  }

  .image-action-wrapper {
    cursor: move;
  }

  .icon {
    background-size: cover;
    background-position: center;
    margin-bottom: 0px;
    cursor: move;
  }

  .unit {
    margin-right: 5px;
  }

  .name-input {
    display: inline-block;
    width: 500px;
  }

  .input {
    display: inline-block;
    width: 150px;
    margin-right: 5px;
  }

  .editor {
    max-width: 750px;
  }
</style>
