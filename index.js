const through = require('through2')
const yaml = require('js-yaml')
const refs = require('json-refs')

const PluginError = require('plugin-error')

module.exports = function (options = {}, load = null) {

  load = load || function (content, path = null) {
    return yaml.safeLoad(content, { filename: path })
  }

  options = Object.assign({
    filter: ['remote', 'relative'],
    loaderOptions: {
      processContent: (result, callback) => callback(null, load(result.text, result.path))
    }
  }, options)

  refs.clearCache()

  return through.obj(function (file, encoding, callback) {
    if (file.isBuffer()) {
      const opts = Object.assign({}, options)
      opts.relativeBase = opts.relativeBase || file.dirname
      opts.location = opts.location || file.path

      Promise.resolve(file.contents.toString())
        .then(content => load(content, file.path))
        .then(json => refs.resolveRefs(json, opts))
        .then(result => {
          file.contents = Buffer.from(JSON.stringify(result.resolved))
          file.extname = '.json'
          callback(null, file)
        }, error => {
          callback(pluginError(error), file)
        })
    } else if (file.isStream()) {
      callback(pluginError('Streaming not supported'), file)
    } else {
      callback(null, file)
    }
  })
  
}

function pluginError (message) {
  return new PluginError('gulp-refs', message)
}
