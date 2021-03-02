import axios from 'axios'
import * as Constants from '../constants'
import { convertYuanToFen } from 'src/utils/moneyUtil'
import { convertKilogramToGram } from 'src/utils/freightUtil'

export const getList = () => {
  return axios.get(Constants.URL_PREFIX + `/freight`)
}
export const getItem = (id) => {
  return axios.get(Constants.URL_PREFIX + `/freight/${id}`)
}
export const create = (formData) => {
  if (formData.tp === 2) {
    let arr = []
    formData.items.forEach((i) => {
      let a = {
        id: i.id,
        province: i.province,
        first_unit: convertKilogramToGram(i.first_unit),
        first_price: convertYuanToFen(i.first_price),
        next_unit: convertKilogramToGram(i.next_unit),
        next_price: convertYuanToFen(i.next_price),
        del: i.del
      }
      arr.push(a)
    })
    Object.assign(formData.items, arr)
  } else {
    let arr = []
    formData.items.forEach((i) => {
      let a = {
        id: i.id,
        province: i.province,
        first_unit: parseInt(i.first_unit),
        first_price: convertYuanToFen(i.first_price),
        next_unit: parseInt(i.next_unit),
        next_price: convertYuanToFen(i.next_price),
        del: i.del
      }
      arr.push(a)
    })
    Object.assign(formData.items, arr)
  }
  return axios.post(Constants.URL_PREFIX + `/freight`, formData)
}
export const updateItem = (formData, id) => {
  if (formData.tp === 2) {
    let arr = []
    formData.items.forEach((i) => {
      let a = {
        id: i.id,
        province: i.province,
        first_unit: convertKilogramToGram(i.first_unit),
        first_price: convertYuanToFen(i.first_price),
        next_unit: convertKilogramToGram(i.next_unit),
        next_price: convertYuanToFen(i.next_price),
        del: i.del
      }
      arr.push(a)
    })
    Object.assign(formData.items, arr)
  } else {
    let arr = []
    formData.items.forEach((i) => {
      let a = {
        id: i.id,
        province: i.province,
        first_unit: parseInt(i.first_unit),
        first_price: convertYuanToFen(i.first_price),
        next_unit: parseInt(i.next_unit),
        next_price: convertYuanToFen(i.next_price),
        del: i.del
      }
      arr.push(a)
    })
    Object.assign(formData.items, arr)
  }
  return axios.post(Constants.URL_PREFIX + `/freight/${id}`, formData)
}
export const deleteItem = (id) => {
  return axios.delete(Constants.URL_PREFIX + `/freight/${id}`)
}

