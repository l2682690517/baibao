<template>
  <el-dialog title="创建通知频道" :visible.sync="dialogVisible" width="40%" @open="_openCallback">

    <el-form ref="form" label-width="90px" v-loading="loading" :model="formData" :rules="rules">
      <el-form-item label="频道Logo" prop="image">
        <el-upload
          class="icon"
          :action="fileHost"
          :data="fileData"
          :show-file-list="false"
          :on-success="_handleUploadFileSuccess"
          :before-upload="_handleBeforeUploadLoad">
          <img class="img" v-if="formData.image" :src="formData.image">
          <div v-else class="add">
            <i class="el-icon-plus"></i>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="频道名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="_submitForm">确 定</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import OssApi from '../../api/oss'

  export default {
    data() {
      return {
        loading: false,
        dialogVisible: false,
        fileHost: '',
        fileData: {},
        ossUrl: '',
        formData: {
          image: '',
          name: ''
        },
        rules: {
          image: [
            {required: true, message: '请选择频道Logo', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入频道名称', trigger: 'blur'},
            {max: 20, message: '频道名称最大20个字符', trigger: 'blur'}
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
      _openCallback() {
        this.$nextTick(() => {
        })
      },
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
      },
      _submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>

  .icon {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    width: 80px;
    height: 80px;

    .img {
      width: 80px;
      height: 80px;
      display: block;
      line-height: 80px;

    }

    .add {
      display: flex;
      width: 80px;
      height: 80px;
      align-items: center;
      justify-content: center;

    }
  }


</style>
