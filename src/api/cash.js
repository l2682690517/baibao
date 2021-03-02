import axios from 'axios'
import * as Constants from '../constants'
import qs from 'qs'

export default {
  getItem(id) {
    return axios.get(`${Constants.URL_PREFIX}/v1/cash/s/${id}`)
  },
  getList (filter) {
    return axios.get(Constants.URL_PREFIX + '/v1/cash', {
      params: filter
    })
  },
  agree(id, remark) {
    return axios.post(`${Constants.URL_PREFIX}/v1/cash/s/${id}/agree`, qs.stringify({
      remark: remark
    }))
  }

}
