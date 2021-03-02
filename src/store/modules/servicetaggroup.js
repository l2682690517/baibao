import { UPDATE_ALL_SERVICE_GROUP_TAG } from '../types'

const state = {
  allServiceTagGroup: []
}

const mutations = {
  [UPDATE_ALL_SERVICE_GROUP_TAG](state, allServiceTagGroup) {
    state.allServiceTagGroup = allServiceTagGroup
  }
}

export default {
  state,
  mutations
}
