<template>
  <div class="text-item">
    <el-input
      placeholder="请输入内容"
      :maxlength="textMax"
      v-model="resource.text">
    </el-input>
    <div class="count">{{inputCount}}</div>

  </div>
</template>

<script>
  export default {
    props: {
      resource: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        textMax: 26
      }
    },
    computed: {
      inputCount() {
        const currentLength = this.resource.text ? this.resource.text.length : 0
        return `${currentLength} / ${this.textMax}`
      }
    }
  }
</script>

<style lang="less" scoped>

  .text-item {
    margin: auto 0;
    overflow: hidden;
    background-color: #fff;
    width: 280px;
    height: 80px;
    display: flex;
    align-items: center;
  }

  .count {
    width: 66px;
    padding-left: 5px;
    padding-right: 5px;
    color: #999;
    font-size: 14px;
  }


</style>
