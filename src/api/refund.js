import axios from 'axios'
import * as Constants from '../constants'
import qs from 'qs'

export const getRefundingCount = (uid) => {
  return axios.get(`${Constants.URL_PREFIX}/oi/refund/count`, {
    params: {
      status: 100,
      uid: uid || ''
    }
  })
}

export const getList = (params) => {
  return axios.get(`${Constants.URL_PREFIX}/oi/refund`, {params})
}

export const getItem = (oiid) => {
  return axios.get(`${Constants.URL_PREFIX}/oi/refund/show/${oiid}`)
}

export const reply = (oiid, txt, remark) => {
  return axios.post(`${Constants.URL_PREFIX}/oi/refund/show/${oiid}/reply`,
    qs.stringify({txt, remark}))
}

export const reject = (oiid, txt, remark) => {
  return axios.post(`${Constants.URL_PREFIX}/oi/refund/show/${oiid}/refuse`,
    qs.stringify({txt, remark}))
}

export const agree = (oiid, amount, profit, txt, isRefundVoucher, remark) => {
  return axios.post(`${Constants.URL_PREFIX}/oi/refund/show/${oiid}/agree`,
    qs.stringify({txt, amount, profit, is_refund_voucher: isRefundVoucher, remark: remark}))
}

export const refundToWx = (id, oiid) => {
  return axios.get(`${Constants.URL_PREFIX}/order/${id}/items/s/${oiid}/refund/to/weixin`)
}
