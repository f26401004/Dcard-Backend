const express = require('express')
const limits = require('../../limits')
const router = express.Router()
const formidable = require('formidable')
const fs = require('fs')

router.use(limits({
  duration: 60 * 60 * 1000,
  max: 1000
}))

router.post('/', function (req, res) {
  const form = new formidable.IncomingForm()
  // config the file upload restriction
  form.encoding = 'utf-8'
  form.keepExtensions = false
  form.maxFieldsSize = 2 * 1024 * 1024
  form.maxFileSize = 200 * 1024 * 1024
  form.multiples = true
  form.parse(req, function (error, fields, files) {
    // check if any error occured
    if (error) {
      let statusCode = 500
      console.log(error.message)
      if (error.message.indexOf('maxFileSize') > 0 || error.message.indexOf('maxFieldsSize') > 0) {
        statusCode = 400
      }
      console.log(statusCode)
      res.status(statusCode).send(`Form parse error: ${error}`)
      res.end()
      return
    }
    // check images field exist
    if (!files.images) {
      res.status(500).send(`Form parse error: images field do not exist!!`)
      res.end()
      return
    }
    let extName = ''
    // record the saved image and wrong type image
    const savedImage = []
    const errorImage = []
    // if there is only single file
    if (!Array.isArray(files.images)) {
      // make the images field be an array
      files.images = [files.images]
    }
    files.images.forEach(target => {
      switch (target.type) {
        case 'image/pjpeg':
          extName = 'jpg'
          break
        case 'image/jpeg':
          extName = 'jpg'
          break
        case 'image/png':
          extName = 'png'
          break
        case 'image/x-png':
          extName = 'png'
          break
      }
      if (extName.length == 0) {
        errorImage.push(target.name)
        return
      }

      const imageName = target.name
      const newPath = `public/images/${imageName}`

      fs.renameSync(target.path, newPath)
      savedImage.push(`images/${imageName}`)
    })
    res.status(200).json({
      success: savedImage,
      failed: errorImage
    })
    res.end()
  })
})

module.exports = router