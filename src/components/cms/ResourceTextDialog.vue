<template>
  <el-dialog title="请输入文字" v-model="dialogVisible" size="tiny" @close="closeCallback">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="text">
        <el-input class="input" v-model="form.text" placeholder="请输入内容" :maxlength="textMax"></el-input>
        <span class="input-tip">
           {{inputCount}}
        </span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

  export default {
    data() {
      return {
        dialogVisible: false,
        form: {
          text: ''
        },
        rules: {
          text: [
            {required: true, message: '请输入文字', trigger: 'blur'}
          ]
        },
        textMax: 26
      }
    },
    computed: {
      inputCount() {
        const currentLength = this.form.text ? this.form.text.length : 0
        return `${currentLength} / ${this.textMax}`
      }
    },
    methods: {
      show() {
        this.dialogVisible = true
        this.form = {text: ''}
      },
      hide() {
        this.dialogVisible = false
      },
      submit() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            this.$emit('submit', this.form.text)
            this.hide()
          }
        })
      },
      closeCallback() {
        this.$refs.form && this.$refs.form.resetFields()
      }
    }
  }
</script>

<style lang="less" scoped>

  .input {
    width: 280px;
    margin-right: 5px;
  }

</style>
