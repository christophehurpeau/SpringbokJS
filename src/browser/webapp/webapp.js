includeCore('browser/base/');
includeCore('browser/base/S.Ajax');
includeCore('browser/base/S.History');
includeCore('browser/base/S.require');
includeCore('elements/');
includeCore('elements/Form');
includeCore('helpers/');
S.require.prefix=Config.id+'/';

global.FatalError=function(error){
	alert(this.error=error);
	var appLoadingMessage=$('#jsAppLoadingMessage');
	appLoadingMessage && appLoadingMessage.setClass('message error').text(error);
	throw this;
};
global.FatalError.toString=function(){ return 'Fatal Error: '+this.error; }

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
		S.log('Running webapp...');
		this.lang=$.first('meta[name="language"]').attr('content');
		this.topLayout.body=$.first('body');
		this.readyCallbacks.fire();
		delete this.readyCallbacks;
		this.request=new App.Request;
		this.request.lang=this.lang;
		this.helpers=new S.Helpers(this.router,this.request);
		App.load(S.History.getFragment(),function(){
			App.loading=false;
		});
	},
	
	setLang:function(lang){
		this.lang=lang;
		this.request.lang=lang;
		//refresh interface
	},
	
	load:function(url,callback){
		S.log('Load: '+url);
		try{
			var route=this.router.find(url);
			if(!route) throw HttpException.notFound();
			console.log(route);
			S.History.navigate(url);
			S.require('c/'+route.controller,function(){
				try{
					var c=C[route.controller];
					/*#if DEV*/ if(!c) console&&console.log('This controller doesn\'t exists: "'+route.controller+'".'); /*#/if*/
					if(!c) throw HttpException.notFound();
					c.dispatch(route,this.request,this.helpers);
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
			console&&console.log("APP : catch HttpException :",err);
			if(App.loading) new FatalError('404 Not Found');
		}
		console&&console.log("APP : catch error :",err,err.stack);
		throw err;
	}
};


includeCore('base/HttpException');
includeCore('base/Router');
includeCore('browser/webapp/Controller');
includeCore('browser/webapp/Layout');
includeCore('browser/webapp/Request');
