import Vue from 'vue'
import * as Constants from '../constants'
import * as types from '../store/types'
import store from '../store'

export default {
  getTagGroupList() {
    return Vue.axios.get(Constants.URL_PREFIX + '/taggroup').then((res) => {
      store.commit(types.UPDATE_ALL_TAG_GROUP, res.data.data)
      return res
    })
  },
  createTagGroup(json) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/taggroup`, json).then((res) => {
      store.commit(types.ADD_TAG_GROUP_ITEM, res.data)
      return res
    })
  },
  editTagGroup(tagGroup, json) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/taggroup/${tagGroup.id}`, json).then((res) => {
      store.commit(types.UPDATE_TAG_GROUP_ITEM_NAME, {'tagGroup': tagGroup, 'newName': json.name})
      return res
    })
  },
  deleteTagGroup(id) {
    return Vue.axios.delete(`${Constants.URL_PREFIX}/taggroup/${id}`).then((res) => {
      store.commit(types.DELETE_TAG_GROUP_ITEM, id)
      return res
    })
  },
  createTag(tagGroup, name) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/tag`, {
      name: name,
      gid: tagGroup.id
    }).then((res) => {
      store.commit(types.ADD_TAG_ITEM, {'tagGroup': tagGroup, 'newTag': res.data})
      return res
    })
  },
  updateTag(gid, tag, newName) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/tag/${tag.id}`, {
      name: newName,
      gid: gid
    }).then((res) => {
      store.commit(types.UPDATE_TAG_ITEM_NAME, {tag, newName})
      return res
    })
  },
  deleteTag(tagGroup, tagId) {
    return Vue.axios.delete(`${Constants.URL_PREFIX}/tag/${tagId}`)
      .then((res) => {
        store.commit(types.DELETE_TAG_ITEM, {tagGroup, tagId})
        return res
      })
  }
}
