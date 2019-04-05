const express = require('express')
const app = express()
const routes = require('./routes')
const path = require('path')
const bodyParser = require('body-parser')

app.use(routes)
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))

const port = process.env.PORT || 3000
app.listen(port, function () {
  console.log('Server now is listening on port 3000')
})
