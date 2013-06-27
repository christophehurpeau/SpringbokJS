## Dependencies

  * **imagemagick** - in debian based distribution install with
  
        apt-get install imagemagick

## Clone repository

        git clone https://github.com/christophehurpeau/SpringbokJS.git springbokjs
        cd springbokjs
        git submodule init && git submodule update

## Launch Todo Webapp

        cd springbokjs
        make
        
Then, in an other terminal :

        cd samples/todowebapp
        make
