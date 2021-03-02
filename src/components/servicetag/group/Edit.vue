<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="30%"
             @close="closeCallback"
             @open="openCallback"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="80px" v-loading="loading">
      <el-form-item label="组合名称" prop="name">
        <el-input
          placeholder="最多10个字"
          v-model="formData.name"
          :maxlength="10"
          :disabled="isDisabledOfName">
        </el-input>
      </el-form-item>
      <el-form-item label="服务选择" :required="true" prop="tags">
        <div class="choosed">{{(!formData.tags || formData.tags.length === 0) ? '请选择' : '已选择' }}：
          <div v-if="formData.tags">
            <draggable v-model="formData.tags">
              <el-tag
                v-for="(tag, index) in formData.tags"
                :key="tag.id"
                :closable="true"
                type='success'
                @close="delTag(index)"
              ><span class="move">{{tag.name}}</span>
              </el-tag>
            </draggable>
          </div>
        </div>
        <div class="all-tag">
          <el-tag
            v-for="tag in $store.state.servicetag.allServiceTag"
            :key="tag.id"
            :closable="false"
            type='primary'

          ><span class="handle" @click.stop="chooseTag(tag)">{{tag.name}}</span>
          </el-tag>
        </div>

      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Draggable from 'vuedraggable'
  import * as ServiceTagGroupApi from 'src/api/servicetaggroup'

  const MODE_CREATE = 0
  const MODE_EDIT = 1

  export default {
    MODE_CREATE,
    MODE_EDIT,
    components: {
      Draggable
    },
    data() {
      const validateTags = (rule, value, callback) => {
        if (!this.formData.tags || this.formData.tags.length === 0) {
          callback(new Error('请选择服务'))
          return
        }
        if (this.formData.tags && this.formData.tags.length > 6) {
          callback(new Error('最多可以选择6项服务'))
          return
        }
        callback()
      }

      return {
        dialogVisible: false,
        loading: false,
        mode: MODE_CREATE,
        editId: 0,
        isDisabledOfName: false,
        formData: {
          name: '',
          tags: []
        },
        rules: {
          name: [
            {required: true, message: '请输入组合名称', trigger: 'blur'},
            {max: 10, message: '最多10个字符', trigger: 'blur'}
          ],
          tags: [
            {validator: validateTags, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      title() {
        return this.mode === MODE_CREATE ? '添加服务组合' : '编辑服务组合'
      }
    },
    methods: {
      closeCallback() {
        this.$refs.form.resetFields()
      },
      openCallback() {
      },
      async create() {
        const resResult = await ServiceTagGroupApi.create(this.formData)
        this.$emit('created', resResult.data)
        this.$message({
          showClose: true,
          message: '创建成功',
          type: 'info'
        })
      },
      async update() {
        const resResult = await ServiceTagGroupApi.update(this.editId, this.formData)
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
            } catch (e) {
              this.$myErrorHandler.handle(this, e)
              this.loading = false
            }
          }
        })
      },
      show(mode, id, isDisabledOfName) {
        this.isDisabledOfName = isDisabledOfName
        this.formData = {
          name: '',
          tags: []
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
          const resResult = await ServiceTagGroupApi.getItem(this.editId)
          this.formData.name = resResult.data.name
          this.formData.tags = resResult.data.tags
        } catch (e) {
          this.$myErrorHandler.handle(this, e)
        }
      },
      chooseTag(tag) {
        if (!this.formData.tags || this.formData.tags.findIndex(
            (item) => {
              return item.id === tag.id
            }) === -1) {
          if (!this.formData.tags) {
            this.formData.tags = []
          }
          this.formData.tags.push(tag)
        }
      },
      delTag(index) {
        this.$confirm('确定要删除?', '提示')
          .then(() => {
            this.formData.tags.splice(index, 1)
          })
          .catch(() => {})
      }
    }
  }
</script>

<style lang="less" scoped>

  .all-tag {
    padding: 5px;
    background-color: #f9f9f9;
  }

  .handle {
    cursor: pointer !important;
  }

  .move {
    cursor: move;
  }

  .choosed {
    padding: 5px;
    padding-top: 0px;
  }

</style>
