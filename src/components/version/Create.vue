<template>
  <div class="create">
    <div class="breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/version' }">apk版本管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加版本</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <version-form :mode="1"></version-form>
    </div>
  </div>
</template>

<script>
  import VersionForm from './Form.vue'

  export default {
    name: 'CreateVersion',
    components: {
      VersionForm
    }
  }
</script>

<style lang="less" scoped>

</style>
