import Vue from 'vue'
import * as Constants from '../constants'

export default {
  getShortUrl(url) {
    return Vue.axios.get(`${Constants.URL_PREFIX}/v1/shorturl`, {
      params: {
        url: url
      }
    })
  }
}
