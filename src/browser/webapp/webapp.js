includeCore('browser/jquery-latest');
includeCore('browser/base/');
includeCore('browser/base/S.Ajax');
includeCore('browser/base/S.History');
includeCore('browser/base/S.require');
S.require.prefix=Config.id+'/';

global.FatalError=function(error){
	alert(this.error=error);
	$('#jsAppLoadingMessage').addClass('message error').text(error);
	throw this;
};
global.FatalError.toString=function(){ return 'Fatal Error: '+this.error; }


global.App={
	loading:true,
	
	readyCallbacks:new CallbacksOnce(),
	
	preinit:function(r,rl){
		this.router=new App.Router(r,rl);
	},
	
	run:function(){
		this.readyCallbacks.fire();
		delete this.readyCallbacks;
		App.load(S.History.getFragment(),function(){
			App.loading=false;
		});
	},
	
	load:function(url,callback){
		try{
			var route=this.router.find(url);
			if(!route) throw HttpException.notFound();
			console.log(route);
			S.History.navigate(url);
			S.require('c/'+route.controller,function(){
				try{
					var c=App.controllers[route.controller];
					/*#if DEV*/ if(!c) console&&console.log('This controller doesn\'t exists: "'+route.controller+'".'); /*#/if*/
					if(!c) throw HttpException.notFound();
					c.dispatch(route);
				}catch(err){
					App.handleError(err);
				}
			});
		}catch(err){
			App.handleError(err);
		}
	},
	
	handleError:function(err){
		if(err instanceof App.Controller.Stop) return;
		if(err instanceof HttpException){
			console&&console.log("APP : catch HttpException :",err);
			if(App.loading) new FatalError('404 Not Found');
		}
		console&&console.log("APP : catch error :",err);
		throw err;
	}
	
	
};


includeCore('base/HttpException');
includeCore('base/Router');
includeCore('browser/webapp/Controller');
