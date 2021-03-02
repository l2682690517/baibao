import Vue from 'vue'
import * as Constants from '../constants'

export default {
  getSysUserList(params) {
    return Vue.axios.get(Constants.URL_PREFIX + '/sysuser', {
      params: params
    })
  },
  getSysUser(id) {
    return Vue.axios.get(Constants.URL_PREFIX + '/sysuser/' + id)
  },
  editSysUser(id, params) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/sysuser/${id}`, params)
  },
  createSysUser(params) {
    params.enabled = true
    return Vue.axios.post(`${Constants.URL_PREFIX}/sysuser`, params)
  },
  enableManager(id, isEnabled) {
    let formData = new FormData()
    formData.append('enabled', isEnabled)
    return Vue.axios.post(`${Constants.URL_PREFIX}/sysuser/${id}/enabled`, formData)
  }
}
