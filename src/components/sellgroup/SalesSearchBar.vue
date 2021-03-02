<template lang="pug">
  el-form(inline)
    el-form-item()
      el-cascader.status-select(expandTrigger="hover", :options="optionsStatus", :change-on-select="true", v-model="chooseStatus",  @change="statusChange")
    el-form-item()
      date-time-tool-bar(ref="datetoolbar", placeholder="开团时间", v-model="chooseDate" )
    el-form-item(label="姐妹团ID:")
      el-input.inputId(v-model="model.gid")
    el-form-item(label="团长ID:")
      el-input.inputId(v-model="model.leader")
    el-form-item
      el-button(type="primary", icon="el-icon-search", @click="submit") 搜&nbsp;索
</template>


<script>
  import DateTimeToolBar from 'src/common/widgets/DateTimeToolBar.vue'

  export default {
    components: {
      DateTimeToolBar
    },
    props: {
      queryParams: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data () {
      return {
        chooseStatus: [''],
        chooseDate: [],
        model: {
          status: '',
          res: '',
          openstart: '',
          openend: '',
          leader: '',
          gid: ''
        },
        optionsStatus: [
          {value: '', label: '全部状态'},
          {value: '1', label: '报名中'},
          {value: '2', label: '进行中'},
          {
            value: '3',
            label: '结束',
            children: [{
              value: '',
              label: '所有结束'
            }, {
              value: '1',
              label: '结束(成功)'
            }, {
              value: '2',
              label: '结束(失败)'
            }, {
              value: '0',
              label: '结束(未结算)'
            }]
          }
        ]
      }
    },
    computed: {},
    watch: {
      queryParams: {
        handler (newVal, oldVal) {
          this.convertQueryParamsToModel()
        },
        deep: true
      }
    },
    methods: {
      statusChange () {
      },
      submit () {
        this.model.status = `${this.chooseStatus[0]}`
        if (this.model.status === '3' && this.chooseStatus[1]) {
          this.model.res = `${this.chooseStatus[1]}`
        } else {
          this.model.res = ''
        }
        if (this.chooseDate && this.chooseDate.length >= 2) {
          this.model.openstart = this.chooseDate[0]
          this.model.openend = this.chooseDate[1]
        } else {
          this.model.openstart = ''
          this.model.openend = ''
        }
        this.$emit('submit', this.model)
      },
      convertQueryParamsToModel () {
        Object.assign(this.model, this.queryParams)
        if (!this.model.status || this.model.status === '') {
          this.chooseStatus = ['']
        } else {
          this.chooseStatus = [`${this.model.status}`]
        }
        if (this.model.res && this.model.res !== '') {
          this.chooseStatus.push(`${this.model.res}`)
        }
        this.chooseDate = []
        if (this.model.openstart && this.model.openstart !== '' && this.model.openend && this.model.openend !== '') {
          this.chooseDate = [this.model.openstart, this.model.openend]
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  .status-select {
    width: 150px
  }

  .inputId {
    width: 80px;
  }

</style>
