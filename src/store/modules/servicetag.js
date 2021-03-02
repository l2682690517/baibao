import { UPDATE_ALL_SERVICE_TAG } from '../types'

const state = {
  allServiceTag: []
}

const mutations = {
  [UPDATE_ALL_SERVICE_TAG](state, allServiceTag) {
    state.allServiceTag = allServiceTag
  }
}

export default {
  state,
  mutations
}
