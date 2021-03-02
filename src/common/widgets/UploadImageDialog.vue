<template>
  <el-dialog title="上传图片" :visible.sync="dialogVisible" size="small" @open="openCallback" @close="closeCallback">
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
        <div class="el-upload__text"><span v-show="max !== 0">还可以上传{{max}}张，</span>将图片拖到此处，或<em>点击上传</em>。<span
          v-if="showTip"><br/>{{tip}}</span>
        </div>
        <div class="el-upload__tip" slot="tip">支持<b>多选和批量拖拽</b>，目前支持上传<b>jpg/png/gif</b>文件</div>
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
  import ImageUtil from 'src/utils/imageUtil'

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
        default: '建议尺寸750 X 750像素'
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
        const isJPG = file.type === 'image/jpeg'
        const jsPNG = file.type === 'image/png'
        const isGIF = file.type === 'image/gif'
        if (!isJPG && !jsPNG && !isGIF) {
          this.$message.error('请选择有效图片')
          throw new Error('请选择有效图片')
        }
        if (this.max !== 0 && this.fileList.length > this.max) {
          this.$message({
            message: '超过最大上传数量',
            type: 'error',
            showClose: true
          })
          throw new Error('超过最大上传数量')
        }
        let ext = ''
        if (isJPG) {
          ext = '.jpeg'
        } else if (jsPNG) {
          ext = '.png'
        } else if(isGIF) {
          ext = '.gif'
        }
        this.loading = true
        return Promise.all([ImageUtil.getImageSize(file), OssApi.getToken()]).then(([imageSize, tokenRes]) => {
          this.fileHost = tokenRes.data.token.host
          let fileName = tokenRes.data.key + ext
          this.fileData = {
            key: tokenRes.data.token.dir + fileName,
            policy: tokenRes.data.token.policy,
            OSSAccessKeyId: tokenRes.data.token.accessid,
            signature: tokenRes.data.token.signature,
            success_action_status: '200'
          }
          file.ossUrl = `${tokenRes.data.baseURL}${fileName}`
          file.imageSize = imageSize
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
      getImages() {
        let newImages = []
        this.fileList.forEach((item) => {
          const size = item.imageSize ? item.imageSize : item.raw.imageSize
          if (size) {
            newImages.push({
              name: item.name,
              url: item.url,
              ossUrl: item.ossUrl ? item.ossUrl : item.raw.ossUrl,
              size: size
            })
          }
        })
        return newImages
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
        this.$emit('uploadCompleted', this.getImages())
        this.hide()
      },
      checkMaxLimit(file, fileList) {
        if (this.max !== 0 && fileList.length > this.max) {
          if (file) {
            this.$refs.upload.handleRemove(file)
            this.$message.error('请选择有效图片')
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
