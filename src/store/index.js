import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import category from './modules/category'
import tag from './modules/tag'
import servicetag from './modules/servicetag'
import servicetaggroup from './modules/servicetaggroup'
import custompage from './modules/custompage'
import createLogger from 'vuex/dist/logger'
import * as config from '../config'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    category,
    tag,
    servicetag,
    servicetaggroup,
    custompage
  },
  strict: config.isDebug,
  plugins: config.isDebug ? [createLogger()] : []
})
