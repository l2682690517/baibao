import axios from 'axios'
import * as Constants from '../constants'

export const getList = () => {
  return axios.get(`${Constants.URL_PREFIX}/v1/delivery/region`)
}

export const create = (formData) => {
  return axios.post(`${Constants.URL_PREFIX}/v1/delivery/region`, formData)
}

export const getItem = (id) => {
  return axios.get(`${Constants.URL_PREFIX}/v1/delivery/region/s/${id}`)
}

export const deleteItem = (id) => {
  return axios.delete(`${Constants.URL_PREFIX}/v1/delivery/region/s/${id}`)
}

export const updateItem = (formData, id) => {
  return axios.post(`${Constants.URL_PREFIX}/v1/delivery/region/s/${id}`, formData)
}
