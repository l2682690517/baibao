import qs from 'qs'
import axios from 'axios'
import * as Constants from '../constants'

export default {
  getList() {
    return axios.get(`${Constants.URL_PREFIX}/cms/agreement/list`, {
      params: {
      }
    }).then(res => {
      if (!res.data) {
        return []
      } else {
        return res.data
      }
    })
  },
  getItem(name) {
    return axios.get(`${Constants.URL_PREFIX}/cms/agreement`, {
      params: {
        name: name
      }
    }).then(res => {
      if (!res.data || !res.data.data) {
        return {}
      } else {
        return res.data.data
      }
    })
  },
  delAgreementItem(name) {
    return axios.post(`${Constants.URL_PREFIX}/cms/agreement/del`, qs.stringify({
      name
    }))
  },
  updateAgreementItem(name, agreement) {
    return axios.post(`${Constants.URL_PREFIX}/cms/agreement/edit`, qs.stringify(
      {
        name: name,
        j: JSON.stringify({
          data: agreement
        })
      }
    ))
  },
  createAgreementItem(name, agreement) {
    return axios.post(`${Constants.URL_PREFIX}/cms/agreement/create`, qs.stringify(
      {
        name: name,
        j: JSON.stringify({
          data: agreement
        })
      }
    ))
  }
}
