import * as types from '../types'
import Vue from 'vue'

const state = {
  customsPages: null,
  mt: 0
}

const getters = {
  customsPages: state => state.customsPages
}

const mutations = {
  [types.UPDATE_ALL_CUSTOM_PAGE] (state, {data, mt}) {
    state.customsPages = data
    state.mt = mt
  },
  [types.UPDATE_ALL_CUSTOM_PAGE_DATA] (state, data) {
    state.customsPages = data || []
  },
  [types.ADD_CUSTOM_PAGE] (state, module) {
    state.customsPages.push(module)
  },
  [types.UPDATE_CUSTOM_PAGE] (state, module) {
    state.customsPages.forEach(function (item) {
      if (item.id === module.id) {
        Object.assign(item, module)
        return false
      }
    })
  },
  [types.DELETE_CUSTOM_PAGE] (state, id) {
    state.customsPages = state.customsPages.filter((item) => {
      console.log(item.id !== id)
      return item.id !== id
    })
  },
  [types.INIT_CUSTOM_PAGE_TITLE] (state, item) {
    if (item && !item.hasOwnProperty('title')) {
      Vue.set(item, 'title', '')
    }
  }
}

export default {
  state,
  getters,
  mutations
}
