const BAD_DISCOUNT_RATE_MSG = '请输入0.1~10之间的数字'
const BAD_DISCOUNT_PRICE_MSG = '请输入大于0的数字'
const BAD_DISCOUNT_RANGE_PRICE_MSG = '折后价格错误'
const BAD_DISABLE_DISCOUNT_RANGE_PRICE_MSG = '需要设置折扣'

/**
 * 获得商品的最小价格和最大价格
 * @param product 商品
 * @returns {*} 1个价格 = [price], 2个价格 = [minPrice, maxPrice]
 */
const getPriceInterval = (product) => {
  const allPrice = []
  product.skus.forEach((item) => {
    allPrice.push(item.price)
  })
  if (allPrice.length === 0) {
    return []
  }
  const max = Math.max.apply(null, allPrice)
  const min = Math.min.apply(null, allPrice)
  if (max === min) {
    return [max]
  } else {
    return [min, max]
  }
}

/**
 * 返回原价格输出，以元为单位
 * @param product 商品
 * @returns {String} 价格范围，以元为单位
 */
const getOriginPriceForOutput = (product) => {
  const prices = getPriceInterval(product)
  if (prices.length === 0) {
    return ''
  }
  if (prices.length === 1) {
    return String(prices[0] / 100)
  }
  return `${String(prices[0] / 100)}~${String(prices[1] / 100)}`
}

/**
 * 通过折扣获得价格, 舍掉分以下的价格
 * @param price 以分为单位
 * @param discount 值为0.01~0.99的两位小数
 * @returns {number} 返回的价格以分为单位
 */
const forPriceByDiscount = (price, discount) => {
  return parseInt(price * discount)
}

/**
 * 通过目标价格获得折扣
 * @param price 以分为单位
 * @param targetPrice 以分为单位
 * @returns {float} 返回2位小数, 值为0.01到0.99
 */
const forDiscountByPrice = (price, targetPrice) => {
  return (targetPrice * 1.0 / price).toFixed(2)
}

/**
 * 通过目标价格获得折扣
 * @param price 以分为单位
 * @param targetPrice 以分为单位
 * @returns {float} 返回2位小数, 值为0.1到0.9
 */
const forOutputDiscountByPrice = (price, targetPrice) => {
  return (targetPrice * 1.0 / price * 10).toFixed(1)
}

/**
 * 获得商品折扣后的价格输出
 * @param product 商品
 * @param discount 折扣，取值0.01到0.99
 * @returns {String} 返回折扣后的价格，以元为单位
 */
const getPriceForOutputByDiscount = (product, discount) => {
  const prices = getPriceInterval(product)
  if (prices.length === 0) {
    return ''
  }
  if (prices.length === 1) {
    return String(forPriceByDiscount(prices[0], discount) / 100)
  }
  return `${String(forPriceByDiscount(prices[0], discount) / 100)}~${String(forPriceByDiscount(prices[1], discount) / 100)}`
}

/**
 * 获得商品的折扣输出
 * @param product 商品
 * @param targetPrice 目标价格，以分为单位
 * @returns {String} 返回折扣范围，取值0.01到0.09的两位小数
 */
const getDiscountForOutputByPrice = (product, targetPrice) => {
  const prices = getPriceInterval(product)
  if (prices.length === 0) {
    return ''
  }
  if (prices.length === 1) {
    return String(forOutputDiscountByPrice(prices[0], targetPrice))
  }
  return`${forOutputDiscountByPrice(prices[0], targetPrice)}~${forOutputDiscountByPrice(prices[1], targetPrice)}`
}

/**
 * 验证输入的折扣
 * @param val 折扣，需要0.1~10才能验证通过
 * @returns {string} 返回未验证原因，空字符串表示通过
 */
const validateInputDiscountRate = (val) => {
  let errMsg = ''
  let fVal = 0.0
  if (!val) {
    errMsg = BAD_DISCOUNT_RATE_MSG
  } else {
    // let reg = /^0\.[1-9]$/
    let reg = /^(1)?[0-9](\.[0-9])?$/
    if (reg.test(val)) {
      fVal = parseFloat(val)
      if (fVal < 0.1 || fVal > 10) {
        errMsg = BAD_DISCOUNT_RATE_MSG
      }
    } else {
      errMsg = BAD_DISCOUNT_RATE_MSG
    }
  }
  return errMsg
}

/**
 * 验证输入的折扣后的目标价格
 * @param product 可为null
 * @param val 折扣后的目标价格
 * @returns {string} 返回未验证原因，空字符串表示通过
 */
const validateInputDiscountPrice = (product, val) => {
  let errMsg = ''
  let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  if (reg.test(val)) {
    const fVal = parseFloat(val)
    if (fVal <= 0) {
      errMsg = BAD_DISCOUNT_PRICE_MSG
    } else {
      if (product) {
        const priceInterval = getPriceInterval(product)
        if (priceInterval.length < 1) {
          errMsg = BAD_DISCOUNT_PRICE_MSG
        } else {
          const minOriginPrice = priceInterval[0]
          if (fVal.mul(100) > minOriginPrice) {
            errMsg = '不能高于原价'
          }
        }
      }
    }
  } else {
    errMsg = BAD_DISCOUNT_PRICE_MSG
  }
  return errMsg
}
/**
 * 验证区间价格是否正确
 * @param product not null
 * @param disRate 折扣
 * @param val 折扣后的目标价格
 * @returns {string} 返回未验证原因，空字符串表示通过
 */
const validateInputDiscountRangePrice = (product, disRate, val) => {
  val = val || ''
  if (val.split('~').length !== 2) {
    return BAD_DISABLE_DISCOUNT_RANGE_PRICE_MSG
  }
  let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  const priceInterval = getPriceInterval(product)
  if (priceInterval.length !== 2) {
    return BAD_DISCOUNT_RANGE_PRICE_MSG
  }

  let disprices = val.split('~')

  for (var dp of disprices) {
    if (!reg.test(dp)) {
      return BAD_DISCOUNT_RANGE_PRICE_MSG
    }
  }
  let p = getPriceForOutputByDiscount(product, disRate * 0.1)
  if (p !== val) {
    return BAD_DISCOUNT_RANGE_PRICE_MSG
  }
  return ''
}
/**
 *  是否区间价格
 * @param product not null
 * @returns {string} 返回未验证原因，空字符串表示通过
 */
const isInputDiscountRangePrice = (product) => {
  return getPriceInterval(product).length === 2
}

export default {
  forPriceByDiscount,
  forDiscountByPrice,
  getOriginPriceForOutput,
  getPriceForOutputByDiscount,
  getDiscountForOutputByPrice,
  validateInputDiscountRate,
  validateInputDiscountPrice,
  validateInputDiscountRangePrice,
  isInputDiscountRangePrice
}
