<template>
  <div class="daterange">
    <el-date-picker
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      ref="timePicker"
      :picker-options="timePickerOptions"
      v-model="timeRange"
      type="daterange"
      :placeholder="placeholder"
      align="right"
      :editable="false"
      value-format="yyyy-MM-dd"
      @change="_timePickerChange">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    props: {
      placeholder: {
        default: ''
      },
      oratimeRange: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        timeRange: '',
        timePickerOptions: {
          shortcuts: [{
            text: '最近三天',
            onClick (picker) {
              const start = new Date(Date.now() - 3600 * 1000 * 24 * 2)
              const end = new Date()
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近七天',
            onClick (picker) {
              const start = new Date(Date.now() - 3600 * 1000 * 24 * 6)
              const end = new Date()
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const start = new Date(Date.now() - 3600 * 1000 * 24 * 29)
              const end = new Date()
              picker.$emit('pick', [start, end])
            }
          }],
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        }
      }
    },
    watch: {
      oratimeRange: function (v) {
        let times = []
        if (v instanceof Array) {
          if (v.length === 2) {
            let st = new Date(v[0])
            let et = new Date(v[1])
            if (st && et) {
              times = [st, et]
            }
          }
        }
        this.timeRange = times
      }
    },
    methods: {
      _timePickerChange (val) {
        if (val) {
          this.$emit('change', val)
        } else {
          this.$emit('change', [])
        }
      },
      reset () {
        this.timeRange = ''
      }
    }
  }
</script>

<style lang="less" scoped>
  .daterange {
    display: inline-block;
    width: 350px;
  }
</style>
