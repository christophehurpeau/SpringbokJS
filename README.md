## Dependencies

  * **imagemagick**, **pngcrush**, and java JRE - in debian based distribution install with
  
        apt-get install imagemagick pngcrush && sudo add-apt-repository ppa:webupd8team/java && sudo apt-get update && sudo apt-get install oracle-java7-installer
  
  or
  
        sudo apt-add-repository ppa:christophe-hurpeau/springbok && sudo apt-get update && sudo apt-get install springbok-js

  * **nodejs** - in ubuntu based distribution install with

        sudo apt-add-repository ppa:chris-lea/node.js && sudo apt-get update && sudo apt-get install nodejs

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
        
