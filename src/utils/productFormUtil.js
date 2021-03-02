import Vue from 'vue'

const hasRealSku = (skuArr) => {
  return skuArr.findIndex(
    (item) => {
      return !item.del
    }) !== -1
}

/**
 * 返回可编辑的sku数组
 * @param skuArr
 */
const getRealSkuArr = (skuArr) => {
  return skuArr.filter((item) => {
    return !item.del
  })
}

/**
 * 添加新的空规格
 * @param formData
 * @returns 返回添加的空规格
 */
const createEmptySku = (formData) => {
  if (!formData.emptySku) {
    return {
      id: 0,
      spec: '',
      price: parseInt(parseFloat(formData.price).mul(100)),
      stock: parseInt(formData.stock),
      code: formData.code,
      weight: parseInt(parseFloat(formData.weight).mul(1000)),
      image: '',
      del: false
    }
  } else {
    formData.emptySku.price = parseInt(parseFloat(formData.price).mul(100))
    formData.emptySku.weight = parseInt(parseFloat(formData.weight).mul(1000))
    formData.emptySku.stock = parseInt(formData.stock)
    formData.emptySku.code = formData.code
    formData.emptySku.del = false
    return formData.emptySku
  }
}

/**
 * 获得空规格
 * @param product
 * @returns {T}
 */
const getEmptySku = (product) => {
  if (product.skus.length === 1 && !product.skus[0].spec) {
    return product.skus[0]
  }
  return null
}

/**
 * 只要用于编辑product，获得formData；将空sku保存在emptySku属性中
 * @param product
 * @returns {{images: Array, name, price: string, stock: string, sp_price: string, cateId: *, isNeedIdno: (*|boolean), initialSale: string, detail, tags: Array, skus: Array, emptySku: T}}
 */
const generateFormDataFromProduct = (product) => {
  let weight = ''
  let price = ''
  let stock = ''
  let code = ''
  let skus = []
  let tags = []
  // 有空sku时，数组里必然只一个sku, 这时候不用向数组里添加sku了
  let emptySku = getEmptySku(product)
  if (emptySku) {
    price = String(emptySku.price / 100)
    weight = String(emptySku.weight / 1000)
    stock = emptySku.stock + ''
    code = emptySku.code
  } else {
    product.skus.forEach((item) => {
      skus.push({
        id: item.id,
        spec: item.spec,
        price: String(item.price / 100),
        stock: item.stock + '',
        code: item.code,
        weight: String(item.weight / 1000),
        image: item.image
      })
    })
  }
  if (product.tags) {
    tags = product.tags
  }

  let topCateId = product.catId
  let subCateId = null
  if (product.cate && product.cate.cateId !== 0) {
    topCateId = product.cate.cateId
    subCateId = product.cate.id
  }
  let proRemark = ''
  if (product.ext) {
    proRemark = product.ext.sys_remark
  }
  return {
    images: [],
    shareImages: [],
    name: product.name,
    price: price,
    weight: weight,
    stock: stock,
    code: code,
    sp_price: String(product.ext.sp_price / 100),
    tag_price: (!product.tag_price || product.tag_price === 0) ? '' : String(product.tag_price / 100),
    topCateId: topCateId,
    subCateId: subCateId,
    isNeedIdno: product.ext.isNeedIdno,
    initialSale: product.ext.initialSale === 0 ? '' : product.ext.initialSale + '',
    detail: product.detail,
    tags: tags,
    skus: skus,
    covers: [],
    buyer: product.ext.buyer,
    sellTime: (!product.ext.sell_time || product.ext.sell_time === 0) ? null : new Date(product.ext.sell_time),
    emptySku: emptySku,
    service_name: product.ext.service_name,
    service_tag_group_id: product.ext.service_tag_group_id === 0 ? '' : String(product.ext.service_tag_group_id),
    delivery_region_id: product.ext.delivery_region_id === 0 ? '' : String(product.ext.delivery_region_id),
    discount_item: product.discount_item,
    sys_remark: proRemark,
    fid: product.fid === 0 ? '0' : String(product.fid)
  }
}

/**
 * 从fromData中获得上传的参数
 * @param formData
 * @param id
 */
