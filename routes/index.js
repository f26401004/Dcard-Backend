const express = require('express')
const router = express.Router()

const test1Router = require('./test1')
const test2Router = require('./test2')
const test3Router = require('./test3')
const uploadRouter = require('./upload')
const resizedRouter = require('./resized')

router.use('/test1', test1Router)
router.use('/test2', test2Router)
router.use('/test3', test3Router)
router.use('/upload', uploadRouter)
router.use('/resized', resizedRouter)

module.exports = router