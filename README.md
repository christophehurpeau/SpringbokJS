## Dependencies

  * **imagemagick** - in debian based distribution install with
  
        apt-get install imagemagick

## Installation

        sudo npm install -g springbokjs uglify-js

## Clone repository

        git clone https://github.com/christophehurpeau/SpringbokJS.git springbokjs
        cd springbokjs
        git submodule init && git submodule update

## Test SpringbokJS

### Compile core

        cd springbokjs
        make
        # first time only : npm link

### Launch Todo Webapp

        cd samples/todowebapp
        # first time only : npm link springbokjs
        make
        node start.js
        
