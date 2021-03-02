import * as types from '../store/types'

const COMMON_ERROR_MSG = '请求失败'
const NET_CODE_401_ERROR_MSG = '没有权限, 请重新登录'

let showErrorMessage = (component, msg) => {
  component.$message({
    showClose: true,
    message: msg,
    type: 'error'
  })
}

let commonErrorHandler = (component, err, defaultMsg) => {
  if (defaultMsg) {
    showErrorMessage(component, defaultMsg)
  } else {
    showErrorMessage(component, COMMON_ERROR_MSG)
  }
  return true
}

let useAxiosResponseErrorHandler = (component, err) => {
  if (err.response && err.response.data) {
    showErrorMessage(component, err.response.data)
    return true
  } else {
    return false
  }
}

let netCodeErrorHandler = (component, err) => {
  if (err.response && err.response.status) {
    if (err.response.status === 401) {
      showErrorMessage(component, NET_CODE_401_ERROR_MSG)
      component.$store.commit(types.LOGOUT)
      component.$router.replace({name: 'login'})
      return true
    }
  }
  return false
}

const errorHandlers = [
  netCodeErrorHandler,
  useAxiosResponseErrorHandler,
  commonErrorHandler
]

const ignoreNetCodeErrorHandlers = [
  useAxiosResponseErrorHandler,
  commonErrorHandler
]

let myErrorHandler = {
  handle(component, err, defaultMsg = COMMON_ERROR_MSG, ignoreNetCodeHandler = false) {
    let handlers = errorHandlers
    if (ignoreNetCodeHandler) {
      handlers = ignoreNetCodeErrorHandlers
    }
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i](component, err, defaultMsg)) {
        return
      }
    }
  }
}

let install = (Vue, options) => {
  Vue.prototype.$myErrorHandler = myErrorHandler
}

export default {
  install
}
