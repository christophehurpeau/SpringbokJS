## Dependencies

  * **imagemagick** - in debian based distribution install with
  
        apt-get install imagemagick

## Installation

        sudo npm install -g springbokjs uglify-js

## Clone repository

        git clone https://github.com/christophehurpeau/SpringbokJS.git springbokjs
        cd springbokjs
        git submodule init && git submodule update

## Launch Todo Webapp

        cd springbokjs
        sh ./watch.sh
        
Then, in an other terminal :

        cd samples/todowebapp
        make
