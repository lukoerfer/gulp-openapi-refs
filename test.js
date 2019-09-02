const { describe, it } = require('mocha')
const File = require('vinyl')
const Readable = require('stream').Readable

describe('gulp-openapi-refs', function () {

  describe('in buffer mode', function() {
    it('should resolve references', function(done) {
      
      var file = new File({
        contents: Buffer.from('')
      })

      done(new Error('Test implementation missing'))
    })
  })

  describe('in streaming mode', function () {
    it('should fail', function (done) {

      var file = new File({
        contents: Readable.from(['test', 'test'])
      })

      done(new Error('Test implementation missing'))
    })
  })

})
