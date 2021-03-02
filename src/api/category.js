import Vue from 'vue'
import * as Constants from '../constants'
import store from '../store'
import * as types from '../store/types'

export default {
  getAllCategoryList() {
    return Vue.axios.get(Constants.URL_PREFIX + '/cate')
  },
  setStoreAllCategoryList() {
    return this.getAllCategoryList().then((res) => {
      let rawData = res.data.data
      store.commit(types.UPDATE_ALL_CATEGORY, rawData)
    })
  },
  createCategory(cateId, name) {
    return Vue.axios.post(Constants.URL_PREFIX + '/cate', {
      'cateId': cateId || 0,
      'name': name
    }).then((res) => {
      return res
    })
  },
  editCategory(id, name) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/cate/${id}`, {
      'name': name
    })
  },
  editCategoryCover(id, cover) {
    let formData = new FormData()
    formData.append('cover', cover)
    return Vue.axios.post(`${Constants.URL_PREFIX}/cate/${id}/cover`, formData)
  },
  deleteCategory(id) {
    return Vue.axios.delete(`${Constants.URL_PREFIX}/cate/${id}`)
  },
  sortCategory(cateId, ids) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/sort/cate/${cateId}`, {
      val: ids
    })
  }
}
