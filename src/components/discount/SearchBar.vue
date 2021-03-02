<template>
  <div class="tool-bar">
    <el-form :inline="true">
      <el-form-item style="width: 180px">
        <el-select v-model="model.status" clearable>
          <el-option value="" label="全部状态"></el-option>
          <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width: 180px">
        <el-select v-model="model.seckill" clearable>
          <el-option value="" label="秒杀状态"></el-option>
          <el-option value="1" label="参加秒杀"></el-option>
          <el-option value="2" label="未秒杀"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间:">
        <date-time-tool-bar ref="datetimebar" v-model="model.startTime" placeholder="选择时间"></date-time-tool-bar>
      </el-form-item>
      <el-form-item label="折扣名称:">
        <el-input style="width: 180px" v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { DISCOUNT_STATUS } from '../../constants/discount'
  import DateTimeToolBar from '../../common/widgets/DateTimeToolBar'

  export default {
    props: {
      model: {
        type: Object,
        default: () => {
          return {
            status: '',
            seckill: '',
            startTime: [],
            name: '',
            sort: 'pt',
            order: 'desc'
          }
        }
      }
    },
    components: {
      DateTimeToolBar
    },
    data () {
      return {
        status: DISCOUNT_STATUS
      }
    },
    computed: {},
    methods: {
      search () {
        this.$emit('filter', this.model)
      }
    },
    activated () {
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
