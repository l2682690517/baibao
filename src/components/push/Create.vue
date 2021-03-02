<template>
  <div class="create">
    <div class="breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/push' }">推送</el-breadcrumb-item>
        <el-breadcrumb-item>添加推送</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <push-form :mode="1"></push-form>
    </div>
  </div>
</template>

<script>
  import PushForm from './Form.vue'

  export default {
    name: 'CreatePush',
    components: {
      PushForm
    }
  }
</script>

<style lang="less" scoped>

</style>
