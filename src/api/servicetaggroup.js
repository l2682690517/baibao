import Vue from 'vue'
import axios from 'axios'
import * as Constants from '../constants'
import { UPDATE_ALL_SERVICE_GROUP_TAG } from 'src/store/types'

const getPostTagIds = (tags) => {
  if (!tags) {
    return []
  }
  return tags.map((item) => {
    return item.id
  })
}

export const create = (params) => {
  params.tag_ids = getPostTagIds(params.tags)
  params.tags = null
  return axios.post(`${Constants.URL_PREFIX}/servicetaggroup`, params)
}

export const delItem = (id) => {
  return axios.delete(`${Constants.URL_PREFIX}/servicetaggroup/${id}`)
}

export const update = (id, params) => {
  params.tag_ids = getPostTagIds(params.tags)
  params.tags = null
  return axios.post(`${Constants.URL_PREFIX}/servicetaggroup/${id}`, params)
}

export const getList = () => {
  return axios.get(`${Constants.URL_PREFIX}/servicetaggroup`).then(res => {
    Vue.$store.commit(UPDATE_ALL_SERVICE_GROUP_TAG, res.data.data || [])
  })
}

export const getItem = (id) => {
  return axios.get(`${Constants.URL_PREFIX}/servicetaggroup/${id}`)
}

