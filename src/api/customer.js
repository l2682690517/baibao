import axios from 'axios'
import * as Constants from '../constants'

const getList = (params) => {
  return axios.get(`${Constants.URL_PREFIX}/user`, {
    params
  })
}

const getItem = (id) => {
  return axios.get(`${Constants.URL_PREFIX}/user/${id}`)
}

const getOrderList = (id, params) => {
  return axios.get(`${Constants.URL_PREFIX}/user/${id}/order`, {
    params
  })
}

export default {
  getList,
  getItem,
  getOrderList
}
