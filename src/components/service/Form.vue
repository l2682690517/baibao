<template>
  <div>
    <el-form ref="form" :model="formData" :rules="rules" label-width="60px">
      <el-form-item label="名称" prop="name">
        <el-input
          class="name-input"
          placeholder="请输入名称"
          v-model="formData.name"
          :disabled="mode === 0">
        </el-input>
      </el-form-item>
      <el-form-item label="内容">
        <div>
          <cms ref="cms" :content="formData.content"></cms>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="$router.back()">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Cms from 'src/components/cms/Index.vue'
  import ServiceApi from 'src/api/service'

  const MODE_EDIT = 0
  const MODE_CREATE = 1

  export default {
    MODE_EDIT,
    MODE_CREATE,
    components: {
      Cms
    },
    props: {
      mode: {
        type: Number,
        default: MODE_CREATE
      }
    },
    data() {
      return {
        loading: false,
        formData: {
          name: '',
          content: {
            data: []
          }
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {max: 10, message: '最大10个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submit() {
        this.$refs.form.validate((validFrom) => {
          if (validFrom) {
            if (this.mode === MODE_EDIT) {
              this.update()
            } else {
              this.created()
            }
          } else {
            for (const item of this.$refs.form.fields) {
              if (item.validateState === 'error' && item.validateMessage) {
                this.$message({
                  showClose: true,
                  message: item.validateMessage,
                  type: 'error'
                })
                break
              }
            }
          }
        })
      },
      async created() {
        this.loading = true
        try {
          await ServiceApi.create(this.formData.name, this.formData.content)
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
      async update() {
        this.loading = true
        try {
          await ServiceApi.update(this.formData.name, this.formData.content)
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
      },
      async initForm() {
        if (this.$route.name === 'editService') {
          const name = this.$route.query.name
          const res = await ServiceApi.getItem(name)
          this.formData.name = name
          this.formData.content.data = res.data.data ? res.data.data : []
        }
      }
    },
    mounted() {
      this.initForm()
    }
  }
</script>

<style lang="less" scoped>
  .name-input {
    width: 300px;
  }
</style>
