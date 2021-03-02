<template>
  <div class="edit">
    <div class="breadcrumb">
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/version' }">apk版本</el-breadcrumb-item>
        <el-breadcrumb-item>编辑版本</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <version-form :mode="0" :editId="parseInt($route.params.id)"></version-form>
    </div>
  </div>
</template>

<script>
  import VersionForm from './Form.vue'

  export default {
    name: 'EditVersion',
    components: {
      VersionForm
    }
  }
</script>

<style lang="less" scoped>

</style>
