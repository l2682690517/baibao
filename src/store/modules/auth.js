import * as types from '../types'

const state = {
  me: {}
}

const getters = {
  me: state => state.me,
  isLogin: state => {
    if (state.me && state.me.id) {
      return true
    }
    return false
  }
}

const mutations = {
  /**
   * 登录
   * @param state
   * @param me
   */
  [types.LOGIN] (state, me) {
    state.me = me
  },
  /**
   * 更新Me
   * @param state
   * @param me
   */
  [types.UPDATE_PROFILE] (state, me) {
    state.me = me
  },
  /**
   * 登出
   * @param state
   */
  [types.LOGOUT] (state) {
    state.me = {}
  }
}

export default {
  state,
  getters,
  mutations
}
