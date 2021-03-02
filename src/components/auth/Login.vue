<template>
  <div>
    <div class="title">欢迎来到诚之优品</div>
    <el-card class="box-card" v-loading="loading" element-loading-text="登录中...">
      <el-form label-position="left" :model="credentials" :rules="rules" ref="loginForm">
        <el-form-item label="登陆账号" prop="mobile">
          <el-input v-model="credentials.mobile"></el-input>
        </el-form-item>
        <el-form-item label="登陆密码" prop="passwd">
          <el-input type="password" v-model="credentials.passwd"></el-input>
        </el-form-item>
        <div class="login-btn-wrapper">
          <el-button class="login-btn" type="primary" @click="login">登录</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import auth from '../../api/auth'

  export default {
    data() {
      return {
        loading: false,
        credentials: {
          mobile: '',
          passwd: ''
        },
        rules: {
          mobile: [
            {required: true, message: '请输入登录账号', trigger: 'blur'}
          ],
          passwd: [
            {required: true, message: '请输入登录密码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      login() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true
            auth.login(this.credentials)
              .then((res) => {
                this.loading = false
                this.$router.replace({name: 'home'})
              })
              .catch((err) => {
                this.loading = false
                this.$myErrorHandler.handle(this, err, '登录失败', true)
              })
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">

  .title {
    margin-top: 50px;
    text-align: center;
    font-size: 32px;
    color: #20a0ff;
  }

  .box-card {
    margin: 30px auto;
    width: 380px;

    .auto-login-wrapper {
      text-align: left;
    }

    .login-btn-wrapper {
      margin-top: 60px;
      text-align: center;

      .login-btn {
        width: 100%;
      }
    }

  }

</style>
