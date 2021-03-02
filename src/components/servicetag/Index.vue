<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>服务</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="服务说明" name="tag">
          <tag-section></tag-section>
        </el-tab-pane>
        <el-tab-pane label="服务组合" name="group">
          <group-section></group-section>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import TagSection from './tag/Index.vue'
  import GroupSection from './group/Index.vue'

  export default {
    components: {
      TagSection,
      GroupSection
    },

    data() {
      return {
        activeName: 'tag'
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
