import axios from 'axios'
import * as Constants from '../constants'

const getHome = () => {
  return axios.get(`${Constants.URL_PREFIX}/home`)
}

export default {
  getHome
}
