<template>
  <el-date-picker
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    ref="timePicker"
    :picker-options="timePickerOptions"
    v-model="timeRange"
    type="datetimerange"
    :placeholder="placeholder"
    align="right"
    :editable="false"
    :clearable="true"
    @change="_timePickerChange">
  </el-date-picker>
</template>

<script>
  import dateFormat from 'src/utils/dateUtil'
  export default {
    props: {
      placeholder: {
        default: ''
      },
      value: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data () {
      return {
        timeRange: [],
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
          }]
        }
      }
    },
    watch: {
      value: function (v) {
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
          let date1 = dateFormat.dateFormat(Date.parse(val[0]))
          let date2 = dateFormat.dateFormat(Date.parse(val[1]))
          let times = [date1, date2]
          this.$emit('input', times)
        } else {
          this.$emit('input', [])
        }
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
