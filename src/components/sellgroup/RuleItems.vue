<template lang="pug">
  div.rule-items-wrapper
    div.table-wrapper
      el-row.header-wrapper
        el-col.index-number 阶梯
        el-col.member-count 团员数量
        el-col.sell-amount 销售额
        el-col.reward-amount 奖励总额
        el-col.leader-reward 团长奖金
        el-col.team-reward 团队奖金
        el-col.del 操作
      el-row.content-wrapper(v-for!="(item, index) in rule.items", :key="item.id", v-if!="!item.del")
        el-col.index-number
          el-form-item {{ realItemIndex(item) }}
        el-col.member-count
          el-form-item(:prop="'items.' + index + '.member_count'", :rules="rules.member_count")
            el-input(size="small", v-model="item.member_count", @blur="inputBlur")
        el-col.sell-amount.cell-content
          div ¥
          div
            el-form-item(:prop="'items.' + index + '.sell_amount'", :rules="rules.sell_amount")
              el-input(size="small", v-model="item.sell_amount", @blur="inputBlur")
        el-col.reward-amount.cell-content
          div ¥
          div
            el-form-item(:prop="'items.' + index + '.reward_amount'", :rules="rules.reward_amount")
              el-input(size="small", v-model="item.reward_amount", @blur="inputBlur")
        el-col.leader-reward {{ showLeaderRewardMoney(item) }}
        el-col.team-reward {{ showTeamRewardMoney(item) }}
        el-col.del
          el-button.delete-btn(size="mini", type="danger", icon="el-icon-delete", @click="deleteRuleItem(item, index)")
      el-row.content-wrapper(v-if!="!rule.items || rule.items.length === 0")
          div.empty-wrapper 没有数据

</template>

<script>
  import Vue from 'vue'
  import { convertFenToYuan, convertYuanToFen } from 'src/utils/moneyUtil'

  const regInt = /(^[1-9]([0-9]+)?$)/

  export default {
    props: {
      rule: {
        type: Object
      }
    },
    data () {
      const validateMemberCount = (rule, value, callback) => {
        if (value) {
          let reg = /(^[1-9]([0-9]+)?$)/
          if (!reg.test(value)) {
            callback(new Error('请输入大于1的整数'))
            return
          }
          if (parseInt(value) <= 1) {
            callback(new Error('请输入大于1的整数'))
          }
        }
        callback()
      }
      const validateSellAmount = (rule, value, callback) => {
        if (value) {
          let reg = /(^[1-9]([0-9]+)?$)/
          if (!reg.test(value)) {
            callback(new Error('请输入正整数'))
            return
          }
        }
        callback()
      }
      const validateRewardAmount = (rule, value, callback) => {
        if (value) {
          if (!regInt.test(value)) {
            callback(new Error('请输入正整数'))
            return
          }
        }
        callback()
      }

      return {
        rules: {
          member_count: [
            {required: true, message: '请输入团员数量', trigger: 'blur'},
            {validator: validateMemberCount, trigger: 'blur'}
          ],
          sell_amount: [
            {required: true, message: '请输入销售额', trigger: 'blur'},
            {validator: validateSellAmount, trigger: 'blur'}
          ],
          reward_amount: [
            {required: true, message: '请输入奖励总额', trigger: 'blur'},
            {validator: validateRewardAmount, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      realRuleItems () {
        if (!this.rule || !this.rule.items) {
          return []
        }
        return this.rule.items.filter((item) => {
          return !item.del
        })
      }
    },
    methods: {
      deleteRuleItem (item, index) {
        if (!item.id) {
          this.rule.items.splice(index, 1)
        } else {
          Vue.set(item, 'del', true)
        }
      },
      inputBlur (event) {
        this.$emit('blur', event)
      },
      showLeaderRewardMoney (item) {
        if (!this.rule || !this.rule.leader_ratio || !item.reward_amount) {
          return '-'
        }
        if (!regInt.test(item.reward_amount)) {
          return '-'
        }
        return `¥${convertFenToYuan(convertYuanToFen(item.reward_amount).mul(this.rule.leader_ratio.div(100)))}`
      },
      showTeamRewardMoney (item) {
        if (!this.rule || !this.rule.team_ratio || !item.reward_amount) {
          return '-'
        }
        if (!regInt.test(item.reward_amount)) {
          return '-'
        }
        return `¥${convertFenToYuan(convertYuanToFen(item.reward_amount).mul(this.rule.team_ratio.div(100)))}`
      },
      realItemIndex (findItem) {
        return this.realRuleItems.findIndex((item) => {
          return item === findItem
        }) + 1
      }
    }
  }
</script>

<style lang="scss" scoped>

  .rule-items-wrapper {
    white-space: nowrap;

    .table-wrapper {
      width: 740px;
    }

    .header-wrapper {

      background-color: #eef1f6;

      & > div {
        border-left: 1px solid #dbdcdf;
        border-top: 1px solid #dbdcdf;
        border-bottom: 1px solid #dbdcdf;
        text-align: center;

        &:last-child {
          border-right: 1px solid #dbdcdf;
        }
      }

    }

    .content-wrapper {

      & > div {
        padding: 10px;
        height: 65px;
        border-left: 1px solid #dbdcdf;
        border-bottom: 1px solid #dbdcdf;
        text-align: center;

        &:last-child {
          border-right: 1px solid #dbdcdf;
        }

        .delete-btn {
          width: 20px;
          height: 20px;
          padding: 0;
        }
      }

    }

    .empty-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .index-number {
      width: 70px;
    }
    .member-count {
      width: 120px;
    }
    .sell-amount {
      width: 120px;
      &.cell-content {
        display: flex;

        & > :first-child {
          margin-right: 3px;
        }
      }
    }
    .reward-amount {
      width: 120px;
      &.cell-content {

        & > :first-child {
          margin-right: 3px;
        }

        display: flex;
      }
    }
    .leader-reward {
      width: 120px;
    }
    .team-reward {
      width: 120px;
    }
    .del {
      width: 70px;
    }
  }

  .sign {
    margin-right: 5px;
  }

</style>
