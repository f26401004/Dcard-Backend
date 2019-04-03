const express = require('express')
const app = express()
const routes = require('./routes')

app.use(routes)

const port = process.env.PORT || 3000
app.listen(port, function () {
  console.log('Server now is listening on port 3000')
})
