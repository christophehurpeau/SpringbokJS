includeCore('browser/base/S.store');

App.secure = function(){ return App.request.secure(); };
S.extPrototype(App.Request,{
	configurable:{
		secure: function(){
			var data,
			  save = function(){ S.store.set('S.CSecure',data); },
			  secure = {
				isConnected: function(){
					return !!this.connected();
				},
				connected: function(){
					if(data===undefined){
						data=S.store.get('S.CSecure') || { connected: false };
						data.connected && this.checkToken();
					}
					return data.connected;
				},
				getToken: function(){
					return data.token;
				},
				
				checkToken: function(){
					if(S.WebSocket){
						// else S.WebSocket is starting, checkToken is called later
						if(!S.WebSocket.start)
							S.WebSocket.emit('auth',data.token);
					}else{
						App.get('/site/checkToken').send(function(data){
							if(data!=='1'){
								alert('checkToken failed');
								this.reconnect();
							}
						}.bind(this));
					}
				},
				
				checkAccess: function(){
					if(!this.isConnected()){
						data.backUrl = App.url;
						save();
						if(App.loading) S.History.navigate('/site/login');
						else App.load('/site/login');
						return false;
					}
					return true;
				},
				reconnect: function(){
					this.setConnected(false);
					return this.checkAccess();
				},
				
				setConnected: function(userId,token){
					//data = { connected: userId, token: token };
					data.connected = userId;
					data.token = token;
					save();
					this.fire(userId ? 'connected' : 'disconnected', userId);
				},
				
				redirectIfConnected: function(){
					if(this.isConnected()){
						this.redirectAfterConnection();
						return true;
					}
					return false;
				},
				
				redirectAfterConnection: function(){
					var url = data.backUrl;
					if(url){
						delete data.backUrl;
						save();
					}
					App.load( url || '/' );
				}
			};
			secure = Object.freeze( S.Listenable.extendObject( secure ) );
			Object.defineProperty(this,'secure',{ value: function(){ return secure; } });
			Object.defineProperty(App,'secure',{ value: function(){ return secure; } });
			return secure;
		}
	}
});
