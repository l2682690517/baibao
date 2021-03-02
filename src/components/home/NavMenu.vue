<template>
  <el-menu background-color="#324157" text-color="#fff" :default-active="$route.path" router class="menu-wrapper">
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/order">订单</el-menu-item>
    <el-submenu index="1">
      <template slot="title">商品管理</template>
      <el-menu-item index="/product">商品</el-menu-item>
      <el-menu-item index="/category">分类</el-menu-item>
      <el-menu-item index="/tag">标签</el-menu-item>
      <el-menu-item index="/service">售后模板</el-menu-item>
      <el-menu-item index="/servicetag">服务</el-menu-item>
      <el-menu-item index="/dregion">配送区域</el-menu-item>
      <el-menu-item index="/freight">运费模板</el-menu-item>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">运营促销</template>
      <el-menu-item index="/custompage">自定义首页</el-menu-item>
      <el-menu-item index="/micropage">微页面</el-menu-item>
      <el-menu-item index="/discount">折扣</el-menu-item>
      <el-menu-item index="/voucher">优惠券</el-menu-item>
      <el-menu-item index="/sellgroup">姐妹团</el-menu-item>
      <el-menu-item index="/push">推送</el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">其它</template>
      <el-menu-item index="/shop">达人</el-menu-item>
      <el-menu-item index="/customer">消费者</el-menu-item>
      <el-menu-item index="/feedback">建议与反馈</el-menu-item>
      <el-menu-item index="/agreement">百宝协议</el-menu-item>
      <el-menu-item index="/sysuser">管理员</el-menu-item>
      <el-menu-item index="/version">apk版本管理</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
  export default {
    data() {
      return {
        routePath: '',
        currentMenuIndex: '/category'
      }
    },
    methods: {
      currentMenuClass(menuIndex) {
        if (!this.$route.path && menuIndex === '/') {
          return {
            'is-active-nav-menu': true
          }
        }
        if (menuIndex === this.$route.path || (this.$route.path.split('/').length > 2 && this.$route.path.startsWith(menuIndex) && menuIndex !== '/')) {
          return {
            'is-active-nav-menu': true
          }
        } else {
          return {
            'not-active-nav-menu': true
          }
        }
      }
    },
    watch: {
      $route() {
        this.currentMenuIndex = this.$route.path
      }
    }
  }
</script>

<style scoped lang="less">

  .menu-border {
    border-bottom: solid 0.5px #4e545d;
    margin: 0 10px
  }

  .menu-wrapper {
    width: 150px;
  }


</style>
