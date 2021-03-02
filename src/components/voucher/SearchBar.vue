<template>
  <div class="tool-bar">
    <el-form :inline="true">
      <el-form-item>
        <el-select v-model="model.put_tp" clearable style="width: 150px">
          <el-option value="" label="全部类型"></el-option>
          <el-option
            v-for="item in putTps"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="model.expiry">显示过期优惠券</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="model.put_status_stop">显示暂停优惠券</el-checkbox>
      </el-form-item>
      <el-form-item label="优惠券名称:">
        <el-input v-model="model.name" style="width: 140px"></el-input>
      </el-form-item>
      <el-form-item label="备注:">
        <el-input v-model="model.sys_remark" style="width: 140px"></el-input>
      </el-form-item>
      <el-form-item label="优惠券ID:">
        <el-input v-model="model.voucher_id" style="width: 80px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: {
      selection: {
        type: Array,
        default () {
          return []
        }
      },
      model: {
        type: Object,
        default: () => {
          return {
            expiry: false,
            put_status_stop: false,
            put_tp: '',
            name: '',
            sys_remark: '',
            voucher_id: ''
          }
        }
      }
    },
    components: {},
    data () {
      return {
        putTps: [{id: '2', name: '手动发放'}, {id: '1', name: '系统发放'}, {id: '3', name: '定向发放'}, {id: '4', name: '详情页券'}]
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
