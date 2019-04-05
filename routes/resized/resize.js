const path = require('path')
const sharp = require('sharp')
const fs = require('fs')

module.exports = function (filepath, format, width, height) {
  const readStream = fs.createReadStream(filepath)
  let transform = sharp()

  if (format) {
    transform = transform.toFormat(format)
  }

  if (width || height) {
    transform = transform.resize(width, height, {
      fit: 'contain',
      background: {r: 255, g: 255, b: 255}
    })
  }

  return readStream.pipe(transform)
}