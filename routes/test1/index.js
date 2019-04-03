const express = require('express')
const limits = require('../../limits')
const router = express.Router()

router.use(limits({
  duration: 1000,
  max: 1
}))


router.get('/', function (req, res) {
  res.status(200).send('test1 route')
})

module.exports = router