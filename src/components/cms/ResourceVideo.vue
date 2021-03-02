<template>
    <el-form ref="form" :model="form"  :rules="rules" label-position="left">
      <el-form-item prop="title" class="form-item" label="视频名称：" label-width="120px"  >
        <el-input class="input" v-model="form.title" placeholder="请输入内容" @change="_change" :maxlength="textMax"></el-input>
        <span class="input-tip">
           {{inputCount}}
        </span>
      </el-form-item>
      <el-form-item prop="content" class="form-item"  label-width="120px">
        <template slot="label">通用代码：
          <el-popover
            ref="popoverhelp"
            trigger="click">
            <div class="help-tip"></div>
          </el-popover>
            <i class="el-icon-information" v-popover:popoverhelp></i>
        </template>
         <el-input class="input"  type="textarea"
                  :rows="2"
                  icon="information" v-model="form.content" placeholder="粘贴视频通用代码" @change="_change"></el-input>
        <div class="input-tip">仅支持腾讯视频通用代码</div>
      </el-form-item>
    </el-form>
</template>

<script>

  export default {
    props: {
      value: {
        default: () => {
          return {
            title: '',
            content: ''
          }
        }
      }
    },
    data() {
      return {
        form: this.value,
        rules: {
          title: [
            {required: true, message: '请输入文字', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '粘贴视频通用代码', trigger: 'blur'}
          ]
        },
        textMax: 20
      }
    },
    computed: {
      inputCount() {
        const currentLength = this.form.title ? this.form.title.length : 0
        return `${currentLength} / ${this.textMax}`
      }
    },
    methods: {
      _change(v) {
        this.$emit('input', this.form)
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
  .form-item {
    margin-bottom: 22px
  }
  .help-tip {
    width: 400px;
    height: 280px;
    background-size: cover;
    background-image: url("~@/assets/img/video_help.png") !important ;

  }
</style>
