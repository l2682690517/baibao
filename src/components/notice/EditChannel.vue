<template>
  <div class="channel-wrapper">
    <div class="icon">
      <el-upload
        :action="fileHost"
        :data="fileData"
        :show-file-list="false"
        :on-success="_handleUploadFileSuccess"
        :before-upload="_handleBeforeUploadLoad">
        <img class="img-responsive" src="http://temp.im/60x60"/>
      </el-upload>
    </div>
    <div class="name">
      <editable-label :text="text"/>
    </div>
    <div class="action">
      <el-button type="primary" icon="el-icon-plus">发布通知</el-button>
    </div>
  </div>
</template>


<script>
  import EditableLabel from '../../common/widgets/EditableLabel'
  import OssApi from '../../api/oss'

  export default {
    components: {
      EditableLabel
    },
    data() {
      return {
        fileHost: '',
        fileData: {},
        ossUrl: '',
        text: 'texttexttexttexttexttexttexttexttexttexttexttext'
      }
    },
    methods: {
      _handleBeforeUploadLoad(file) {
        const isJPG = file.type === 'image/jpeg'
        const jsPNG = file.type === 'image/png'
        if (!isJPG && !jsPNG) {
          this.$message.error('请选择有效图片')
          return false
        }
        let ext = ''
        if (isJPG) {
          ext = '.jpeg'
        } else if (jsPNG) {
          ext = '.png'
        }
        return OssApi.getToken().then((res) => {
          this.fileHost = res.data.token.host
          let fileName = res.data.key + ext
          this.fileData = {
            key: res.data.token.dir + fileName,
            policy: res.data.token.policy,
            OSSAccessKeyId: res.data.token.accessid,
            signature: res.data.token.signature,
            success_action_status: '200'
          }
          this.ossUrl = `${res.data.baseURL}${fileName}`
        })
      },
      _handleUploadFileSuccess(res, file, fileList) {
        this.formData.image = this.ossUrl
      }
    }
  }
</script>

<style lang="less" scoped>
  .channel-wrapper {
    display: flex;
    align-items: center;

    .icon {
      width: 60px;
      height: 60px;
    }

    .name {
      div {
        width: 300px;
      }
    }

    .action {
      flex: 1;
      text-align: right;
    }
  }
</style>
