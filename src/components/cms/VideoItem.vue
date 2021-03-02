<template>
  <div class="text-item">
    视频：{{resource.title}}
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




</style>
