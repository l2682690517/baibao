<template>
  <div class="preview-text">
    {{resource.text}}
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
  .preview-text {
    text-align: center;
    padding-left: 5px;
    padding-right: 5px;
  }
</style>
