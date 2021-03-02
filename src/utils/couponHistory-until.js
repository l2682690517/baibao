export const getText = (row) => {
  let data = ''
  data = getConditionSaleTp(row)
  data = data + getConsumeFrequency(row)
  data = data + getTrial(row)
  data = data + getTimeRange(row)
  data = data + getMentorId(row)
  data = data + getFirst(row)
  data = data + getFrom(row)
  data = data + getShopId(row)
  data = data + getShopName(row)
  data = data + getConsumeTime(row)
  data = data + getNickName(row)
  data = data + getUserId(row)
  data = data + getLevel(row)
  return data
}

export const getConditionSaleTp = (row) => {
  if (row.condition === '{}') {
    return '全部消费者' + '</br>'
  } else {
    let condition = JSON.parse(row.condition)
    let text = ''
    switch (true) {
      case condition.sale_frequency === 604800000:
        if (condition.sale_tp === 1) {
          text = '销售频率：一周内有销售' + '</br>'
        } else {
          text = '销售频率：一周内未销售' + '</br>'
        }
        break
      case condition.sale_frequency === 1209600000:
        if (condition.sale_tp === 1) {
          text = '销售频率：两周内有销售' + '</br>'
        } else {
          text = '销售频率：两周内未销售' + '</br>'
        }
        break
      case condition.sale_frequency === 2592000000:
        if (condition.sale_tp === 1) {
          text = '销售频率：一个月内有销售' + '</br>'
        } else {
          text = '销售频率：一个月内未销售' + '</br>'
        }
        break
      case condition.sale_frequency === 7776000000:
        if (condition.sale_tp === 1) {
          text = '销售频率：三个月内有销售' + '</br>'
        } else {
          text = '销售频率：三个月内未销售' + '</br>'
        }
        break
      case condition.sale_frequency === 15552000000:
        if (condition.sale_tp === 1) {
          text = '销售频率：六个月内有销售' + '</br>'
        } else {
          text = '销售频率：六个月内未销售' + '</br>'
        }
        break
      case condition.sale_tp === 3:
        text = '从未消费过' + '</br>'
        break
      default:
        text = ''
    }
    return text
  }
}
export const getConsumeFrequency = (row) => {
  if (row.condition === '{}') {
    return ''
  } else {
    let condition = JSON.parse(row.condition)
    let text = ''
    switch (true) {
      case condition.consume_frequency === 604800000:
        if (condition.consume_tp === 1) {
          text = '消费频率：一周内有消费' + '</br>'
        } else {
          text = '消费频率：一周内未消费' + '</br>'
        }
        break
      case condition.consume_frequency === 1209600000:
        if (condition.consume_tp === 1) {
          text = '消费频率：两周内有消费' + '</br>'
        } else {
          text = '消费频率：两周内未消费' + '</br>'
        }
        break
      case condition.consume_frequency === 2592000000:
        if (condition.consume_tp === 1) {
          text = '消费频率：一个月内有消费' + '</br>'
        } else {
          text = '消费频率：一个月内未消费' + '</br>'
        }
        break
      case condition.consume_frequency === 7776000000:
        if (condition.consume_tp === 1) {
          text = '消费频率：三个月内有消费' + '</br>'
        } else {
          text = '消费频率：三个月内未消费' + '</br>'
        }
        break
      case condition.consume_frequency === 15552000000:
        if (condition.consume_tp === 1) {
          text = '消费频率：六个月内有消费' + '</br>'
        } else {
          text = '消费频率：六个月内未消费' + '</br>'
        }
        break
      case condition.consume_tp === 3:
        text = '从未消费过' + '</br>'
        break
      default:
        text = ''
    }
    return text
  }
}
export const getTrial = (row) => {
  if (row.condition === '{}') {
    return ''
  } else {
    let condition = JSON.parse(row.condition)
    let text = ''
    switch (true) {
      case condition.trial === '-1':
        text = '全部店铺' + '</br>'
        break
      case condition.trial === '0':
        text = '正式店铺' + '</br>'
        break
      case condition.trial === '1':
        text = '试用店铺' + '</br>'
        break
      default:
        text = ''
    }
    return text
  }
}
export const getTimeRange = (row) => {
  if (row.condition === '{}') {
    return ''
  } else {
    let condition = JSON.parse(row.condition)
    let date1 = ''
    let date2 = ''
    if (condition.起始日期) {
      let dateStr = condition.起始日期
      date1 = dateStr.split('T')[0]
      dateStr = condition.截止日期
      date2 = dateStr.split('T')[0]
      return '起始日期：' + date1 + '截止日期：' + date2 + '</br>'
    }
    return ''
  }
}
export const getMentorId = (row) => {
  if (row.condition === '{}') {
    return ''
  } else {
    let condition = JSON.parse(row.condition)
    if (condition.导师ID) {
      return '导师ID：' + condition.导师ID + '</br>'
    }
    return ''
  }
}
export const getFirst = (row) => {
  if (row.condition === '{}') {
    return ''
  } else {
    let condition = JSON.parse(row.condition)
    if (condition.首单时间) {
      return '首单时间：' + condition.首单时间 + '</br>'
    }
    return ''
  }
}
export const getFrom = (row) => {
  if (row.condition === '{}') {
    return ''
  } else {
    let condition = JSON.parse(row.condition)
    if (condition.邀请人ID) {
      return '邀请人ID：' + condition.邀请人ID + '</br>'
    }
    return ''
  }
}
export const getShopId = (row) => {
  if (row.condition === '{}') {
    return ''
  } else {
    let condition = JSON.parse(row.condition)
    if (condition.店铺ID) {
      return '店铺ID：' + condition.店铺ID + '</br>'
    }
    return ''
  }
}
export const getShopName = (row) => {
  if (row.condition === '{}') {
    return ''
  } else {
    let condition = JSON.parse(row.condition)
    if (condition.name) {
      return '店铺名称：' + condition.name + '</br>'
    }
    return ''
  }
}

export const getConsumeTime = (row) => {
  if (row.condition === '{}') {
    return ''
  } else {
    let condition = JSON.parse(row.condition)
    if (condition.start_tick) {
      let date1 = new Date(parseInt(condition.start_tick)).toLocaleString().replace(/:\d{1,2}$/, ' ')
      let date2 = new Date(parseInt(condition.end_tick)).toLocaleString().replace(/:\d{1,2}$/, ' ')
      return '消费者注册日期：' + date1 + '--' + date2 + '</br>'
    }
    return ''
  }
}
export const getNickName = (row) => {
  if (row.condition === '{}') {
    return ''
  } else {
    let condition = JSON.parse(row.condition)
    if (condition.nick_name) {
      return '用户昵称：' + condition.nick_name + '</br>'
    }
    return ''
  }
}
export const getUserId = (row) => {
  if (row.condition === '{}') {
    return ''
  } else {
    let condition = JSON.parse(row.condition)
    if (condition.消费者ID) {
      return '消费者ID：' + condition.消费者ID + '</br>'
    }
    return ''
  }
}

export const getLevel = (row) => {
  if (row.condition === '{}') {
    return ''
  } else {
    let condition = JSON.parse(row.condition)
    let text = ''
    switch (true) {
      case condition.level === '全部':
        text = '全部等级' + '</br>'
        break
      case condition.level === '青橙':
        text = '店铺等级：青橙' + '</br>'
        break
      case condition.level === '美橙':
        text = '店铺等级：美橙' + '</br>'
        break
      case condition.level === '金橙':
        text = '店铺等级：金橙' + '</br>'
        break
      default:
        text = ''
    }
    return text
  }
}
