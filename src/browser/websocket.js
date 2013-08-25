S.WebSocket = (function(){
	return {
		start: function(callback){
			console.log('S.WebSocket start');
			S.loadScript('http/*#if PROD*/s/*#/if*/://' + window.location.hostname + ':/*#if app.websocketPort*//*#val app.websocketPort*//*#else*/3300/*#/if*//socket.io/socket.io.js',function(){
				var socket = io.connect('http/*#if PROD*/s/*#/if*/://' + window.location.hostname + ':/*#if app.websocketPort*//*#val app.websocketPort*//*#else*/3300/*#/if*//'), connectedFirstTime = true;
				var secure = window.App && App.request.secure && App.request.secure(), connectedFn;
				socket.on('connect',function(){
					if(connectedFirstTime){
						if(secure){
							var secure = App.request.secure(), connectedFn;
							secure.on('connected',connectedFn = function(){
								socket.emit('auth',secure.getToken());
							}).on('disconnected',function(){
								socket.emit('auth');
							});
						}
					}
					if(secure && secure.isConnected()) secure.checkToken();
					if(connectedFirstTime){
						S.WebSocket = Object.freeze({
							on: socket.on.bind(socket),
							emit: function(){ S.log('S.WebSocket [emit]',arguments); return socket.emit.apply(socket,arguments); },//socket.emit.bind(socket),
							send: socket.send.bind(socket)
						});
						connectedFirstTime = false;
						callback();
					}
				});
			});
		}
	};
})();