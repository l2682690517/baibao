const R = require('ramda')

/**
 * 接收一个函数和两个对象，遍历第一个对象的key, 优化进行函数处理，如果没有处理，判断第二个对象有key，则拷贝互第一个对象
 *
 * @func
 * @memberOf R_
 * @category Object
 * @param {Function} fn 要调用的函数，接收三个参数: `key`, `l`, `r`.
 * @param {Object} l 源对象
 * @param {Object} r 要对其附值的对象
 * @return {Object} 已附值的对象
 */
const updateWithObjCustom = R.curry((fn, l, r) => {
  let copyObj = {...l}
  R.forEachObjIndexed((value, key, obj) => {
    if (fn) {
      if (!fn(key, copyObj, r)) {
        if (r.hasOwnProperty(key) && R.not(R.isEmpty(R.prop(key)(r)))) {
          copyObj[key] = R.prop(key)(r)
        }
      }
    } else {
      if (r.hasOwnProperty(key) && R.not(R.isEmpty(R.prop(key)(r)))) {
        copyObj[key] = R.prop(key)(r)
      }
    }
  })(l)
  return copyObj
})

/**
 * 接收两个对象，遍历第一个对象的key, 如果第二个对象有key，则拷贝互第一个对象
 *
 * @func
 * @memberOf R_
 * @category Object
 * @param {Object} l 源对象
 * @param {Object} r 要对其附值的对象
 * @return {Object} 已附值的对象
 */
const updateWithObj = R.curry((l, r) => {
  return updateWithObjCustom(null, l, r)
})

/**
 * 接收两个参数，第一参数，表示转换数字失败时返回的数字，第二个参数表示要转换的数字
 *
 * @func
 * @memberOf R_
 * @category Object
 * @param {int} defaultVal 表示转换数字失败时返回的数字
 * @param {int} val 表示要转换的数字
 * @return {int} 转换的结果
 */
const parseInteger = R.curry((defaultVal, val) => {
  if (R.isNil(val)) {
    return defaultVal
  }
  const reg = /^\s*-?\d+$\s*/
  if (reg.test(val)) {
    return parseInt(val)
  } else {
    return defaultVal
  }
})

/**
 * 接收两个参数，第一参数，表示转换时间失败时返回的数字，第二个参数表示要转换的时间字符串
 *
 * @func
 * @memberOf R_
 * @category Object
 * @param {int} defaultVal 表示转换数字失败时返回的时间tick
 * @param {int} val 表示要转换的时间字符串
 * @return {int} 转换的结果
 */
const parseDateTick = R.curry((defaultVal, val) => {
  const date = new Date(val)
  if (!date) {
    return 0
  }
  return date.getTime()
})

const R_ = {
  updateWithObjCustom,
  updateWithObj,
  parseInteger,
  parseDateTick
}

export default R_
