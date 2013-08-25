includeJsCore('browser/base/');
includeJsCore('browser/base/S.Ajax');
includeJsCore('browser/base/S.History');
includeJsCore('browser/base/S.require');
includeJsCore('elements/');
includeJsCore('elements/Form');
includeJsCore('helpers/');
includeJsCore('browser/ui/validation');
includeJsCore('browser/spa');
S.require.prefix=Config.id+'/';

global.FatalError=function(error){
	alert(this.error=error);
	var appLoadingMessage=$('#jsAppLoadingMessage');
	appLoadingMessage && appLoadingMessage.setClass('message error').text(error);
	throw this;
};
global.FatalError.toString=function(){ return 'Fatal Error: '+this.error; };

/* controllers */
/*#if DEV*/if(global.C){ console.error(C); throw new Error('C is already defined'); } /*#/if*/
Object.defineProperty(global,'C',{ value:new Map });

/* layouts */
/*#if DEV*/if(global.L){ console.error(L); throw new Error('L is already defined'); } /*#/if*/
Object.defineProperty(global,'L',{ value:new Map });

/* models */
/*#if DEV*/if(global.M){ console.error(M); throw new Error('M is already defined'); } /*#/if*/
Object.defineProperty(global,'M',{ value:{} });


/* App */
global.App={
	loading:true,
	
	readyCallbacks:new CallbacksOnce(),
	
	preinit:function(r,rl){
		this.router=new App.Router(r,rl);
	},
	
	topLayout:{
		_init:function(child,callback){
			if(this.child !== child){
				this.child && this.child.dispose();
				this.child=child;
			}
			callback();
		}
	},
	
	run:function(){
		this.lang=$.first('meta[name="language"]').attr('content');
		this.topLayout.body=$.first('body');
		this.request=new App.Request;
		this.request.lang=this.lang;
		this.helpers=new S.Helpers(this.router,this.request);
		
		var run = function(){
			S.log('Running webapp...');
			this.readyCallbacks.fire();
			delete this.readyCallbacks;
			this.load(S.History.getFragment(),function(){
				App.loading=false;
			});
		}.bind(this);
		S.WebSocket ? S.WebSocket.start(run) : run();
	},
	
	setLang:function(lang){
		this.lang=lang;
		this.request.lang=lang;
		//refresh interface
	},
	
	load:function(url,callback){
		S.log('Load: '+url);
		App.url = url;
		try{
			var route=this.router.find(url);
			if(!route) throw HttpException.notFound();
			S.log(route);
			S.History.navigate(url);
			S.require('c/'+route.controller,function(){
				try{
					var c=C[route.controller];
					/*#if DEV*/ if(!c) S.log('This controller doesn\'t exists: "'+route.controller+'".'); /*#/if*/
					if(!c) throw HttpException.notFound();
					c.dispatch(route,this.request,this.helpers);
					callback && callback();
				}catch(err){
					App.handleError(err);
				}
			}.bind(this));
		}catch(err){
			App.handleError(err);
		}
	},
	
	handleError:function(err){
		//if(err instanceof App.Controller.Stop) return;
		if(err===App.Controller.Stop) return;
		if(err instanceof HttpException){
			S.log("APP : catch HttpException :",err);
			if(App.loading) new FatalError('404 Not Found');
		}
		S.log("APP : catch error :",err,err.stack);
		throw err;
	},
};

'get post put delete'.split(' ').forEach(function(mName){
	App[mName] = function(){
		var sAjax = S[mName].apply(S,arguments);
		if(App.request.secure().isConnected())
			sAjax.header('x-sauth',App.request.secure().getToken());
		return sAjax;
	};
});


includeCore('base/HttpException');
includeCore('base/Router');
includeCore('browser/webapp/Controller');
includeCore('browser/webapp/Layout');
includeCore('browser/webapp/Request');
