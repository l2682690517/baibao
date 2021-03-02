<template>
  <el-form :inline="true">
    <el-form-item label="注册日期:">
      <date-tool-bar :oratimeRange="ctRange" placeholder="选择日期" style="display: inline-block"
                     @change="_ctChanged"></date-tool-bar>
    </el-form-item>
    <el-form-item>
      <el-input class="input" v-model="model.nickname" placeholder="昵称"></el-input>
    </el-form-item>
    <el-form-item>
      <el-cascader expandTrigger="hover" :options="optionsSaleStatus" :change-on-select="true"
                   v-model="chooseSaleStatus"></el-cascader>
    </el-form-item>
    <el-form-item>
      <el-input class="input" v-model="model.uid" placeholder="消费者ID"></el-input>
    </el-form-item>
    <el-form-item >
    <el-button size="medium" type="primary" icon="el-icon-search" @click="_submit">搜&nbsp;索</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import DateToolBar from 'src/common/widgets/DateToolBar'

  export default {
    components: {
      DateToolBar
    },
    props: {
      model: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    watch: {
      model: {
        handler (newVal, oldVal) {
          this.convertModelToOptions()
        },
        deep: true
      }
    },
    computed: {
      ctRange () {
        return [this.model.start, this.model.end]
      }
    },
    data () {
      return {
        chooseSaleStatus: [''],
        optionsSaleStatus: [
          {value: '', label: '消费频率'},
          {
            value: '1',
            label: '有消费',
            children: [{
              value: '604800000',
              label: '一周内有消费'
            }, {
              value: '1209600000',
              label: '两周内有消费'
            }, {
              value: '2592000000',
              label: '一个月内有消费'
            }, {
              value: '7776000000',
              label: '三个月内有消费'
            }, {
              value: '15552000000',
              label: '六个月内有消费'
            }]
          },
          {
            value: '2',
            label: '未消费',
            children: [{
              value: '604800000',
              label: '一周内未消费'
            }, {
              value: '1209600000',
              label: '两周内未消费'
            }, {
              value: '2592000000',
              label: '一个月内未消费'
            }, {
              value: '7776000000',
              label: '三个月内未消费'
            }, {
              value: '15552000000',
              label: '六个月内未消费'
            }]
          },
          {value: '3', label: '从未消费过'}
        ]
      }
    },
    methods: {
      convertModelToOptions() {
        if (!this.model.consume_tp || this.model.consume_tp === '') {
          this.chooseSaleStatus = ['']
        } else {
          this.chooseSaleStatus = [`${this.model.consume_tp}`]
        }
        if (this.model.consume_frequency && this.model.consume_frequency !== '') {
          this.chooseSaleStatus.push(`${this.model.consume_frequency}`)
        }
      },
      _submit() {
        this.model.consume_tp = `${this.chooseSaleStatus[0]}`
        if (this.model.consume_tp === '1' && this.chooseSaleStatus[1]) {
          this.model.consume_frequency = `${this.chooseSaleStatus[1]}`
        } else if (this.model.consume_tp === '2' && this.chooseSaleStatus[1]) {
          this.model.consume_frequency = `${this.chooseSaleStatus[1]}`
        } else if (this.model.consume_tp === '3') {
          this.model.consume_frequency = ''
        }
        this.$emit('submit', this.model)
      },
      _ctChanged (val) {
        if (val) {
          const dates = val
          this.model.start = dates[0]
          this.model.end = dates.length > 1 ? dates[1] : ''
        } else {
          this.model.start = ''
          this.model.end = ''
        }
      }
    }
  }
</script>

<style lang="less" scoped>

  .input {
    width: 160px;
    margin-right: 5px;
  }

</style>
