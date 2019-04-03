const express = require('express')
const limits = require('../../limits')
const router = express.Router()

router.use(limits({
  duration: 60 * 1000,
  max: 1000
}))

router.get('/', function (req, res) {
  res.status(200).send('test2 route')
})

module.exports = router