import * as types from '../types'

const state = {
  allCategory: []
}

const getters = {
  allCategory: state => state.allCategory
}

const mutations = {
  [types.UPDATE_ALL_CATEGORY] (state, categoryList) {
    if (!categoryList) {
      state.allCategory = []
      return
    }
    state.allCategory = categoryList
  }
}

export default {
  state,
  getters,
  mutations
}
