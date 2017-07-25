# Home Automation - Garage Door Raspberry Pi Client
This repository contains the raspberry-pi client for the garage door.
  
[![JavaScript Style Guide][standard-image]][standard-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![DevDependencies][dependencies-dev-image]][dependencies-dev-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

I suggest you first [read][overview-url] about the different components of the home automation application.
This will help you understand better the general architecture and different functions of the system.

## Hardware
* [Raspberry Pi B+ Ultimate Starter](http://www.amazon.com/gp/product/B00LAAZKXQ)
* [Relay connector](http://www.ebay.com/itm/141410025816)
* [Male to Female wire jumper](http://www.ebay.com/itm/171303931847)
* [Magnetic contact switch (door sensor)](https://www.adafruit.com/products/375)

## Installation Instructions
Click [here][client-installation-instruction-url] and follow the installation instructions for the raspberry-pi clients.

## Environment variables (configuration)
__LOGIN\_URL__ (required): url to the [authentication][auth-url] server. Example: `login.herokuapp.com`  
__PINS\_CLIENT\_UP__ (optional): GPIO pin (output) that sets to high when client process is running. Default: none.  
__PINS\_CONNECTED\_TO\_SERVER__ (optional): GPIO pin (output) that sets to high when client is connected to server. Default: none.  
__PINS\_OPEN\_DOOR\_SIGNAL__ (required): GPIO pin (output) that sets to high when opening/closing the door. Default: `18`  
__PINS\_READ\_DOOR\_STATE__ (required): Description: GPIO pin (input) that reads door state (open/close). Default: `15`  
__PRIVATE\_KEY__ (required): Generated private key.  Public key should be shared with the [authentication][auth-url] server. See [here][private-public-keys-url].  
__SERVER\_URL__ (required): url to the [garage door][garage-url] server. Example: `garage.herokuapp.com`

![Circuit Diagram](/circuit.jpg?raw=true)

### License
[AGPL-3.0](https://spdx.org/licenses/AGPL-3.0.html)

### Author
[Oron Nadiv](https://github.com/OronNadiv) ([oron@nadiv.us](mailto:oron@nadiv.us))

[dependencies-image]: https://david-dm.org/OronNadiv/garage-door-raspberry-client/status.svg
[dependencies-url]: https://david-dm.org/OronNadiv/garage-door-raspberry-client
[dependencies-dev-image]: https://david-dm.org/OronNadiv/garage-door-raspberry-client/dev-status.svg
[dependencies-dev-url]: https://david-dm.org/OronNadiv/garage-door-raspberry-client?type=dev
[travis-image]: http://img.shields.io/travis/OronNadiv/garage-door-raspberry-client.svg?style=flat-square
[travis-url]: https://travis-ci.org/OronNadiv/garage-door-raspberry-client
[coveralls-image]: http://img.shields.io/coveralls/OronNadiv/garage-door-raspberry-client.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/OronNadiv/garage-door-raspberry-client
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com

[overview-url]: https://oronnadiv.github.io/home-automation
[client-installation-instruction-url]: https://oronnadiv.github.io/home-automation/#installation-instructions-for-the-raspberry-pi-clients
[server-installation-instruction-url]: https://oronnadiv.github.io/home-automation/#installation-instructions-for-the-server-micro-services
[private-public-keys-url]: https://oronnadiv.github.io/home-automation/#generating-private-and-public-keys

[alarm-url]: https://github.com/OronNadiv/alarm-system-api
[auth-url]: https://github.com/OronNadiv/authentication-api
[camera-url]: https://github.com/OronNadiv/camera-api
[garage-url]: https://github.com/OronNadiv/garage-door-api
[notifications-url]: https://github.com/OronNadiv/notifications-api
[push-url]: https://github.com/OronNadiv/push-api
[storage-url]: https://github.com/OronNadiv/storage-api
[ui-url]: https://github.com/OronNadiv/home-automation-ui
