<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="30%"
             @close="closeCallback"
             @open="openCallback"
             :loading="loading">
    <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="服务名称" prop="name">
        <el-input
          placeholder="最多5个字"
          v-model="formData.name"
          :maxlength="5">
        </el-input>
      </el-form-item>
      <el-form-item label="服务描述" prop="txt">
        <el-input
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 5}"
          placeholder=""
          v-model="formData.txt"
          :maxlength="100">
        </el-input>
        <span class="input-tip">{{formData.txt ? formData.txt.length : 0}}/100</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import * as ServiceTagApi from 'src/api/servicetag'

  const MODE_CREATE = 0
  const MODE_EDIT = 1

  export default {
    MODE_CREATE,
    MODE_EDIT,
    data() {
      return {
        dialogVisible: false,
        loading: false,
        mode: MODE_CREATE,
        editId: 0,
        formData: {
          name: '',
          txt: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入服务名称', trigger: 'blur'},
            {max: 5, message: '最多5个字符', trigger: 'blur'}
          ],
          txt: [
            {required: true, message: '请输入服务描述', trigger: 'blur'},
            {max: 100, message: '最多100个字符', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      title() {
        return this.mode === MODE_CREATE ? '添加服务说明' : '编辑服务说明'
      }
    },
    methods: {
      closeCallback() {
        this.$refs.form.resetFields()
      },
      openCallback() {
      },
      async create() {
        const resResult = await ServiceTagApi.create(this.formData)
        this.$emit('created', resResult.data)
        this.$message({
          showClose: true,
          message: '创建成功',
          type: 'info'
        })
      },
      async update() {
        const resResult = await ServiceTagApi.update(this.editId, this.formData)
        this.$emit('updated', resResult.data)
        this.$message({
          showClose: true,
          message: '更新成功',
          type: 'info'
        })
      },
      submit() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            this.loading = true
            try {
              if (this.mode === MODE_CREATE) {
                await this.create()
              } else {
                await this.update()
              }
              this.loading = false
              this.hide()
            } catch (ex) {
              this.loading = false
              this.$myErrorHandler.handle(this, ex)
            }
          }
        })
      },
      show(mode, id) {
        this.formData = {
          name: '',
          txt: ''
        }
        this.editId = id
        this.mode = mode
        this.dialogVisible = true
        if (this.mode === MODE_EDIT) {
          this.refreshOriginalData()
        }
      },
      hide() {
        this.dialogVisible = false
      },
      async refreshOriginalData() {
        try {
          const resResult = await ServiceTagApi.getItem(this.editId)
          this.formData.name = resResult.data.name
          this.formData.txt = resResult.data.txt
        } catch (e) {
          this.$myErrorHandler.handle(this, e)
        }
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
