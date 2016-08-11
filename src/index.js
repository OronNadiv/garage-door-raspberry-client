const verbose = require('debug')('ha:index:verbose')
const info = require('debug')('ha:index:info')
const error = require('debug')('ha:index:error')

const Client = require('./client')
const config = require('./config')

const client = new Client()

Promise
  .resolve(client.run())
  .then(() => info('Client is running.',
    'Server URL:', config.serverUrl,
    'Login URL:', config.loginUrl))
  .catch(err => {
    error('Error while running client.', err)
    process.exit(3)
  })

setInterval(() => verbose('memory:', process.memoryUsage()), 1000 * 60 * 5)
