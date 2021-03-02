<template>
  <el-form :inline="true">
    <el-form-item label="开店/升级:">
      <date-tool-bar :oratimeRange="oratimeRange" placeholder="选择日期" ref="datatoolbar" style="display: inline-block"
                     @change="_dateChanged"></date-tool-bar>
    </el-form-item>
    <el-form-item>
      <el-select v-model="model.mentor" placeholder="请选择导师">
        <el-option v-for="item in mentors"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="首单:">
      <el-date-picker
        v-model="model.first"
        type="date"
        placeholder="选择日期"
        align="right"
        :editable="false"
        :clearable="true"
        :picker-options="pickerOptions"
        @change="_timePickerChange"
        value-format="yyyy-MM-dd">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="上线ID:">
      <el-input class="inputID" v-model="model.up"></el-input>
    </el-form-item>
    <el-form-item label="邀请人ID:">
      <el-input class="inputID" v-model="model.from"></el-input>
    </el-form-item>
    <el-form-item label="店铺ID:">
      <el-input class="inputID" v-model="model.id"></el-input>
    </el-form-item>
    <el-form-item label="店铺名称:">
      <el-input class="input" v-model="model.name"></el-input>
    </el-form-item>
    <el-form-item label="店铺等级:">
      <el-select v-model="model.level">
        <el-option value="0" label="全部"></el-option>
        <el-option value="1" label="青橙"></el-option>
        <el-option value="2" label="美橙"></el-option>
        <el-option value="3" label="金橙"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select v-model="model.trial">
        <el-option value="-1" label="全部店铺"></el-option>
        <el-option value="1" label="试用店铺"></el-option>
        <el-option value="0" label="正式店铺"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-cascader expandTrigger="hover" :options="optionsSaleStatus" :change-on-select="true"
                   v-model="chooseSaleStatus"></el-cascader>
    </el-form-item>
    <el-form-item label="销售日期（只影响销售额统计）:">
      <date-tool-bar :oratimeRange="saleRange" placeholder="选择日期" ref="datatoolbar" style="display: inline-block"
                     @change="_saleDateChanged"></date-tool-bar>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="medium" icon="el-icon-search" @click="_submit">搜&nbsp;索</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="medium" @click="_exportCsv">导&nbsp;出</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import ShopApi from 'src/api/shop'
  import DateToolBar from 'src/common/widgets/DateToolBar'
  import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item.vue'

  export default {
    components: {
      ElFormItem,
      DateToolBar
    },
    props: {
      model: {
        type: Object,
        default: () => {
          return {
            mentor: '',
            name: '',
            id: '',
            first: '',
            from: '',
            up: '',
            start: '',
            end: '',
            saleStart: '',
            saleEnd: '',
            level: '0',
            trial: '-1',
            sale_tp: '',
            sale_frequency: ''
          }
        }
      }
    },
    computed: {
      oratimeRange () {
        let oratimeRange = [this.model.start, this.model.end]
        return oratimeRange
      },
      saleRange () {
        return [this.model.saleStart, this.model.saleEnd]
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
    data () {
      return {
        mentors: [],
        chooseSaleStatus: [''],
        optionsSaleStatus: [
          {value: '', label: '销售频率'},
          {
            value: '1',
            label: '有销售',
            children: [{
              value: '604800000',
              label: '一周内有销售'
            }, {
              value: '1209600000',
              label: '两周内有销售'
            }, {
              value: '2592000000',
              label: '一个月内有销售'
            }, {
              value: '7776000000',
              label: '三个月内有销售'
            }, {
              value: '15552000000',
              label: '六个月内有销售'
            }]
          },
          {
            value: '2',
            label: '未销售',
            children: [{
              value: '604800000',
              label: '一周内未销售'
            }, {
              value: '1209600000',
              label: '两周内未销售'
            }, {
              value: '2592000000',
              label: '一个月内未销售'
            }, {
              value: '7776000000',
              label: '三个月内未销售'
            }, {
              value: '15552000000',
              label: '六个月内未销售'
            }]
          },
          {value: '3', label: '从未销售过'}
        ],
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        }
      }
    },
    methods: {
      convertModelToOptions() {
        if (!this.model.sale_tp || this.model.sale_tp === '') {
          this.chooseSaleStatus = ['']
        } else {
          this.chooseSaleStatus = [`${this.model.sale_tp}`]
        }
        if (this.model.sale_frequency && this.model.sale_frequency !== '') {
          this.chooseSaleStatus.push(`${this.model.sale_frequency}`)
        }
      },
      _submit () {
        this.model.sale_tp = `${this.chooseSaleStatus[0]}`
        if (this.model.sale_tp === '1' && this.chooseSaleStatus[1]) {
          this.model.sale_frequency = `${this.chooseSaleStatus[1]}`
        } else if (this.model.sale_tp === '2' && this.chooseSaleStatus[1]) {
          this.model.sale_frequency = `${this.chooseSaleStatus[1]}`
        } else if (this.model.sale_tp === '3') {
          this.model.sale_frequency = ''
        }
        this.$emit('submit', this.model)
      },
      _exportCsv () {
        this.$emit('export', this.model)
      },
      _dateChanged (val) {
        if (val) {
          const dates = val
          this.model.start = dates[0]
          this.model.end = dates.length > 1 ? dates[1] : ''
        } else {
          this.model.start = ''
          this.model.end = ''
          this.mode.trial = '-1'
        }
      },
      _saleDateChanged (val) {
        if (val) {
          const dates = val
          this.model.saleStart = dates[0]
          this.model.saleEnd = dates.length > 1 ? dates[1] : ''
        } else {
          this.model.saleStart = ''
          this.model.saleEnd = ''
        }
      },
      _timePickerChange (val) {
        this.model.first = val
      },
      reset () {
        this.$refs.datatoolbar.reset()
        this.model.mentor = ''
        this.model.level = ''
        this.model.name = ''
        this.model.id = ''
        this.model.first = ''
        this.model.from = ''
        this.model.up = ''
        this.model.sale_tp = ''
        this.model.sale_frequency = ''
        this.chooseSaleStatus = ['']
      }
    },
    async created () {
      try {
        const res = await ShopApi.getMentors()
        this.mentors = res.data.data
      } catch (err) {
        this.$myErrorHandler.handle(this, err, '加载导师失败')
      }
      this.mentors.unshift({name: '全部导师', id: ''})
    }
  }
</script>

<style lang="less" scoped>

  .input {
    width: 160px;
    margin-right: 5px;
  }

  .inputID {
    width: 80px;
    margin-right: 5px;
  }

</style>
