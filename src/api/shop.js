import Vue from 'vue'
import * as Constants from '../constants'
import qs from 'qs'
import { convertYuanToFen } from 'src/utils/moneyUtil'

const getList = (filter) => {
  if (filter.export === 1) {
    let link = document.createElement('a')
    link.href = Constants.URL_PREFIX + '/shop?' + qs.stringify(filter)
    link.target = '_blank'
    link.click()
    return
  }
  return Vue.axios.get(Constants.URL_PREFIX + '/shop', {
    params: filter
  })
}

const getItem = (id) => {
  return Vue.axios.get(`${Constants.URL_PREFIX}/shop/${id}`)
}

const getSoldList = (id, params) => {
  return Vue.axios.get(`${Constants.URL_PREFIX}/shop/${id}/sold`, {
    params: params
  })
}

const IncomeList = (id, params) => {
  return Vue.axios.get(`${Constants.URL_PREFIX}/shop/${id}/profit`, {
    params: params
  })
}

export const getMentors = () => {
  return Vue.axios.get(`${Constants.URL_PREFIX}/v1/shop/mentor`)
}

export const updateShopSub = (id, sub) => {
  return Vue.axios.post(`${Constants.URL_PREFIX}/shop/${id}/sub`, qs.stringify({
    sub
  }))
}

export const activeShop = (id) => {
  return Vue.axios.post(`${Constants.URL_PREFIX}/shop/${id}/active`)
}
export const enabledShop = (id, targetstatus) => {
  return Vue.axios.post(`${Constants.URL_PREFIX}/shop/${id}/enabled`, qs.stringify({
    targetstatus
  }))
}

export const readyCloseShop = (id) => {
  return Vue.axios.get(`${Constants.URL_PREFIX}/shop/${id}/ready/close`)
}

export const closeShop = (id, formData) => {
  let params = {
    amount: convertYuanToFen(formData.amount)
  }
  return Vue.axios.post(`${Constants.URL_PREFIX}/shop/${id}/close`, qs.stringify(params))
}

export default {
  getMentors,
  getList,
  getItem,
  getSoldList,
  updateShopSub,
  IncomeList,
  activeShop,
  enabledShop,
  readyCloseShop,
  closeShop
}
