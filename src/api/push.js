import Vue from 'vue'
import * as Constants from '../constants'
// import qs from 'qs'
export default {
  create(formData) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/v1/push`, formData)
  },
  getList(filterForm) {
    let startTime = ''
    let endTime = ''
    let times = filterForm.startTime
    if (times && times.length === 2) {
      startTime = times[0]
      endTime = times[1]
    }
    const params = {
      page: filterForm.page,
      limit: filterForm.limit,
      title: filterForm.title,
      startDate: startTime,
      endDate: endTime
    }
    return Vue.axios.get(`${Constants.URL_PREFIX}/v1/push`, {params: params})
  },
  getPushCount() {
    return Vue.axios.get(`${Constants.URL_PREFIX}/v1/push/count`)
  }
}
