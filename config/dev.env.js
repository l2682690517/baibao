var merge = require('webpack-merge')
var betaEnv = require('./beta.env')

module.exports = merge(betaEnv, {
  NODE_ENV: '"development"',
  RELEASE_ENV:  '"DEV"'
})
