import qs from 'qs'
import axios from 'axios'
import * as types from '../store/types'
import * as Constants from '../constants'
import Vue from 'vue'

export const getList = (save = true) => {
  return axios.get(`${Constants.URL_PREFIX}/cms/page`, {
    params: {
      name: `home`
    }
  }).then(res => {
    let result = {data: [], mt: 0}
    if (res.data && res.data.data) {
      result.data = res.data.data
      result.data.forEach(item => {
        let targetItem = {show_tp: 0, show_start: '', show_end: ''}
        Object.assign(targetItem, item)
        Object.assign(item, targetItem)
      })
    }
    if (res.data && res.data.mt) {
      result.mt = res.data.mt
    }
    if (save) {
      Vue.$store.commit(types.UPDATE_ALL_CUSTOM_PAGE, result)
    }
    return result
  })
}

export const updateRawDataList = (dataList) => {
  let result = {data: dataList || [], mt: new Date().getTime()}
  Vue.$store.commit(types.UPDATE_ALL_CUSTOM_PAGE, result)
  return axios.post(`${Constants.URL_PREFIX}/cms/page`, qs.stringify(
    {
      name: `home`,
      j: JSON.stringify(result)
    }
  ))
}

export const getItem = (id) => {
  return getList()
    .then(res => {
      return res.find((item) => {
        return item.id === id
      })
    })
}

export const updateItem = (data) => {
  Vue.$store.commit(types.UPDATE_CUSTOM_PAGE, data)
}

export const deleteItem = (id) => {
  Vue.$store.commit(types.DELETE_CUSTOM_PAGE, id)
}

export const create = (data) => {
  Vue.$store.commit(types.ADD_CUSTOM_PAGE, data)
}
