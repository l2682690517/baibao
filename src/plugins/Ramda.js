import R_ from 'src/utils/R_'

const R = require('ramda')

const plugin = {

  install (vue, options = {}) {
    vue.prototype.R = R
    vue.prototype.R_ = R_
    vue.R = R
    vue.R_ = R_
  }
}

export default plugin
export const install = plugin.install
