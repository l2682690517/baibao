<template>
  <div>
    <el-dialog title="预览" :visible.sync="dialogVisible" width="55%">
      <div>
        <div v-for="(item, index) in resources">
          <component :is="getResourceComp(item)" :resource="item"></component>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as CmsUtil from 'src/utils/cmsUtil'
  import PreviewImage from './PreviewImage'
  import PreviewText from './PreviewText'
  import PreviewVideo from './PreviewVideo'

  export default {
    components: {
      PreviewImage,
      PreviewText,
      PreviewVideo
    },
    props: {
      resources: {
        type: Array,
        default() {
          return []
        }
      }
    },
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
      getResourceComp(resource) {
        switch (resource.type) {
          case CmsUtil.TYPE_RESOURCE_IMAGE:
            return 'PreviewImage'
          case CmsUtil.TYPE_RESOURCE_TEXT:
            return 'PreviewText'
          case CmsUtil.TYPE_RESOURCE_VIDEO:
            return 'PreviewVideo'
        }
      }
    },
    watch: {
      dialogVisible(v) {
        this.$eventBus.emit('eventPreviewVideo', v)
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
