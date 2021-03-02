import { convertYuanToFen, convertFenToYuan } from './moneyUtil'
import {
  PUT_POINT_ORDER_AMOUNT,
  PUT_POINT_ORDER_COUNT,
  RANGE_TYPE_PRODUCT,
  RANGE_TYPE_ALL,
  PUT_TYPE_SYSTEM,
  PUT_TYPE_MANUAL,
  PUT_TYPE_ORIENTATION,
  PUT_TYPE_DETAILS
} from 'src/constants/voucher'

export const generatePostParamFromFormData = (formData, choosePids, id) => {
  let expiryTp = parseInt(formData.expiry_tp)
  let expiryDay = 0
  let startTick = 0
  let endTick = 0
  if (expiryTp === 1) {
    startTick = formData.tickRange[0].getTime()
    endTick = formData.tickRange[1].getTime() + 1000 * 60 * 60 * 24 - 1000
  } else if (expiryTp === 2) {
    expiryDay = parseInt(formData.expiry_day) || 0
  }

  const obj = {
    name: formData.name,
    enabled: 1,
    put_tp: formData.put_tp,
    put_point: formData.put_tp === PUT_TYPE_MANUAL || formData.put_tp === PUT_TYPE_DETAILS || formData.put_tp === PUT_TYPE_ORIENTATION ? 0 : formData.put_point, // 手动发放没有类型
    put_total: formData.put_tp === PUT_TYPE_MANUAL ? parseInt(formData.put_total) : 0, // 手动发放，有发放总量
    put_status: 1,
    amount: convertYuanToFen(formData.amount),
    full_amount: convertYuanToFen(formData.full_amount),
    quota: formData.quota,
    share: formData.put_tp === PUT_TYPE_SYSTEM ? false : formData.share,
    expiry_tp: expiryTp,
    expiry_day: expiryDay,
    start_tick: startTick,
    end_tick: endTick,
    range_tp: formData.range_tp,
    category_id: 0,
    pid_list: formData.range_tp === RANGE_TYPE_PRODUCT ? choosePids : [],
    exclude_pid_list: formData.range_tp === RANGE_TYPE_ALL ? choosePids : [],
    sys_remark: formData.sys_remark
  }
  // 消费相关
  if (formData.put_tp === PUT_TYPE_SYSTEM && (formData.put_point === PUT_POINT_ORDER_AMOUNT || formData.put_point === PUT_POINT_ORDER_COUNT)) {
    obj.order_start_tick = formData.orderTickRange[0].getTime()
    obj.order_end_tick = formData.orderTickRange[1].getTime() + 1000 * 60 * 60 * 24 - 1000
    if (formData.put_point === PUT_POINT_ORDER_AMOUNT) {
      obj.order_n = convertYuanToFen(formData.order_n)
    } else {
      obj.order_n = parseInt(formData.order_n)
    }
  }
  return obj
}

export const generateFormDataFromVoucher = (voucher) => {
  let expiryTp = voucher.expiry_tp
  let expiryDay = 0
  let tickRange = []
  if (expiryTp === 1) {
    tickRange = [new Date(voucher.start_tick), new Date(voucher.end_tick)]
  } else if (expiryTp === 2) {
    expiryDay = voucher.expiry_day
  }
  const obj = {
    name: voucher.name,
    put_tp: voucher.put_tp,
    put_point: voucher.put_point,
    put_total: String(voucher.put_total),
    amount: String(convertFenToYuan(voucher.amount)),
    full_amount: String(convertFenToYuan(voucher.full_amount)),
    quota: voucher.quota,
    share: voucher.share,
    expiry_tp: expiryTp,
    expiry_day: expiryDay,
    tickRange: tickRange,
    range_tp: voucher.range_tp,
    product_list: voucher.product_list ? voucher.product_list : [],
    exclude_product_list: voucher.exclude_product_list ? voucher.exclude_product_list : [],
    sys_remark: voucher.sys_remark
  }
  // 消费相关
  if (voucher.put_tp === PUT_TYPE_SYSTEM && (voucher.put_point === PUT_POINT_ORDER_AMOUNT || voucher.put_point === PUT_POINT_ORDER_COUNT)) {
    if (voucher.put_point === PUT_POINT_ORDER_AMOUNT) {
      obj.order_n = String(convertFenToYuan(voucher.order_n))
    } else {
      obj.order_n = String(voucher.order_n)
    }
    obj.orderTickRange = [new Date(voucher.order_start_tick), new Date(voucher.order_end_tick)]
  }
  return obj
}
