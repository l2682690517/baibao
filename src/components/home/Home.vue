<template>
  <div class="layout">
    <header class="layout-header">
      <h1 class="title">诚之优品后台管理系统 <span class="version">{{versionText}}</span></h1>
      <el-menu text-color="#fff" background-color="#03a9f4" active-text-color="#fff" default-active="admin" class="nav" mode="horizontal"
               @select="_handleMeMenuSelect">
        <el-submenu v-if="me.id" index="admin">
          <template slot="title">{{me.name}}</template>
          <el-menu-item index="change-pwd">修改密码</el-menu-item>
          <el-menu-item index="logout">退出登录</el-menu-item>
        </el-submenu>
      </el-menu>
    </header>
    <div class="layout-body">
      <div class="layout-side">
        <nav-menu></nav-menu>
      </div>
      <div class="layout-panel">
        <div class="layout-content">
          <div class="layout-container">
            <keep-alive :exclude="keepAliveExclude">
              <router-view></router-view>
            </keep-alive>
          </div>
        </div>
      </div>
    </div>
    <change-me-pwd ref="changeMePwdDialog"></change-me-pwd>
  </div>
</template>

<script>
  import NavMenu from './NavMenu'
  import ChangeMePwd from './ChangeMePwd'
  import {mapGetters} from 'vuex'
  import auth from '../../api/auth'
  import dateUtil from 'src/utils/dateUtil'

  export default {
    data() {
      return {
        showChangeMePwd: false,
        keepAliveExcludeList: [
          'EditProduct',
          'CreateProduct',
          'CopyProduct',
          'CreateDiscount',
          'EditDiscount',
          'SearchOrder',
          'OrderDetail',
          'EditAgreement',
          'CreateAgreement',
          'shop',
          'shopCouponHistory',
          'customerCouponHistory',
          'customer',
          'product',
          'ShopIncome',
          'CreateService',
          'EditService',
          'RefundDetail',
          'CreateCustomPage',
          'EditCustomPage',
          'CreateDRegion',
          'EditDRegion',
          'CreateVoucher',
          'EditVoucher',
          'CreateVersion',
          'EditVersion',
          'CreatePush',
          'CreateFreight',
          'EditFreight',
          'CreateMicroPage',
          'EditMicroPage'
        ]
      }
    },
    computed: {
      keepAliveExclude() {
        return this.keepAliveExcludeList.join(',')
      },
      ...mapGetters({
        me: 'me'
      }),
      versionText() {
        if (!process.version) {
          return '开发版'
        }
        return `${process.version.version} build ${dateUtil.dateFormat(process.version.buildDate, 'YYMMDD.HHmmss')}`
      }
    },
    components: {
      NavMenu,
      ChangeMePwd
    },
    methods: {
      _handleMeMenuSelect(key, keyPath) {
        switch (key) {
          case 'logout':
            auth.logout().then((res) => {
              this.$router.replace({name: 'login'})
            }).catch((err) => {
              this.$message({
                showClose: true,
                message: err.response.data || '退出登录失败',
                type: 'error'
              })
            })
            break
          case 'change-pwd':
            this.$refs.changeMePwdDialog.show()
        }
      }
    }
  }
</script>

<style scoped lang="less">

  @header-height: 60px;
  @side-width: 150px;

  .layout-header {
    position: fixed;
    height: 60px;
    width: 100%;
    background: #03a9f4;
    box-sizing: border-box;
    z-index: 1;

    .title {
      float: left;
      height: @header-height;
      line-height: @header-height;
      margin-left: 40px;
      vertical-align: top;
      font-size: 18px;
      font-weight: 400;
      color: #fff;
    }

    .nav {
      float: right;
      margin-right: 5px;

    }

  }

  .layout-body {
    position: absolute;
    width: 100%;
    top: @header-height;
    bottom: 0;

    .layout-side {
      position: fixed;
      top: @header-height;
      left: 0;
      height: 92%;
      overflow-x: hidden;
      background: #324157;
      width: @side-width;
    }

    .layout-panel,
    .layout-content {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      overflow: hidden;
      background: #ffffff;
      width: auto;
    }

    .layout-content {
      overflow-y: auto;
    }

    .layout-panel {
      left: @side-width;
    }

    .layout-container {
      padding: 15px;
    }

  }

</style>

<style lang="less">

  .layout-header {

    .el-submenu__title {
      color: #ffffff;
      font-size: 17px;
      background-color: transparent !important;
    }

  }

  .version {
    margin-left: 10px;
    font-size: 14px;
  }
</style>
