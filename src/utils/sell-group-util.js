export const getFriendlyStatusName = (group) => {
  let name = ''
  switch (group.status) {
    case 1:
      name = '报名中'
      break
    case 2:
      name = '进行中'
      break
    case 3:
      name = '结束'
  }
  if (group.status === 3) {
    if (group.res === 1) {
      name += '(成功)'
    } else if (group.res === 2) {
      name += '(失败)'
    } else {
      name += '(未结算)'
    }
  }
  return name
}

export const getAllMemberReward = (group) => {
  let total = 0
  if (group && group.members) {
    group.members.forEach(item => {
      if (!item.is_leader) {
        total += item.reward
      }
    })
  }
  return total
}

export const getLeaderReward = (group) => {
  if (group && group.members) {
    for (let item of group.members) {
      if (item.is_leader) {
        return item.reward
      }
    }
  }
  return 0
}

export const isShowReward = (group) => {
  return group.status === 2 || (group.status === 3 && (group.res === 1 || group.res === 0))
}

export const getLocalTime = (date) => {
  let res = new Date(parseInt(date)).toLocaleString().replace(/:\d{1,2}$/, ' ')
  return res
}

export const getTimeJoinEnd = (group) => {
  let data = ''
  switch (group.status) {
    case 1:
      data = '预计报名截止时间'
      break
    case 2:
      data = '结束报名时间'
      break
    case 3:
      data = '结束报名时间'
  }
  return data
}
export const getTimeGroupEnd = (group) => {
  let data = ''
  switch (group.status) {
    case 1:
      data = '预计组团结束时间'
      break
    case 2:
      data = '预计组团结束时间'
      break
    case 3:
      data = '组团结束时间'
  }
  return data
}
