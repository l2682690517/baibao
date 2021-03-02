<template>
  <div>
    <div class="breadcrumb">
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/notice' }">达人通知</el-breadcrumb-item>
        <el-breadcrumb-item>管理频道</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-wrapper">
      <edit-channel></edit-channel>
      <notice-list></notice-list>
    </div>

  </div>
</template>

<script>
  import EditChannel from './EditChannel'
  import NoticeList from './NoticeList'

  export default {
    components: {
      EditChannel,
      NoticeList
    }
  }
</script>

<style lang="less" scoped>
  .content-wrapper {
    margin-top: 10px;
  }

</style>
