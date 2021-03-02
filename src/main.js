// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueLazyload from 'vue-lazyload'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import errorHandler from './plugins/MyErrorHandler'
import myFilter from './filter'
import eventBus from './plugins/EventBus'
import RamdaPlugin from 'src/plugins/Ramda'
import 'src/utils/numberUtil'
import App from './App'

Vue.config.productionTip = false

Vue.$store = store

let instance = axios.create({
  timeout: 60000
})
Vue.use(VueAxios, instance)
Vue.use(ElementUI)
Vue.use(VueLazyload)
Vue.use(errorHandler)
Vue.use(myFilter)
Vue.use(eventBus)
Vue.use(RamdaPlugin)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: {App},
  router,
  store
})

