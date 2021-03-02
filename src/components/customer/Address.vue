<template>
  <el-dialog title="收货信息" :visible.sync="dialogVisible" width="40%" @open="_openCallback">

    <div class="content">
      <div><span>姓名：</span>宝宝妈</div>
      <div><span>收货人地址：</span>北京市朝阳区东三环中路铺路24号</div>
      <div><span>联系方式：</span>123412341234</div>
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

  .content > div {
    margin-bottom: 8px;
    font-size: 14px;
    color: #48576a;
  }


</style>
