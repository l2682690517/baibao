import DateUtil from '../utils/dateUtil'

export const date = value => {
  return value ? DateUtil.dateFormat(value, 'YYYY-MM-DD') : ''
}

export const datetime = value => {
  return value ? DateUtil.dateFormat(value, 'YYYY-MM-DD HH:mm:ss') : ''
}
