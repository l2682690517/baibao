import axios from 'axios'
import * as Constants from '../constants'
import { convertYuanToFen } from 'src/utils/moneyUtil'

// todo,使用ramda
const convertToPostData = (formData) => {
  const params = {}
  params.total_duration = parseInt(formData.total_duration)
  params.enroll_duration = parseInt(formData.enroll_duration)
  params.items = []
  formData.items.forEach((item) => {
    params.items.push({
      id: item.id,
      member_count: parseInt(item.member_count),
      sell_amount: parseInt(convertYuanToFen(item.sell_amount)),
      reward_amount: parseInt(convertYuanToFen(item.reward_amount)),
      del: !!item.del
    })
  })
  return params
}

export const getNewestItem = () => {
  return axios.get(`${Constants.URL_PREFIX}/sellgroup/rule/tmpl`)
}

export const create = (formData) => {
  const params = convertToPostData(formData)
  return axios.post(Constants.URL_PREFIX + '/sellgroup/rule/tmpl', params)
}

export const update = (id, formData) => {
  const params = convertToPostData(formData)
  return axios.post(`${Constants.URL_PREFIX}/sellgroup/rule/tmpl/${id}`, params)
}

export const getSales = (params) => {
  return axios.get(`${Constants.URL_PREFIX}/sellgroup/list`, {
    params: params
  })
}

export const summary = (params) => {
  return axios.get(`${Constants.URL_PREFIX}/sellgroup/list/summary`, {
    params: params
  })
}
