var fs = require('fs')
var ejs = require('ejs')

function VersionPlugin (options) {
  var self = this
  var defaultOptions = {
    outputFile: './config/version.js',
    template: './plugin/version.ejs',
    packageFile: '../package.json'
  }
  self.options = defaultOptions
  self.options['package'] = require(defaultOptions.packageFile)
}

VersionPlugin.prototype.apply = function (compiler) {
  var self = this
  self.options.currentTime = new Date()
  fs.readFile(self.options.template, {encoding: 'utf8'}, function (error, content) {
    if (error) {
      console.log('error', error)
    }
    self.writeFile(content)
  })
}

VersionPlugin.prototype.writeFile = function (templateContent) {
  var self = this
  var fileContent = ejs.render(templateContent, self.options)
  fs.writeFile(self.options.outputFile, fileContent, {flag: 'w'})
}

module.exports = VersionPlugin
