const path = require('path')
const LOG_PREFIX = `"${path.basename(__filename)}":`
const log = require('./logger')
const error = log.error.bind(log, LOG_PREFIX)

const fs = require('fs')
const config = {production: process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase() === 'PRODUCTION'}

config.serverUrl = process.env.SERVER_URL || (config.production ? null : 'http://localhost:3003')
if (!config.serverUrl) {
  error('Server URL could not be found in the environment variable.  Please set \'SERVER_URL\'.')
  process.exit(1)
}

config.pushUrl = process.env.PUSH_URL || (config.production ? null : 'http://localhost:3005')
if (!config.pushUrl) {
  error('Push server URL could not be found in the environment variable.  Please set \'PUSH_URL\'.')
  process.exit(1)
}

config.loginUrl = process.env.LOGIN_URL || (config.production ? null : 'http://localhost:3001')
if (!config.loginUrl) {
  error('Login URL could not be found in the environment variable.  Please set \'LOGIN_URL\'.')
  process.exit(1)
}

config.pins = {
  clientUp: parseInt(process.env.PINS_CLIENT_UP || -1, 10),
  connectedToServer: parseInt(process.env.PINS_CONNECTED_TO_SERVER || -1, 10),
  openDoorSignal: parseInt(process.env.PINS_OPEN_DOOR_SIGNAL || 18, 10),
  readDoorState: parseInt(process.env.PINS_READ_DOOR_STATE || 15, 10)
}
if (config.pins.openDoorSignal < 0) {
  error('Required pin could not be found in the environment variable.  Please set \'PINS_OPEN_DOOR_SIGNAL\'.')
  process.exit(1)
}
if (config.pins.readDoorState < 0) {
  error('Required pin could not be found in the environment variable.  Please set \'PINS_READ_DOOR_STATE\'.')
  process.exit(1)
}

config.privateKey = process.env.PRIVATE_KEY || (config.production ? null : fs.readFileSync(path.join(__dirname, '../test/private_key.pem')))
if (!config.privateKey) {
  error('Private key could not be found in the environment variable.  Please set \'PRIVATE_KEY\'.')
  process.exit(1)
}

module.exports = config
