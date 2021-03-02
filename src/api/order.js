import axios from 'axios'
import * as Constants from '../constants'
import qs from 'qs'

export default {
  getItem (id) {
    return axios.get(`${Constants.URL_PREFIX}/order/${id}`)
  },
  getList (filter) {
    let params = Object.assign({}, filter)
    if (params.buyers) {
      params.buyers = params.buyers.join('_')
    }
    if (params.status) {
      params.status = params.status.join('_')
    }
    if (params.cate && params.cate.length > 0) {
      params.cate = params.cate[params.cate.length - 1]
    }
    return axios.get(Constants.URL_PREFIX + '/order', {
      params: params
    })
  },
  deliver (id, items) {
    return axios.post(`${Constants.URL_PREFIX}/order/${id}/deliver`, {
      items: items
    })
  },
  getChildItems (id) {
    return axios.get(`${Constants.URL_PREFIX}/order/${id}/items`)
  },
  getChildItem (id, oiid) {
    return axios.get(`${Constants.URL_PREFIX}/order/${id}/items/s/${oiid}`)
  },
  getExpress (id) {
    return axios.get(`${Constants.URL_PREFIX}/order/${id}/express`)
  },
  getOiExpress (oiid) {
    return axios.get(`${Constants.URL_PREFIX}/oi/express/${oiid}`)
  },
  editSysRemark (id, remark) {
    return axios.post(`${Constants.URL_PREFIX}/order/${id}/sysremark`,
      qs.stringify({remark}))
  }
}
