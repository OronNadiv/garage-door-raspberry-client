const info = require('debug')('ha:client:info')
const error = require('debug')('ha:client:error')

const config = require('./config')
const diehard = require('diehard')
const Door = require('./door')
const LED = require('raspberry-pi-led')
const Promise = require('bluebird')
const RemoteControl = require('./remote-control')
const pubnubConnect = require('./pubnub')
const exit = require('./exit')

class Client {
  constructor () {
    this.ledClientUp = config.pins.clientUp < 0
      ? null
      : new LED({name: 'PIN_CLIENT_UP', pin: config.pins.clientUp})
    this.ledConnectedToServer = config.pins.connectedToServer < 0
      ? null
      : new LED({name: 'PIN_CONNECTED_TO_SERVER', pin: config.pins.connectedToServer})
    this.door = new Door()
    this.remoteControl = new RemoteControl(config.pins.openDoorSignal)
  }

  run () {
    const self = this
    return Promise
      .try(() => self.ledClientUp && self.ledClientUp.initialize())
      .then(() => self.ledClientUp && self.ledClientUp.turnOn())
      .then(() => self.ledConnectedToServer && self.ledConnectedToServer.initialize())
      .then(() => self.ledConnectedToServer && self.ledConnectedToServer.turnOff())
      .then(() => {
        const events = [{
          system: 'GARAGE',
          type: 'TOGGLE_CREATED',
          callback: payload => {
            info('TOGGLE_CREATED called. payload:', payload)
            Promise
              .resolve(self.remoteControl.changeState())
              .catch(err => {
                error('Got an error while calling remoteControl.changeState().', 'err:', err)
                return exit(3)
              })
          }
        }]

        info('calling pubnub')
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
