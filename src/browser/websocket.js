S.WebSocket = (function(){
	return {
		start: function(callback){
			console.log('S.WebSocket start');
			S.loadScript('http/*#if PROD*/s/*#/if*/://' + window.location.hostname + ':/*#if app.websocketPort*//*#val app.websocketPort*//*#else*/3300/*#/if*//socket.io/socket.io.js',function(){
				var socket = io.connect('http/*#if PROD*/s/*#/if*/://' + window.location.hostname + ':/*#if app.websocketPort*//*#val app.websocketPort*//*#else*/3300/*#/if*//',{
					'reconnection limit': 3000,
					'max reconnection attempts': Infinity,
					//'sync disconnect on unload': true,
				});
				var secure = window.App && App.secure && App.secure(), connectedFn, connectedFirstTime = true;;
				socket.on('connect',function(){
					window.App && App.online();
					if(connectedFirstTime){
						if(window.App){
							App.on('online',function(){ if(!socket.socket.connected) socket.socket.reconnect(); });
							//App.on('offline',socket.close.bind(socket));
						}
						if(secure){
							var connectedFn;
							secure.on('connected',connectedFn = function(){
								socket.emit('auth',secure.getToken());
							}).on('disconnected',function(){
								socket.emit('auth');
							});
							socket.on('authfailed',function(){
								alert('authfailed');
								secure.reconnect();
							});
						}
					}
					if(secure && secure.isConnected()) secure.checkToken();
					if(connectedFirstTime){
						S.WebSocket = Object.freeze({
							on: socket.on.bind(socket),
							emit: function(){ S.log('S.WebSocket [emit]',arguments); return socket.emit.apply(socket,arguments); },//socket.emit.bind(socket),
							send: socket.send.bind(socket),
						});
						connectedFirstTime = false;
						callback();
					}
				});
				
				socket.on('disconnect',function(){
					window.App && App.offline();
				});
			});
		}
	};
})();
