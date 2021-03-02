import axios from 'axios'
import * as Constants from '../constants'

export const getList = () => {
  return axios.get(Constants.URL_PREFIX + '/micropage')
}

export const getItem = (id) => {
  return axios.get(`${Constants.URL_PREFIX}/micropage/${id}`)
}

export const create = (formData) => {
  const params = {
    name: formData.name,
    sys_remark: formData.sys_remark,
    items: []
  }
  formData.items.forEach((item) => {
    params.items.push({
      tp: item.tp,
      cover: item.cover,
      content: item.content,
      column_count: item.column_count
    })
  })
  return axios.post(Constants.URL_PREFIX + '/micropage', params)
}

export const update = (id, formData) => {
  const params = {
    name: formData.name,
    sys_remark: formData.sys_remark,
    items: []
  }
  formData.items.forEach((item) => {
    params.items.push({
      id: item.id,
      tp: item.tp,
      cover: item.cover,
      content: item.content,
      column_count: item.column_count
    })
  })
  if (formData.deleteItems) {
    formData.deleteItems.forEach((item) => {
      params.items.push({
        id: item.id,
        tp: item.tp,
        cover: item.cover,
        content: item.content,
        column_count: item.column_count,
        del: true
      })
    })
  }
  return axios.post(`${Constants.URL_PREFIX}/micropage/${id}`, params)
}

export const del = (id) => {
  return axios.delete(`${Constants.URL_PREFIX}/micropage/${id}`)
}
