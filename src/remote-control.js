const info = require('debug')('ha:remote-control:info')

const diehard = require('diehard')
const Promise = require('bluebird')
const gpio = Promise.promisifyAll(require('pi-gpio'))

class RemoteControl {
  constructor (pin) {
    this.pin = pin
  }

  _initialize () {
    const self = this

    return gpio.openAsync(self.pin, 'output')
      .then(() => {
        info('opened PIN_OPEN_DOOR_SIGNAL')
        diehard.register(done => {
          info('closing PIN_OPEN_DOOR_SIGNAL')
          gpio.close(self.pin, () => {
            info('closed PIN_OPEN_DOOR_SIGNAL')
            done()
          })
        })
      })
  }

  _pushButton () {
    const self = this

    if (!self.isDoorSignalGPIOSetOutput) {
      info('Opening PIN_OPEN_DOOR_SIGNAL.')
      self.isDoorSignalGPIOSetOutput = true
      return self._initialize()
    } else {
      info('Pin is already open.  Setting to low (active).')
      return gpio.writeAsync(self.pin, 0)
    }
  }

  _releaseButton () {
    return this.pin < 0
      ? Promise.resolve()
      : gpio.writeAsync(this.pin, 1)
  }

  changeState () {
    info('Activating garage remote.')
    const self = this

    return Promise
      .resolve(self._pushButton())
      .delay(1000) // one second
      .then(() => {
        info('Deactivating garage remote.  Setting pin to high (inactive).')
        return self._releaseButton()
      })
  }
}

module.exports = RemoteControl
