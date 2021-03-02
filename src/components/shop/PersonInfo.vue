<template>
  <el-dialog title="":visible.sync="dialogVisible" width="40%" @open="_openCallback">

    <div>
      <div class="title">店主</div>
      <div><img class="shop-icon" src="http://temp.im/30x30"/><span class="shop-name">宝宝的店</span></div>
      <div class="name"><span>宝宝的店</span></div>
      <div class="mobile"><span>宝宝的店</span></div>
    </div>

    <div class="inviter-wrapper">
      <div class="title">邀请人</div>
      <div><img class="shop-icon" src="http://temp.im/30x30"/><span class="shop-name">宝宝的店</span></div>
      <div class="name"><span>宝宝的店</span></div>
      <div class="mobile"><span>宝宝的店</span></div>
    </div>


  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false
      }
    },
    methods: {
      show() {
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },
      _openCallback() {
        this.$nextTick(() => {
        })
      }
    }
  }
</script>

<style lang="less" scoped>

  .shop-icon {
    border-radius: 15px;
  }

  .title {
    margin-bottom: 5px;
    font-size: 15px;
    font-weight: 700;
  }

  .shop-name, .name, .mobile {
    font-size: 14px;
    color: #48576a;
  }

  .shop-name {
    line-height: 30px;
    vertical-align: top;
    margin-left: 5px;
  }

  .name, .mobile {
    margin-top: 5px;
    margin-left: 35px;
  }

  .inviter-wrapper {
    margin-top: 30px;
  }


</style>
