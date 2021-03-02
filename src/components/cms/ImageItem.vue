<template>
  <div>
    <div class="image-item" v-lazy:background-image="resource.url">

    </div>
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
    }
  }
</script>

<style lang="less" scoped>

  .image-item {
    overflow: hidden;
    background-color: #fff;
    box-sizing: border-box;
    width: 80px;
    height: 80px;
    background-size: cover;
  }



</style>
