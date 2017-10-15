const info = require('debug')('ha:client:info')
const error = require('debug')('ha:client:error')

const config = require('./config')
const diehard = require('diehard')
const Door = require('./door')
const LED = require('raspberry-pi-led')
const Promise = require('bluebird')
const RemoteControl = require('./remote-control')
const pubnubConnect = require('./pubnub')

class Client {
  constructor () {
    this.ledClientUp = new LED('PIN_CLIENT_UP', config.pins.clientUp)
    this.ledConnectedToServer = new LED('PIN_CONNECTED_TO_SERVER', config.pins.connectedToServer)
    this.door = new Door()
    this.remoteControl = new RemoteControl(config.pins.openDoorSignal)
  }

  run () {
    const self = this
    return Promise
      .resolve(self.ledClientUp.initialize())
      .then(() => self.ledClientUp.turnOn())
      .then(() => self.ledConnectedToServer.initialize())
      .then(() => self.ledConnectedToServer.turnOff())
      .then(() => {
        info('calling pubnub')
        const events = [{
          system: 'GARAGE',
          type: 'TOGGLE_CREATED',
          callback: payload => {
            info('TOGGLE_CREATED called. payload:', payload)
            Promise
              .resolve(self.remoteControl.changeState())
              .catch(err => {
                error('Got an error while calling remoteControl.changeState(). Exiting process.  err:', err)
                process.exit(2)
              })
          }
        }]
        return pubnubConnect(
          self.ledConnectedToServer,
          events,
          {
            subject: '/doors',
            audience: 'urn:home-automation/garage'
          }
        )
      })
      .then(() => self.door.monitor())
      .then(() => diehard.listen()) // diehard uses 'this' context.  That is why we have to call it this way.
  }
}

module.exports = Client
