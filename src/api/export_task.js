import axios from 'axios'
import * as Constants from '../constants'

export default {
  getList(filter) {
    let params = Object.assign({}, filter)
    return axios.get(Constants.URL_PREFIX + '/export/task', {
      params: params
    })
  }

}

