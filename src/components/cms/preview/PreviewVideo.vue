<template>
  <div class="preview-video">
    <div class="play" v-if="showPlay" v-html="resource.content"></div>
    <div>{{resource.title}}</div>
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
      return { showPlay: true }
    },
    mounted() {
      this.$eventBus.on('eventPreviewVideo', (val) => {
        this.showPlay = val
      })
    }
  }
</script>

<style lang="less" scoped>
  .preview-video {
    text-align: center;
    padding-left: 5px;
    padding-right: 5px;
    .play {
      width: 100%;
      height: auto;
    }
  }
</style>
