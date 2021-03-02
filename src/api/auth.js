import Vue from 'vue'
import * as Constants from '../constants'
import * as types from '../store/types'
import store from '../store'

export default {
  login (creds) {
    return new Promise((resolve, reject) => {
      Vue.axios.post(Constants.URL_PREFIX + '/pub/login', creds)
        .then((res) => {
          store.commit(types.LOGIN, res.data)
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  logout() {
    return new Promise((resolve, reject) => {
      Vue.axios.get(Constants.URL_PREFIX + '/pub/logout')
        .then((res) => {
          store.commit(types.LOGOUT)
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getMe() {
    return new Promise((resolve, reject) => {
      Vue.axios.get(Constants.URL_PREFIX + '/uc')
        .then((res) => {
          store.commit(types.UPDATE_PROFILE, res.data)
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  changeMePwd(oldPwd, newPwd) {
    return Vue.axios.post(Constants.URL_PREFIX + '/uc/passwd', {
      oldPassword: oldPwd,
      newPassword: newPwd,
      confirmPassword: newPwd
    })
  }
}
