import {
  STATUS_WAIT_PAY,
  STATUS_CANCELED,
  STATUS_REFUNDED
} from 'src/constants/orderItem'
import { enableRefund } from './refund'

const checkPartDeliver = (order) => {
  if (order.status === 3) {
    if (order.items.findIndex(
        (item) => {
          return item.dev_status === 1
        }) !== -1) {
      return true
    }
  }
  return false
}

const hasExpress = (order) => {
  if (!order) {
    return false
  }
  if (order.status === 4 || order.status === 5) {
    return true
  }
  if (order.status === 3) {
    if (order.items.findIndex(
        (item) => {
          return item.dev_status === 1
        }) !== -1) {
      return true
    }
  }
  return false
}

const hasRefund = (order) => {
  if (!order) {
    return false
  }
  if (order.items.findIndex(
      (item) => {
        return enableRefund(item)
      }) !== -1) {
    return true
  }
  return false
}

const isPaid = (orderItem) => {
  return orderItem.status !== STATUS_WAIT_PAY && orderItem.status !== STATUS_CANCELED && orderItem.status !== STATUS_REFUNDED
}

export default {
  checkPartDeliver,
  hasExpress,
  hasRefund,
  isPaid
}
