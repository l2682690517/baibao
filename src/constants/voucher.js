export const RANGE_TYPE_ALL = 1
export const RANGE_TYPE_PRODUCT = 3

export const PUT_STATUS_RUNNING = 1
export const PUT_STATUS_STOPPED = 2

export const HISTORY_TYPE_SHOP = 1
export const HISTORY_TYPE_CUSTOMER = 2

export const PUT_TYPE_SYSTEM = 1
export const PUT_TYPE_MANUAL = 2
export const PUT_TYPE_ORIENTATION = 3
export const PUT_TYPE_DETAILS = 4
export const getFriendlyNameOfPutType = (type) => {
  switch (type) {
    case PUT_TYPE_SYSTEM:
      return '系统发放'
    case PUT_TYPE_MANUAL:
      return '手动发送'
    case PUT_TYPE_ORIENTATION:
      return '定向发放'
    case PUT_TYPE_DETAILS:
      return '详情页券'
    default:
      return ''
  }
}

export const PUT_POINT_OPEN_SHOP = 1
export const PUT_POINT_SHOP_BIND_MOBILE = 2
export const PUT_POINT_NEW_USER = 3
export const PUT_POINT_ORDER_AMOUNT = 4
export const PUT_POINT_ORDER_COUNT = 5

export const getFriendlyNameOfPutPoint = (type) => {
  switch (type) {
    case PUT_POINT_OPEN_SHOP:
      return '开店奖励'
    case PUT_POINT_SHOP_BIND_MOBILE:
      return ' 达人绑定手机'
    case PUT_POINT_NEW_USER:
      return ' 新用户'
    case PUT_POINT_ORDER_AMOUNT:
      return '消费满N元'
    case PUT_POINT_ORDER_COUNT:
      return '消费满N次'
    default:
      return ''
  }
}