const generatePostParamFromFormData = (formData, id) => {
  let imgs = []
  formData.images.forEach((item) => {
    imgs.push(item.ossUrl)
  })
  let sharesImgs = []
  formData.shareImages.forEach((item) => {
    sharesImgs.push(item.ossUrl)
  })

  let tagIds = []
  formData.tags.forEach((item) => {
    tagIds.push(item.id)
  })
  let cover = null
  if (formData.covers && formData.covers.length > 0) {
    cover = formData.covers[0].ossUrl
  }
  let cateId = formData.topCateId
  if (formData.subCateId && formData.subCateId !== '0') {
    cateId = formData.subCateId
  }
  let param = {
    name: formData.name,
    catId: cateId,
    images: imgs,
    shareImages: sharesImgs,
    cover: cover,
    detail: formData.detail,
    tag_price: parseInt(parseFloat(formData.tag_price).mul(100)),
    fid: formData.fid ? parseInt(formData.fid) : 0,
    ext: {
      sp_price: parseInt(parseFloat(formData.sp_price).mul(100)),
      initialSale: !formData.initialSale ? 0 : parseInt(formData.initialSale),
      isNeedIdno: formData.isNeedIdno,
      service_name: formData.service_name,
      service_tag_group_id: formData.service_tag_group_id ? parseInt(formData.service_tag_group_id) : 0,
      delivery_region_id: formData.delivery_region_id ? parseInt(formData.delivery_region_id) : 0,
      sell_time: formData.sellTime ? formData.sellTime.getTime() : 0,
      buyer: formData.buyer,
      sys_remark: formData.sys_remark
    },
    tags: tagIds
  }
  if (formData.weight) {
    param.weight = parseInt(parseFloat(formData.weight).mul(1000))
  }
  if (formData.price) {
    param.price = parseInt(parseFloat(formData.price).mul(100))
  }
  if (formData.stock) {
    param.stock = parseInt(formData.stock)
  }
  if (formData.code) {
    param.code = formData.code
  }
  let skus = []
  formData.skus.forEach((item) => {
    skus.push({
      id: item.id,
      spec: item.spec,
      price: parseInt(parseFloat(item.price).mul(100)),
      stock: parseInt(item.stock),
      code: item.code,
      weight: parseInt(parseFloat(item.weight).mul(1000)),
      image: item.image,
      del: !!item.del
    })
  })

  // 处理空sku, 如果没有真正的sku，则添加一个sku
  if (getRealSkuArr(skus).length === 0) {
    skus.unshift(createEmptySku(formData))
  } else {
    // 如果有原始的空sku，那么将这个sku设置为del = true， 将添加到数据顶部
    if (formData.emptySku) {
      formData.emptySku.del = true
      skus.unshift(formData.emptySku)
    }
  }

  param.skus = skus
  if (id) {
    param.id = id
  }
  return param
}

/**
 * 删除sku，如果当前的id不为0，仅是标记为Del = true；如果当前没有未删除的sku时，则将当前规格的价格赋值给formData
 * @param formData
 * @param item
 */
const delSku = (formData, item) => {
  const skuArr = formData.skus
  if (item.id) {
    Vue.set(item, 'del', true)
  } else {
    const index = skuArr.indexOf(item)
    skuArr.splice(index, 1)
  }
  if (getRealSkuArr(skuArr).length === 0) {
    formData.price = item.price
    formData.stock = item.stock
    formData.code = item.code
    formData.weight = item.weight
  }
}

/**
 * 添加一个新的sku，如果当前未删除的sku为空, 则从FromData中拷贝price,stock
 * @param fromData fromData
 * @returns 返回添加的新的sku
 */
const addSku = (fromData) => {
  const newSku = {
    id: 0,
    spec: '',
    price: '',
    stock: '',
    code: '',
    weight: '',
    image: ''
  }
  const skuArr = fromData.skus
  if (getRealSkuArr(skuArr).length === 0) {
    newSku.price = fromData.price
    newSku.stock = fromData.stock
    newSku.code = fromData.code
    newSku.weight = fromData.weight
  }
  skuArr.push(newSku)
  return newSku
}

const getAllPrice = (formData) => {
  const allPrice = []
  if (formData.skus && formData.skus.length > 0) {
    formData.skus.forEach(item => {
      try {
        if (item.price && !item.del) {
          allPrice.push(parseFloat(item.price))
        }
      } catch (err) {
      }
    })
  }
  if (allPrice.length <= 0) {
    if (formData.price) {
      try {
        allPrice.push(parseFloat(formData.price))
      } catch (err) {
      }
    }
  }
  return allPrice
}

const getProdTagName = (prod) => {
  if (prod) {
    if (prod.trash === true) {
      return '已删除'
    }
    if (prod.status !== 1) {
      return '已下架'
    }
  }
  return ''
}

export default {
  hasRealSku,
  getRealSkuArr,
  generateFormDataFromProduct,
  generatePostParamFromFormData,
  delSku,
  addSku,
  getAllPrice,
  getProdTagName
}
