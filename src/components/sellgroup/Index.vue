<template lang="pug">
  div.sell-group-index
    el-breadcrumb
      el-breadcrumb-item 姐妹团
    div(v-loading="loading")
      div.action-wrapper
        el-button(type="primary", size="medium", icon="el-icon-plus", @click="addRuleItem") 添加阶梯
        router-link(:to="{name: 'SellGroupSales'}")
          el-button(type="primary", size="medium", icon="el-icon-view") 查看业绩
      div.content-wrapper
        el-form(ref="form", labelWidth="55px", :model="formData", :rules="rules")
          el-form-item(label="开团后", prop="total_duration")
            div.duration-wrapper
              el-input.duration-input(v-model="formData.total_duration")
              div 小时自动结束
          el-form-item(label="开团后", prop="enroll_duration")
            div.duration-wrapper
              el-input.duration-input(v-model="formData.enroll_duration")
              div 小时报名截止
          el-form-item(ref="ruleItemsForm", labelWidth="0px", prop="items")
            rule-items(:rule="formData", @blur="ruleItemsBlur")
      div
        el-button(type="primary", size="medium", :disabled="submitDisabled", @click="submitRule") 提交
</template>

<script>
  import RuleItems from './RuleItems.vue'
  import * as SellGroupApi from 'src/api/sellgroup'
  import {convertFenToYuan} from 'src/utils/moneyUtil'

  const DEFAULT_LEADER_RATIO = 35
  const DEFAULT_TEAM_RATIO = 65

  export default {
    components: {
      RuleItems
    },
    data() {
      const validateTotalDuration = (rule, value, callback) => {
        if (this.formData.total_duration) {
          let reg = /(^[1-9]([0-9]+)?$)/
          if (!reg.test(this.formData.total_duration)) {
            callback(new Error('请输入正整数'))
            return
          }
        }
        callback()
      }
      const validateEnrollDuration = (rule, value, callback) => {
        if (this.formData.enroll_duration) {
          let reg = /(^[1-9]([0-9]+)?$)/
          if (!reg.test(this.formData.enroll_duration)) {
            callback(new Error('请输入正整数'))
            return
          }
          if (this.formData.total_duration) {
            if (reg.test(this.formData.total_duration)) {
              if (parseInt(this.formData.total_duration) < parseInt(this.formData.enroll_duration)) {
                callback(new Error('开团总时间需要大于报名的持续时间'))
                return
              }
            }
          }
        }
        callback()
      }
      const validateItems = (rule, value, callback) => {
        if (!value || value.length <= 1) {
          callback()
          return
        }
        const allMemberCount = []
        const allSellAmount = []

        for (const item of value) {
          if (item.del) {
            continue
          }
          allMemberCount.push(item.member_count)
          allSellAmount.push(item.sell_amount)
        }
        const regInt = /(^[1-9]([0-9]+)?$)/
        for (let i = 0; i < allMemberCount.length; i++) {
          if (i === 0) {
            continue
          }
          const prev = allMemberCount[i - 1]
          const current = allMemberCount[i]
          if (!regInt.test(prev) || !regInt.test(current)) {
            callback()
            return
          }
          if (parseInt(current) <= parseInt(prev) && current > 1 && prev > 1) {
            callback(new Error(`阶梯${i + 1}团员数量需要大于阶梯${i}团员数量`))
            return
          }
        }
        for (let i = 0; i < allSellAmount.length; i++) {
          if (i === 0) {
            continue
          }
          const prev = allSellAmount[i - 1]
          const current = allSellAmount[i]
          if (!regInt.test(prev) || !regInt.test(current)) {
            callback()
            return
          }
          if (parseInt(current) <= parseInt(prev)) {
            callback(new Error(`阶梯${i + 1}销售额需要大于阶梯${i}销售额`))
            return
          }
        }

        callback()
      }

      return {
        loading: false,
        submitDisabled: true,
        formData: {
          items: []
        },
        rules: {
          total_duration: [
            {required: true, message: '请输入开团总时间', trigger: 'blur'},
            {validator: validateTotalDuration, trigger: 'blur'}
          ],
          enroll_duration: [
            {required: true, message: '请输入报名持续时间', trigger: 'blur'},
            {validator: validateEnrollDuration, trigger: 'blur'}
          ],
          items: [
            {validator: validateItems, trigger: 'change'}
          ]
        }
      }
    },
    watch: {
      formData: {
        handler: function (newVal, oldVal) {
          this.submitDisabled = false
        },
        deep: true
      }
    },
    methods: {
      convertToFromData(rule) {
        const ruleToStringKeys = ['total_duration', 'enroll_duration']
        const itemToStringKeys = ['member_count']
        return this.R.mapObjIndexed((val, key, obj) => {
          if (key === 'items') {
            if (!val) {
              return []
            }
            return this.R.map(itemRule => {
              return this.R.mapObjIndexed((itemRuleVal, itemRuleKey, itemRuleObj) => {
                if (itemRuleKey === 'sell_amount' || itemRuleKey === 'reward_amount') {
                  return String(convertFenToYuan(itemRuleVal))
                }
                if (this.R.contains(itemRuleKey)(itemToStringKeys)) {
                  return String(itemRuleVal)
                } else {
                  return itemRuleVal
                }
              })(itemRule)
            })(val)
          }
          if (this.R.contains(key)(ruleToStringKeys)) {
            return String(val)
          } else {
            return val
          }
        })(rule)
      },
      addRuleItem() {
        this.formData.items.push({
          id: 0,
          member_count: '',
          sell_amount: '',
          reward_amount: ''
        })
      },
      submitRule() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            this.$confirm('提交?', '提示').then(async () => {
              this.loading = true
              try {
                let resData
                if (!this.formData.id) {
                  resData = await SellGroupApi.create(this.formData)
                } else {
                  resData = await SellGroupApi.update(this.formData.id, this.formData)
                }
                this.formData = this.convertToFromData(resData.data)
                this.$message({
                  message: '更新成功',
                  type: 'success',
                  showClose: true
                })
                await this.$nextTick()
                this.submitDisabled = true
              } catch (e) {
                this.$myErrorHandler.handle(this, e)
              } finally {
                this.loading = false
              }
            }).catch(() => {
            })
          }
        })
      },
      ruleItemsBlur() {
        this.$refs.ruleItemsForm.onFieldChange()
      }
    },
    beforeRouteEnter(to, from, next) {
      next(async vm => {
        let result = {}
        vm.loading = true
        try {
          const resData = await SellGroupApi.getNewestItem()
          result = resData.data
        } catch (err) {
          // 404时，没有数据，会创建
          if (err.response && err.response.status === 404) {
            result = {
              id: 0,
              total_duration: '',
              enroll_duration: '',
              leader_ratio: DEFAULT_LEADER_RATIO,
              team_ratio: DEFAULT_TEAM_RATIO,
              items: []
            }
          }
        } finally {
          vm.loading = false
        }
        vm.formData = vm.convertToFromData(result)
        await vm.$nextTick()
        vm.submitDisabled = true
      })
    },
    async beforeRouteLeave(to, from, next) {
      if (!this.submitDisabled) {
        this.$confirm('还有提交的数据，要离开界面？', '提示').then(async () => {
          next()
        }).catch(() => {
          next(false)
        })
      } else {
        next()
      }
    }
  }

</script>

<style lang="scss" scoped>

  .action-wrapper {
    & > a {
      margin-left: 20px;
    }
  }

  .content-wrapper {
    margin-top: 20px;
  }

  .duration-wrapper {
    display: flex;

    & > .duration-input {
      width: 100px;
      margin-left: 5px;
      margin-right: 5px;
    }

  }


</style>

<style lang="scss">
  .sell-group-index {

    .el-form-item__label {
      padding-right: 0 !important;
    }

  }
</style>
