<template>
  <div>
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="标题" prop="title">
          <span class="input">
                <el-input v-model="formData.title" :maxlength="20"></el-input>
          </span>
        <span class="input-tip">{{formData.title.length}}/20</span>

      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input
          class="name-input"
          type="textarea"
          :maxlength="50"
          :autosize="{ minRows: 3, maxRows: 10}"
          placeholder="请输入内容"
          v-model="formData.content">
        </el-input>
        <span class="input-tip">{{formData.content.length}}/50</span>

      </el-form-item>
      <el-form-item label="跳转">
        <el-select class="input-go" v-model="formData.raw_go" placeholder="选择自定义模块" clearable>
          <el-option
            v-for="item in goList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="$router.back()">取 消</el-button>
        <el-button size="medium" type="primary" @click="_submitForm()" :loading="loading">发 布</el-button>
        <span class="input-tip">&nbsp;今日已推{{count}}/{{max}}</span>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import PushApi from '../../api/push'
  import * as CustomPageApi from 'src/api/custompage'
  import {getFriendlyModuleType} from 'src/utils/cmsUtil'

  export default {
    data() {
      return {
        loading: false,
        datalist: [],
        count: 0,
        max: 0,
        formData: {
          title: '',
          content: '',
          raw_go: ''
        },
        rules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'},
            {max: 20, message: '最大20个字符', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入内容', trigger: 'blur'},
            {max: 50, message: '最大50个字符', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      goList() {
        let goList = []
        this.datalist.forEach((mod) => {
          goList.push({id: mod.id, name: this._showName(mod)})
        })
        return goList
      }
    },
    methods: {
      _submitForm() {
        this.$refs.form.validate((validFrom) => {
          if (validFrom) {
            this._createdPush()
          }
        })
      },
      async _createdPush() {
        this.loading = true
        try {
          let params = Object.assign({}, this.formData)
          if (params.raw_go) {
            params.raw_go = this._getGo(params.raw_go)
          }
          await PushApi.create(params)
          this.$message({
            showClose: true,
            message: '发布成功',
            type: 'info'
          })
          this.loading = false
          this.$router.back()
        } catch (err) {
          this.loading = false
          this.$myErrorHandler.handle(this, err)
        }
      },
      _showName(mod) {
        return `${getFriendlyModuleType(mod.type)}: ${mod.name}`
      },
      _getGo(goid) {
        let go = this.datalist.find((go) => {
          return go.id === goid
        })
        return JSON.stringify({
          data: go
        })
      },
      _getPushCount() {
        PushApi.getPushCount()
          .then((res) => {
            let data = res.data
            this.count = data.count
            this.max = data.max
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err)
          })
      }
    },
    async mounted() {
      try {
        this.datalist = await CustomPageApi.getList()
        this._getPushCount()
      } catch (e) {
        this.$myErrorHandler.handle(this, e)
      }
    }
  }
</script>

<style lang="less" scoped>

  .name-input {
    display: inline-block;
    width: 500px;
  }

  .input-go {
    display: inline-block;
    width: 500px;
  }

  .input {
    display: inline-block;
    width: 500px;
    margin-right: 5px;
  }
</style>
