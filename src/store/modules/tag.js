import * as types from '../types'

const state = {
  allTagGroup: [],
  chooseTags: []
}

const getters = {
  allTagGroup: state => state.allTagGroup
}

const mutations = {
  [types.ADD_TAG_GROUP_ITEM] (state, tagGroup) {
    state.allTagGroup.unshift(tagGroup)
  },
  [types.DELETE_TAG_GROUP_ITEM] (state, id) {
    state.allTagGroup = state.allTagGroup.filter((item) => {
      return item.id !== id
    })
  },
  [types.UPDATE_ALL_TAG_GROUP] (state, tagGroupList) {
    if (!tagGroupList) {
      tagGroupList = []
    }
    tagGroupList.forEach((item) => {
      item.createText = ''
    })
    state.allTagGroup = tagGroupList
  },
  [types.UPDATE_TAG_GROUP_ITEM_NAME] (state, {tagGroup, newName}) {
    tagGroup.name = newName
  },
  [types.UPDATE_TAG_GROUP_CREATE_TEXT] (state, {tagGroup, createText}) {
    tagGroup.createText = createText
  },
  [types.ADD_TAG_ITEM] (state, {tagGroup, newTag}) {
    if (!tagGroup.tags) {
      tagGroup.tags = []
    }
    tagGroup.tags.unshift(newTag)
  },
  [types.DELETE_TAG_ITEM] (state, {tagGroup, tagId}) {
    tagGroup.tags = tagGroup.tags.filter((item) => {
      return item.id !== tagId
    })
  },
  [types.UPDATE_TAG_ITEM_NAME] (state, {tag, newName}) {
    tag.name = newName
  }
}

export default {
  state,
  getters,
  mutations
}
