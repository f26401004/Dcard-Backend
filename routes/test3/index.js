const express = require('express')
const limits = require('../../limits')
const router = express.Router()

router.use(limits({
  duration: 60 * 60 * 1000,
  max: 1000
}))

router.get('/', function (req, res) {
  res.status(200).send('test3 route')
})

module.exports = router