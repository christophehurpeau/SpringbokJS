var io = require('socket.io').listen(Config.websocketPort || 3300/*#if PROD*/, { key:App.ssl.key, cert:App.ssl.cert/*, ca:App.ssl.intermediate*/ }/*#/if*/);
var CSecureRest = require('./components/CSecureRest');
var authorization = CSecureRest.checkAuth;

io.configure(function(){
	/* #if PROD */
	io.enable('browser client minification');  // send minified client
	io.enable('browser client etag');          // apply etag caching logic based on version number
	io.enable('browser client gzip');          // gzip the file
	io.set('log level', 1);                    // reduce logging
	io.set('transports', [
	    'websocket'
	//  , 'flashsocket'
	  , 'htmlfile'
	  , 'xhr-polling'
	  , 'jsonp-polling'
	]);
	/* #/if */
	
	io.set('close timeout',120);
	io.set('heartbeat timeout',120);
	io.set('heartbeat interval',300);
	
	io.set('authorization',function(handshakeData, callback){
		callback(null,true);
		/*
		authorization(handshakeData.headers,function(err,connected){
			if(err) return callback(err);
			if(connected) handshakeData._s_connected = connected;
			callback(null, !!connected);
		});*/
	});
});

var onConnection;

//http://www.joezimjs.com/javascript/plugging-into-socket-io-advanced/
io.sockets.on('connection', function(socket){
	var connected = false;//socket.handshake._s_connected;
	
	socket.on('auth',function(authToken){
		console.log('IO.socket ','auth',authToken);
		if(!authToken){
			connected = false;
			return;
		}
		var headers = UObj.clone(socket.handshake.headers);
		headers['x-sauth'] = authToken;
		authorization(headers,function(err,_connected){
			connected = _connected;
			!connected && socket.emit('authfailed');
		});
	});
	
	var nextIdCursor = 1;
	socket.on('db cursor',function(dbName,modelName,range,direction,response){
		App.debug('IO.socket db cursor '+dbName+' '+modelName+' '+range+' '+direction+' ; connected='+connected);
		var idCursor = nextIdCursor++, cursor = M[modelName].restCursor(connected,function(cursor){
			if(!cursor) return response();
			App.debug(cursor);
			// TODO in db because can depends on implementations !! cursor.isEmpty(function(){ })
			cursor.limit(1,function(err){
				var count = cursor.count(true,function(err,count){
					if(err || !count) return response();
					cursor.limit(0,function(){
						socket.on('db cursor '+idCursor,function(instruction,response){
							App.debug('db cursor '+idCursor+' '+instruction);
							if(instruction==='next') cursor.next(function(key){ !key ? response() : cursor.result(function(object){ response(object); }); });
							else if(instruction==='close'){ App.debug('IO.socket db cursor '+idCursor+' closed'); cursor.close(); response(); }
						});
						socket.on('db cursor '+idCursor+' advance',function(count){
							cursor.advance(count);
						});
						
						response(idCursor);
					});
				});
			});
		});
	});
	
	socket.on('db insert',function(dbName,modelName,data,response){
		App.debug('IO.socket db cursor '+dbName+' ',modelName+' '+data);
		var model = new M[modelName](data);
		model.restInsert(connected).success(function(){
			response(this.model.data);
		});
	});
	
	socket.on('ping',function(){
		App.debug('IO.socket ping');
	});
	
	onConnection && onConnection(socket, function(){ return connected; });
	socket.emit('connect');
});

module.exports = function(_onConnection){
	onConnection = _onConnection;
};
