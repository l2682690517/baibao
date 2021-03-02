<template lang="pug">
  div
    el-dialog.dialog(title="团队详情",size="large", :visible.sync="dialogVisible", @close="closeCallback")
      div
        div.divStyle 团队状态：{{ getFriendlyStatusName }}
        div.divStyle 团队ID：{{ group.id }}
        div.divStyle 开团时间：{{ startTick }}
        div.divStyle {{ getTimeJoinEnd }} : {{ joinEndTime }}
        div.divStyle {{ getTimeGroupEnd }} : {{ groupEndTiem }}
        div.sta(v-if!="group && group.members")
          div 成员：{{ group.member_count }}
          div(v-if="isShowReward") 团长奖金：{{ getLeaderReward | price }}
          div(v-if="isShowReward") 团队奖金：{{ getAllMemberReward | price }}
        div.tab-member
          el-table(:data="group.members", border)
            el-table-column(label="成员ID")
              template(slot-scope="scope")
                div {{ scope.row.shop_id }}
                  span.leader(v-if!="scope.row.is_leader") 团长
            el-table-column(label="销售额")
              template(slot-scope="scope")
                div {{ scope.row.amount | price }}
            el-table-column(prop="name", label="奖金")
              template(slot-scope="scope")
                div
                  div(v-if="isShowReward")  {{ scope.row.reward | price }}
                  div(v-else) ————
        div.el-dialog__title.title 姐妹团规则
          div.rule-time(v-if!="group.rule")
            div 开团后{{ group.rule.total_duration }}小时自动结束
            div 开团后{{ group.rule.enroll_duration }}小时报名截止
        div.rule-items-title 奖励阶梯
        div.rule-items(v-if!="group && group.rule")
          el-table(:data="group.rule.items", border)
            el-table-column(label="阶梯", width="100px")
              template(slot-scope="scope")
                div(:class="{active:activeClass(scope.row)}") {{scope.$index+1}}
            el-table-column(label="团员数量")
              template(slot-scope="scope")
                div(:class="{active:activeClass(scope.row)}") {{scope.row.member_count}}
            el-table-column(label="销售额")
              template(slot-scope="scope")
                div(:class="{active:activeClass(scope.row)}") {{ scope.row.sell_amount | price }}
            el-table-column(label="奖励总额")
              template(slot-scope="scope")
                div(:class="{active:activeClass(scope.row)}") {{ scope.row.reward_amount | price }}
            el-table-column(label="团长奖金")
              template(slot-scope="scope")
                div(:class="{active:activeClass(scope.row)}") {{ scope.row.leader_reward | price }}
            el-table-column(label="团队奖金")
              template(slot-scope="scope")
                div(:class="{active:activeClass(scope.row)}") {{ scope.row.team_reward | price }}


</template>

<script>
  import {
    getFriendlyStatusName,
    getAllMemberReward,
    getLeaderReward,
    isShowReward,
    getLocalTime,
    getTimeJoinEnd,
    getTimeGroupEnd
  } from 'src/utils/sell-group-util'

  export default {
    data () {
      return {
        dialogVisible: false,
        group: {},
        memberCount: 0
      }
    },
    computed: {
      getFriendlyStatusName () {
        return getFriendlyStatusName(this.group)
      },
      getTimeGroupEnd () {
        return getTimeGroupEnd(this.group)
      },
      getTimeJoinEnd () {
        return getTimeJoinEnd(this.group)
      },
      getAllMemberReward () {
        return getAllMemberReward(this.group)
      },
      getLeaderReward () {
        return getLeaderReward(this.group)
      },
      isShowReward () {
        return isShowReward(this.group)
      },
      startTick () {
        return getLocalTime(this.group.start_tick)
      },
      joinEndTime () {
        return getLocalTime(this.group.join_end)
      },
      groupEndTiem () {
        return getLocalTime(this.group.end_tick)
      }
    },
    methods: {
      activeClass (row) {
        let arr = this.group.rule.items.map((i) => {
          let arr = []
          arr.push(i.member_count)
          return arr
        })
        let max = () => {
          return Math.max.apply(null, arr)
        }
        this.memberCount = max()
        let num = () => {
          for (let i = 0; i < arr.length; i++) {
            let num = 0
            if (this.group.member_count >= this.memberCount) {
              num = this.memberCount
              return num
            } else if (arr[i + 1] !== undefined) {
              if (this.group.member_count >= arr[i] && this.group.member_count < arr[i + 1]) {
                num = parseInt(arr[i])
                return num
              }
            } else if (arr[i + 1] === undefined && this.group.member_count >= this.memberCount) {
              num = this.memberCount
              return num
            }
          }
        }
        if (row.member_count === num()) {
          return true
        } else {
          return false
        }
      },
      show (group) {
        this.group = group
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      closeCallback () {
        this.group = {}
      }
    }
  }
</script>

<style lang="scss" scoped>
  .active {
    font-weight: 700;
    color: #ff684f;
  }

  .dialog {
    margin: auto;
    width: 1200px;
  }

  .divStyle {
    margin: 15px 0px 15px 0px;
  }

  .member-tab {
    width: 240px;
  }

  .sta {
    font-size: 14px;
    & > div {
      display: inline-block;
      margin-right: 25px;
    }
  }

  .tab-member {
    margin-top: 8px;
  }

  .title {
    margin-top: 15px;
  }

  .rule-time {
    margin-top: 8px;
    & > div {
      font-size: 14px;
      margin-top: 2px;
    }
  }

  .rule-items-title {
    margin-top: 8px;
    font-size: 14px;
  }

  .rule-items {
    margin-top: 8px;
  }

  .leader {
    margin-left: 10px;
    color: #99A9BF;
  }

</style>
