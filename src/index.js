const verbose = require('debug')('ha:index:verbose')
const info = require('debug')('ha:index:info')
const error = require('debug')('ha:index:error')

const Client = require('./client')
const config = require('./config')
const Promise = require('bluebird')
const client = new Client()
const exit = require('./exit')

Promise
  .resolve(client.run())
  .then(() => info('Client is running.',
    'Server URL:', config.serverUrl,
    'Login URL:', config.loginUrl))
  .catch(err => {
    error('Error while running client.', err)
    return exit(2)
  })

setInterval(() => verbose('memory:', process.memoryUsage()), 1000 * 60 * 5)
