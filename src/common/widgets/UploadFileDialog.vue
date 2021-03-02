<template>
  <el-dialog title="上传文件" :visible.sync="dialogVisible" width="50%" @open="openCallback" @close="closeCallback">
    <div class="upload-image">
      <el-upload
        ref="upload"
        drag
        multiple
        :action="fileHost"
        :on-remove="handleRemoveFile"
        :on-success="handleUpdateFileSuccess"
        :on-error="handleUpdateFileError"
        :before-upload="handleBeforeUploadFile"
        :on-change="handleOnChange"
        :data="fileData"
        :file-list="fileList">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>
        </div>
        <div v-if="tip" class="el-upload__tip" slot="tip">{{tip}}</div>
      </el-upload>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import OssApi from 'src/api/oss'

  export default {
    props: {
      max: {
        type: Number,
        default() {
          return 0
        }
      },
      showTip: {
        type: Boolean,
        default: true
      },
      tip: {
        type: String,
        default: ''
      },
      ext: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        dialogVisible: false,
        fileHost: '',
        fileData: {},
        fileList: [],
        loading: false
      }
    },
    methods: {
      show() {
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },
      handleRemoveFile(file, fileList) {
      },
      handleUpdateFileSuccess(res, file, fileList) {
        this.loading = false
        this.checkMaxLimit(file, fileList)
      },
      handleUpdateFileError(error, file, fileList) {
        this.loading = false
      },
      async handleBeforeUploadFile(file) {
        console.log('file type', file.type)
        let filename = file.name
        let ext = filename.substring(filename.lastIndexOf('.') + 1, filename.length)
        if (this.ext && this.ext !== ext) {
          this.$message.error('请选择有效文件')
          throw new Error('请选择有效文件')
        }
        if (this.max !== 0 && this.fileList.length > this.max) {
          this.$message({
            message: '超过最大上传数量',
            type: 'error',
            showClose: true
          })
          throw new Error('超过最大上传数量')
        }

        this.loading = true
        return Promise.all([OssApi.getToken()]).then(([tokenRes]) => {
          this.fileHost = tokenRes.data.token.host
          let fileName = tokenRes.data.key + '/' + filename
          this.fileData = {
            key: tokenRes.data.token.dir + fileName,
            policy: tokenRes.data.token.policy,
            OSSAccessKeyId: tokenRes.data.token.accessid,
            signature: tokenRes.data.token.signature,
            success_action_status: '200'
          }
          file.ossUrl = `${tokenRes.data.baseURL}${fileName}`
        })
      },
      handleOnChange(file, fileList) {
        this.fileList = fileList
      },
      openCallback() {
      },
      closeCallback() {
        this.fileList = []
        this.$refs.upload.clearFiles()
      },
      getFiles() {
        let files = []
        this.fileList.forEach((item) => {
          const size = item.size ? item.size : item.raw.size
          if (size) {
            files.push({
              name: item.name,
              url: item.url,
              ossUrl: item.ossUrl ? item.ossUrl : item.raw.ossUrl,
              size: size
            })
          }
        })
        return files
      },
      submit() {
        if (this.loading) {
          this.$message({
            message: '正在上传中',
            type: 'info',
            showClose: true
          })
          return
        }
        this.$emit('uploadCompleted', this.getFiles())
        this.hide()
      },
      checkMaxLimit(file, fileList) {
        if (this.max !== 0 && fileList.length > this.max) {
          if (file) {
            this.$refs.upload.handleRemove(file)
            this.$message.error('请选择有效文件')
          }
        }
      }
    }
  }

</script>

<style lang="less" scoped>

  .upload-image {
    text-align: center;
  }

  b {
    font-size: 1.5em;
    font-weight: bold;
  }

</style>
