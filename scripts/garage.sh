#!/usr/bin/env bash

# This file starts the raspberry pi client.
# Follow installation instructions in the README.md file.
# Then place this file in the user's root directory.

cd ~/garage-door-raspberry-client
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
nvm use
export PRIVATE_KEY= # PASTE GENERATED PRIVATE KEY
export NODE_ENV=production
export LOGIN_URL= # https://<LOGIN_SERVER_URL>
export PINS_OPEN_DOOR_SIGNAL= # <GPIO PIN FOR DOOR REMOTE>
export PINS_READ_DOOR_STATE= # <GPIO PIN FOR DOOR STATE (OPEN/CLOSE)>
export SERVER_URL= # https://<GARAGE_SERVER_URL>
npm start
