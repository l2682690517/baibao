import Vue from 'vue'
import * as Constants from '../constants'
import qs from 'qs'

let getPostParam = (formData, id) => {
  const items = []
  formData.items.forEach((item) => {
    let newItem = {
      pid: item.product.id,
      tp: item.tp,
      price: item.price,
      discount: item.discount
    }
    if (item.id !== 0) {
      newItem.id = item.id
    }
    items.push(newItem)
  })
  const params = {
    name: formData.name,
    start_time: formData.start_time,
    end_time: formData.end_time,
    items: items
  }
  if (formData.count) {
    params.count = parseInt(formData.count)
  }
  if (id) {
    params.id = id
  }
  return params
}

export default {
  getList (filterForm) {
    let startTime = ''
    let endTime = ''
    let times = filterForm.startTime
    if (times && times.length === 2) {
      startTime = times[0]
      endTime = times[1]
    }
    const params = {
      name: filterForm.name,
      start_time: startTime,
      end_time: endTime,
      sort: filterForm.sort,
      order: filterForm.order,
      status: filterForm.status,
      seckill: filterForm.seckill
    }

    return Vue.axios.get(Constants.URL_PREFIX + '/discount', {
      params: params
    })
  },
  getItem (id) {
    return Vue.axios.get(`${Constants.URL_PREFIX}/discount/${id}`)
  },
  getItems(filterForm) {
    let tagsStr = filterForm.tags
    let params = {
      limit: filterForm.limit,
      page: filterForm.page,
      name: filterForm.name
    }
    if (filterForm.cates) {
      let cates = filterForm.cates.split('_')
      params.cate = cates[cates.length - 1]
    }
    if (tagsStr) {
      params.tags = tagsStr
    }
    return Vue.axios.get(Constants.URL_PREFIX + '/select/discount/items', {
      params: params
    })
  },
  create(formData) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/discount`, getPostParam(formData))
  },
  update(id, formData) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/discount/${id}`, getPostParam(formData, id))
  },
  del(id) {
    return Vue.axios.delete(`${Constants.URL_PREFIX}/discount/${id}`)
  },
  getSimpleItems() {
    return Vue.axios.get(Constants.URL_PREFIX + '/list/discount')
  },
  updateSecKill(id, seckill) {
    return Vue.axios.post(`${Constants.URL_PREFIX}/discount/${id}/seckill`, qs.stringify({seckill}))
  }
}
