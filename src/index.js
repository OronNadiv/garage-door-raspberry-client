const path = require('path')
const LOG_PREFIX = `"${path.basename(__filename)}":`
const log = require('./logger')
const verbose = log.verbose.bind(log, LOG_PREFIX)
const info = log.info.bind(log, LOG_PREFIX)
const error = log.error.bind(log, LOG_PREFIX)

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
