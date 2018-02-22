const { config } = require('./package.json')

const express = require('express')
const path = require('path')

const PORT = process.env.PORT || config['default-port']

express()
  .use(express.static(path.join(__dirname, config.path.output)))
  .listen(PORT, () => console.log(`⚽️  Listening on ${ PORT }`))
