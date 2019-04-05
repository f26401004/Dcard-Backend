const express = require('express')
const limits = require('../../limits')
const router = express.Router()
const resize = require('./resize')
const path = require('path')

router.use(limits({
  duration: 60 * 60 * 1000,
  max: 1000
}))

router.get('/', function (req, res) {
  const filename = req.query.filename || ''
  const width = req.query.width ? parseInt(req.query.width) : 0
  const height = req.query.height ? parseInt(req.query.height) : 0
  const format = req.query.type
  if (!filename) {
    res.status(400).send('filename can not be empty!!')
    return
  }
  if (width < 1 || height < 1) {
    res.status(400).send('size error!!')
    return
  }

  const imagePath = path.join(__dirname, `../../public/images/${req.query.filename}`)
  resize(imagePath, format, width, height).pipe(res)
})

module.exports = router