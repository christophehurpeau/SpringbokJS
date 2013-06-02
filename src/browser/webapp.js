includeCore('browser/jquery-latest');
includeCore('browser/base/');



global.FatalError=function(error){
	alert(this.error=error);
	$('#jsAppLoadingMessage').addClass('message error').text(error);
	throw this;
};
global.FatalError.toString=function(){ return 'Fatal Error: '+this.error; }


global.App={
	readyCallbacks:new CallbacksOnce(),
	
	preinit:function(r,rl){
		this.router=App.Router(r,rl);
	},
	
	run:function(){
		this.readyCallbacks.fire();
		delete this.readyCallbacks;
		App.load();
	},
	
	require:function(){
		Array.protototype.forEach.call(arguments,function(k,fileName){
			if(!loadedRequired[fileName]){
				loadedRequired[fileName]=true;
				S.loadSyncScript(webUrl+'js/'+INCLPREFIX+fileName+'.js'/*#if DEV*/+'?'+(new Date().getTime())/*#/if*/);
			}
		});
	},
	
	load:function(url){
		try{
			var route=S.router.find(url);
			if(!route) notFound();
			//console.log(route);
			S.History.navigate(url);
			App.require('c/'+route.controller);
			var c=C[route.controller];
			/*#if DEV*/ if(!c) console&&console.log('This controller doesn\'t exists: "'+route.controller+'".'); /*#/if*/
			if(!c) notFound();
			c.dispatch(route);
		}catch(err){
			if(err instanceof S.Controller.Stop) return;
			if(err instanceof HttpException){
				console&&console.log("APP : catch HttpException :",err);
			}
			console&&console.log("APP : catch error :",err);
			throw err;
		}
	}
};


includeCore('base/Router');
