const path = require('path')
const LOG_PREFIX = `"${path.basename(__filename)}":`
const log = require('./logger')
const info = log.info.bind(log, LOG_PREFIX)
const error = log.error.bind(log, LOG_PREFIX)

const config = require('./config')
const diehard = require('diehard')
const Door = require('./door')
const LED = require('./led')
const Promise = require('bluebird')
const RemoteControl = require('./remote-control')
const SocketIO = require('./socket-io')

class Client {
  constructor () {
    this.ledClientUp = new LED('PIN_CLIENT_UP', config.pins.clientUp)
    this.ledConnectedToServer = new LED('PIN_CONNECTED_TO_SERVER', config.pins.connectedToServer)
    this.door = new Door()
    this.remoteControl = new RemoteControl(config.pins.openDoorSignal)
    this.socketIO = new SocketIO(this.ledConnectedToServer)
  }

  run () {
    const self = this
    return Promise
      .resolve(self.ledClientUp.initialize())
      .then(() => self.ledClientUp.turnOn())
      .then(() => self.ledConnectedToServer.initialize())
      .then(() => self.ledConnectedToServer.turnOff())
      .then(() => {
        info('calling socket-io')
        const options = {
          subject: '/doors',
          audience: 'urn:home-automation/garage',
          rooms: ['garage-doors'],
          events: [{
            name: 'TOGGLE_CREATED',
            callback: data => {
              info('TOGGLE_CREATED called. data:', data)
              Promise
                .resolve(self.remoteControl.changeState())
                .catch(err => {
                  error('Got an error while calling remoteControl.changeState(). Exiting process.  err:', err)
                  process.exit(2)
                })
            }
          }]
        }
        return self.socketIO.connect(options)
      })
      .then(() => self.door.monitor())
      .then(() => diehard.listen()) // diehard uses 'this' context.  That is why we have to call it this way.
  }
}

module.exports = Client
