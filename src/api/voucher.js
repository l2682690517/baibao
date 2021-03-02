import axios from 'axios'
import * as Constants from '../constants'
import * as VoucherFormUtil from 'src/utils/voucherFormUtil'
import qs from 'qs'

export const getList = (formData) => {
  let params = {
    page: formData.page,
    limit: formData.limit,
    name: formData.name,
    put_tp: formData.put_tp,
    sys_remark: formData.sys_remark,
    put_status_stop: formData.put_status_stop,
    expiry: formData.expiry,
    voucher_id: formData.voucher_id
  }

  return axios.get(Constants.URL_PREFIX + '/voucher', {
    params
  })
}

export const getPackageList = (params) => {
  return axios.get(Constants.URL_PREFIX + '/voucher/package', {
    params
  })
}

export const getItem = (id) => {
  return axios.get(`${Constants.URL_PREFIX}/voucher/s/${id}`)
}

export const create = (formData, choosePids) => {
  return axios.post(`${Constants.URL_PREFIX}/voucher`, VoucherFormUtil.generatePostParamFromFormData(formData, choosePids))
}

export const update = (id, formData, choosePids) => {
  return axios.post(`${Constants.URL_PREFIX}/voucher/s/${id}`, VoucherFormUtil.generatePostParamFromFormData(formData, choosePids))
}

export const updatePutStatus = (id, status) => {
  return axios.post(`${Constants.URL_PREFIX}/voucher/s/${id}/putstatus`, qs.stringify({status}))
}

export const genPackageShareUrl = (items) => {
  let ids = []
  items.forEach((item) => {
    ids.push(item.id)
  })
  return axios.post(`${Constants.URL_PREFIX}/voucher/package`, qs.stringify({'ids': ids}, {indices: false}))
}
export const getVoucherHistory = (formData) => {
  let params = {
    limit: formData.limit,
    page: formData.page,
    tp: formData.tp
  }
  return axios.get(`${Constants.URL_PREFIX}/voucher/history`, {params})
}
export const dropVoucher = (row) => {
  let params = {
    record_relate_id: row.id
  }
  return axios.post(`${Constants.URL_PREFIX}/voucher/drop`, qs.stringify(params))
}
