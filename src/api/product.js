import Vue from 'vue'
import * as Constants from '../constants'
import ProductFormUtl from '../utils/productFormUtil'
import qs from 'qs'

export default {
  create (formData) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/prod`, ProductFormUtl.generatePostParamFromFormData(formData))
  },
  update (id, formData) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/prod/${id}`, ProductFormUtl.generatePostParamFromFormData(formData, id))
  },
  getList (formData) {
    let param = this._converParam(formData)
    if (param.export === 1) {
      let link = document.createElement('a')
      link.href = Constants.URL_PREFIX + '/prod?' + qs.stringify(param)
      link.target = '_blank'
      link.click()
      return
    }
    return Vue.axios.get(Constants.URL_PREFIX + '/prod', {
      params: param
    })
  },
  _converParam (formData) {
    let tagsStr = formData.tags
    let cateId = ''
    if (formData.cates) {
      let cates = formData.cates.split('_')
      cateId = cates[cates.length - 1]
    }
    let param = {
      page: formData.page,
      limit: formData.limit,
      ss: formData.status,
      trash: formData.trash
    }
    if (formData.fid) {
      param.fid = formData.fid
    }
    if (formData.sys_remark) {
      param.sys_remark = formData.sys_remark
    }
    if (formData.buyers) {
      param.buyers = formData.buyers.join('_')
    }
    if (formData.top) {
      param.top = '1'
    }
    if (tagsStr) {
      param.tags = tagsStr
    }
    if (cateId) {
      param.cate = cateId
    }
    if (formData.sort) {
      param.sort = formData.sort
    }
    if (formData.order) {
      param.order = formData.order
    }
    if (formData.name) {
      param.name = formData.name
    }
    if (formData.id) {
      param.id = formData.id
    }
    if (formData.sku_code) {
      param.sku_code = formData.sku_code
    }
    if (formData.upStartDate && formData.upEndDate) {
      param.upStartDate = formData.upStartDate
      param.upEndDate = formData.upEndDate
    }
    if (formData.export) {
      param.export = formData.export
    }
    return param
  },
  getItem (id) {
    return Vue.axios.get(Constants.URL_PREFIX + '/prod/' + id)
  },
  updateStatus (id, status) {
    let formData = new FormData()
    formData.append('status', status)
    return Vue.axios.post(`${Constants.URL_PREFIX}/prod/${id}/up`, formData)
  },
  batchUpdateCate (ids, cateId) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/batch/prod/cate`, {
      pids: ids,
      cate: cateId
    })
  },
  batchUpdateStatus (ids, status) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/batch/prod/up`, {
      pids: ids,
      status: status
    })
  },
  batchUpdateTags (ids, result) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/batch/prod/tags`, {
      pids: ids,
      add_tags: result.add_tags,
      del_tags: result.del_tags
    })
  },
  top (id) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/prod/${id}/top`)
  },
  updateContent (id, content) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/cms/prod`, qs.stringify(
      {
        name: `prod_${id}`,
        j: JSON.stringify(content)
      }
    ))
  },
  getContent (id) {
    return Vue.axios.get(`${Constants.URL_PREFIX}/cms/prod`, {
      params: {
        name: `prod_${id}`
      }
    })
  },
  updateTrashStatus (id, trash) {
    let formData = new FormData()
    formData.append('trash', trash)
    return Vue.axios.post(`${Constants.URL_PREFIX}/prod/${id}/trash`, formData)
  },
  updateHideStatus (id, hide) {
    let formData = new FormData()
    formData.append('hide', hide)
    return Vue.axios.post(`${Constants.URL_PREFIX}/prod/${id}/hide`, formData)
  },
  updateSyncStatus (id, sync) {
    let formData = new FormData()
    formData.append('sync', sync)
    return Vue.axios.post(`${Constants.URL_PREFIX}/prod/${id}/toggle/sync`, formData)
  },
  getBuyerList () {
    return Vue.axios.get(`${Constants.URL_PREFIX}/list/product/buyer`)
  }
}
