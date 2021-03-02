import Vue from 'vue'
import axios from 'axios'
import * as Constants from '../constants'
import { UPDATE_ALL_SERVICE_TAG } from 'src/store/types'

export const create = (params) => {
  return axios.post(`${Constants.URL_PREFIX}/servicetag`, params)
}

export const delItem = (id) => {
  return axios.delete(`${Constants.URL_PREFIX}/servicetag/${id}`)
}

export const update = (id, params) => {
  return axios.post(`${Constants.URL_PREFIX}/servicetag/${id}`, params)
}

export const getList = () => {
  return axios.get(`${Constants.URL_PREFIX}/servicetag`)
    .then(res => {
      Vue.$store.commit(UPDATE_ALL_SERVICE_TAG, res.data.data || [])
    })
}

export const getItem = (id) => {
  return axios.get(`${Constants.URL_PREFIX}/servicetag/${id}`)
}

