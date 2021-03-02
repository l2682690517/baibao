<template>
    <el-form ref="form" :model="form" :inline="true" :rules="rules">
      <el-form-item prop="text" label="文字：">
        <el-input class="input" v-model="form.text" placeholder="请输入内容" @change="_change" :maxlength="textMax"></el-input>
        <span class="input-tip">
           {{inputCount}}
        </span>
      </el-form-item>
    </el-form>
</template>

<script>

  export default {
    props: {
      value: {
        default: ''
      }
    },
    data() {
      return {
        form: {
          text: this.value
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
      _change(v) {
        this.$emit('input', v)
      }
    },
    watch: {
      value(v) {
        if (v !== this.form.text) {
          this.form.text = v
        }
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
