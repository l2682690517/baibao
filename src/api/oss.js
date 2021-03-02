import Vue from 'vue'
import * as Constants from '../constants'
import axios from 'axios'

export default {
  getToken () {
    return Vue.axios.get(Constants.URL_PREFIX + '/aliyun/oss/token')
  }
}

/**
 *
 * @param imgArr
 * @returns {Promise.<{url, {width, height}}>}
 */
export const getImageSize = (imgArr) => {
  const promiseList = imgArr.map(item => {
    return axios.get(`${item}?x-oss-process=image/info`, {
      loading: false,
      ignoreError: true,
      requestKey: item
    }).then(res => {
      return {url: res.config.requestKey, response: res.data}
    })
  })
  return Promise.all(promiseList).then(arr => {
    let result = {}
    arr.forEach(item => {
      let info = item.response
      let width = 0
      let height = 0
      if (info.ImageWidth && info.ImageWidth.value) {
        width = parseInt(info.ImageWidth.value)
      }
      if (info.ImageHeight && info.ImageHeight.value) {
        height = parseInt(info.ImageHeight.value)
      }
      if (width !== 0 && height !== 0) {
        result[item.url] = {width, height}
      }
    })
    return result
  })
}
