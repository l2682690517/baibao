import axios from 'axios'
import * as Constants from '../constants'
import qs from 'qs'

const getList = () => {
  return axios.get(`${Constants.URL_PREFIX}/cms/service/list`)
}

const getItem = (name) => {
  return axios.get(`${Constants.URL_PREFIX}/cms/service`, {
    params: {name}
  })
}

const delItem = (name) => {
  return axios.post(`${Constants.URL_PREFIX}/cms/service/del`, qs.stringify({
    name
  }))
}

const create = (name, content) => {
  return axios.post(`${Constants.URL_PREFIX}/cms/service/create`, qs.stringify({
    name,
    j: JSON.stringify(content)
  }))
}

const update = (name, content) => {
  return axios.post(`${Constants.URL_PREFIX}/cms/service`, qs.stringify({
    name,
    j: JSON.stringify(content)
  }))
}

export default {
  getList,
  getItem,
  delItem,
  create,
  update
}
