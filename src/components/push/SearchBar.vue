<template>
  <div class="tool-bar">
    <el-form :inline="true">
      <el-form-item>
        <date-time-tool-bar ref="datetimebar" v-model="model.startTime" placeholder="选择推送时间"></date-time-tool-bar>
      </el-form-item>
      <el-form-item label="标题:">
        <el-input   v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button size="medium" type="primary"  icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import DateTimeToolBar from '../../common/widgets/DateTimeToolBar'

  export default {
    props: {
      model: {
        type: Object,
        default: () => {
          return {
            title: '',
            startTime: []
          }
        }
      }
    },
    components: {
      DateTimeToolBar
    },
    methods: {
      search() {
        this.$emit('filter', this.model)
      }
    }
  }
</script>

<style lang="less" scoped>

  .tool-bar {
    .input-id {
      width: 80px;
    }
  }
</style>
