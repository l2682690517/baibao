import {DISCOUNT_STATUS} from '../constants/discount'

export default (value) => {
  let status = DISCOUNT_STATUS.find((status) => { return status.value === value })
  return status.label
}
