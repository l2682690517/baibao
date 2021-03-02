<template>
  <div class="preview-image"><img :src="resource.url"></div>
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
  .preview-image {
    img {
      width: 100%;
      display: block;
    }
  }
</style>
