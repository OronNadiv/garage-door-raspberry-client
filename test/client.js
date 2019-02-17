const config = require('../src/config')
const mockery = require('mockery')
const nock = require('nock')

describe('client', () => {
  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    })

    const gpioMock = {
      promise: {
        write: (pin, value, cb) => {
          cb()
        },
        read: (pin, cb) => {
          cb()
        },
        open: (pin, direction, cb) => {
          cb()
        },
        close: (pin, cb) => {
          cb()
        }
      }
    }
    mockery.registerMock('rpi-gpio', gpioMock)

    const jsonwebtoken = {
      decode: () => {
        return {group_id: 1}
      },
      sign: () => {
        return 'asd'
      }
    }
    mockery.registerMock('jsonwebtoken', jsonwebtoken)

    nock(config.loginUrl, {'encodedQueryParams': true})
      .post('/tokens')
      .reply(200, {token: 'abcd'})
  })

  it('tests start', () => {
    const Client = require('../src/client')
    const client = new Client()
    return client.run()
  })
})
