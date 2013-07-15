includeCore('browser/base/S.store');

S.extProto(App.Request,{
	configurable:{
		secure:function(){
			var _connected,_token,
			  secure=Object.freeze({
				isConnected:function(){
					return !!this.connected();
				},
				connected:function(){
					if(_connected===undefined){
						var o=S.store.get('S.CSecure');
						if(o){
							_connected=o.connected;
							_token=o.token;
						}else _connected=false;
					}
					return _connected;
				},
				
				checkAccess:function(){
					if(!this.isConnected()){
						App.load('/site/login');
						return false;
					}
					return true;
				},
				reconnect:function(){
					this.setConnected(false);
					this.checkAccess();
					throw App.Controller.Stop;
				},
				
				setConnected:function(userId,token){
					S.store.set('S.CSecure',{ connected: (_connected=userId), token: (_token=token) });
				},
				
				redirectIfConnected:function(){
					if(this.isConnected())
						throw new Error;
				},
				redirectAfterConnection:function(){
					App.load('/');
					throw App.Controller.Stop;
				}
			});
			Object.defineProperty(this,'secure',{ value:secure });
			return secure;
		}
	}
})
