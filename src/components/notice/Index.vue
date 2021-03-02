<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="_createChannel">创建通知频道</el-button>
    <channel-list></channel-list>
    <create-channel ref="dlgCreateChannel"></create-channel>
  </div>
</template>

<script>
  import ChannelList from './ChannelList'
  import CreateChannel from './CreateChannel'

  export default {
    components: {
      ChannelList,
      CreateChannel
    },
    methods: {
      _createChannel() {
        this.$refs.dlgCreateChannel.show()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
