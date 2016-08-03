const path = require('path')
const LOG_PREFIX = `"${path.basename(__filename)}":`
const log = require('./logger')
const verbose = log.verbose.bind(log, LOG_PREFIX)
const info = log.info.bind(log, LOG_PREFIX)
const error = log.error.bind(log, LOG_PREFIX)

const config = require('./config')
const diehard = require('diehard')
const JWTGenerator = require('jwt-generator')
const jwtGenerator = new JWTGenerator(config.loginUrl, config.privateKey, true)
const PIN_DOOR_STATE = config.pins.readDoorState
const Promise = require('bluebird')
const gpio = Promise.promisifyAll(require('pi-gpio'))
const request = require('http-as-promised')
const url = require('url')

class Door {
  _sendState (state, isRetry = false) {
    const self = this

    info('sendState called.', 'isRetry:', isRetry)
    return Promise
      .try(() => isRetry ? jwtGenerator.makeNewToken('/doors', 'urn:home-automation/garage') : jwtGenerator.makeToken('/doors', 'urn:home-automation/garage'))
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
    return Promise
      .resolve(gpio.openAsync(PIN_DOOR_STATE, 'input')
        .then(() => {
          info('opened PIN_DOOR_STATE')
          diehard.register(done => {
            info('closing PIN_DOOR_STATE')
            gpio.close(PIN_DOOR_STATE, () => {
              info('closed PIN_DOOR_STATE')
              done()
            })
          })
        }))
      .then(() =>
        setInterval(() => {
          verbose('setInterval called.')
          Promise
            .resolve(gpio.readAsync(PIN_DOOR_STATE))
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
      )
  }
}

module.exports = Door
