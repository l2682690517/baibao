import Vue from 'vue'
import * as Constants from '../constants'
import qs from 'qs'
export default {
  create(formData) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/v1/version`, formData)
  },
  updateDescAndEnabled(id, formData) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/v1/version/${id}`, qs.stringify(formData))
  },
  getList(filter) {
    return Vue.axios.get(`${Constants.URL_PREFIX}/v1/version`, {params: filter})
  },
  getItem(id) {
    return Vue.axios.get(`${Constants.URL_PREFIX}/v1/version/${id}`)
  },
  deleteVersion(id) {
    return Vue.axios.delete(`${Constants.URL_PREFIX}/v1/version/${id}`)
  }
}
