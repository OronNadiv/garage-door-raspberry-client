const verbose = require('debug')('ha:door:verbose')
const info = require('debug')('ha:door:info')
const error = require('debug')('ha:door:error')

const config = require('./config')
const diehard = require('diehard')
const PIN_DOOR_STATE = config.pins.readDoorState
const Promise = require('bluebird')
const gpio = require('rpi-gpio')
const gpiop = gpio.promise
const request = require('http-as-promised')
const url = require('url')
const JWTGenerator = require('jwt-generator')
const jwtGenerator = new JWTGenerator({
  loginUrl: config.loginUrl,
  privateKey: config.privateKey,
  useRetry: true
})

let intervalHandler

class Door {
  _sendState (state, isRetry = false) {
    const self = this

    info('sendState called.', 'isRetry:', isRetry)
    return Promise
      .try(() => {
        return isRetry
          ? jwtGenerator.makeNewToken({subject: '/doors', audience: 'urn:home-automation/garage'})
          : jwtGenerator.makeToken({subject: '/doors', audience: 'urn:home-automation/garage'})
      })
      .then(token => {
        info('token generated.  token:', !!token)
        return request({
          uri: url.resolve(config.serverUrl, 'states'),
          method: 'POST',
          auth: {
            bearer: token
          },
          form: {is_open: state === 1}
        })
      })
      .then(() => {
        info('Server state update complete successfully.')
        self.lastState = state
      })
      .catch(err => {
        error('Error while updating state. err:', err)
        return Promise
          .delay(1000)
          .then(() => self._sendState(state, true))
      })
      .finally(() => {
        self.isUpdatingServer = false
      })
  }

  monitor () {
    info('monitor called.')
    const self = this
    return gpiop
      .setup(PIN_DOOR_STATE, gpio.DIR_IN)
      .then(() => {
        info('opened PIN_DOOR_STATE')
        diehard.register(done => {
          if (intervalHandler) {
            clearInterval(intervalHandler)
            intervalHandler = null
          }
          info('closing PIN_DOOR_STATE')
          gpiop
            .destroy(PIN_DOOR_STATE)
            .then(() => {
              info('closed PIN_DOOR_STATE')
              done()
            })
        })
      })
      .then(() => {
        intervalHandler = setInterval(() => {
          verbose('setInterval called.')
          gpiop
            .read(PIN_DOOR_STATE)
            .then(state => {
              verbose('read state:', state)
              if (self.lastState === state || self.isUpdatingServer) {
                verbose('state has not changed.  Returning.',
                  'lastState:', self.lastState,
                  'state:', state,
                  'isUpdatingServer:', self.isUpdatingServer)
                return
              }
              self.isUpdatingServer = true
              info('Door state changed.',
                'State: ', state ? 'Open' : 'Close')

              return self._sendState(state)
            })
            .catch(err => error('#7', err))
        }, 1000)
      })
  }
}

module.exports = Door
