import axios from 'axios'
import * as Constants from '../constants'

export default {
  getList (filter) {
    return axios.get(Constants.URL_PREFIX + '/v1/feedback', {
      params: filter
    })
  },
  getTypes () {
    return axios.get(Constants.URL_PREFIX + '/v1/feedback/types', {
    })
  }
}
