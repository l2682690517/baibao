<template>
  <el-form :inline="true">
    <el-form-item>
      <el-select class="status-select" v-model="type"  clearable  @change="_statusChange">
        <el-option value="" label="全部类型"></el-option>
        <el-option
          v-for="item in optionsTypes"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
  import FeedBackApi from '../../api/feedback'
  export default {
    data() {
      return {
        type: '',
        optionsTypes: []
      }
    },
    methods: {
      _statusChange() {
        this.$emit('change', this.type)
      }
    },
    async activated() {
      try {
        const res = await FeedBackApi.getTypes()
        this.optionsTypes = res.data.data
      } catch (e) {
        this.$myErrorHandler.handle(this, e)
      }
    }
  }
</script>

<style lang="less" scoped>

  .root {
    display: flex;
    align-items: center;
  }

  .refunding {
    margin-left: 30px;
  }

</style>
