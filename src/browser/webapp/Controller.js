App.Controller = (function(){
	var Controller=S.defineProperties({},{
		writable:{
			beforeDispatch:function(){}
		},
		
		dispatch:function(route,req){
			if(this.beforeDispatch) this.beforeDispatch();
			route.sParams.unshift(route.nParams);
			var m=this[UString.ucFirst(route.action)];
			/*#if DEV*/ if(!m) console.log('This action doesn\'t exists: "'+route.action+'".'
							+' Known methods: '+Object.keys(this).filter(function(m){ return m[0]===m[0].toUpperCase() })); /*#/if*/
			if(!m) throw HttpException.notFound();
			m.call(this,req,App.helpers);
		},
		layout:function(name,callback){
			if(!callback){ callback=name; name=this.defaultLayout; }
			/*#if DEV*/if(!L.has(name)) throw new Error("This layout doesn't exists: "+name);/*#/if*/
			L.get(name).render(callback.bind(this));
		},
		dispose:function(){
		}
	});
	
	var Action=function(args,route,action){
		if(S.isFunc(args)){ action=args; args={}; }
		else if(S.isFunc(route)){ action=route; route=undefined; }
		
		if(route===undefined) route='/:controller/:action/*';
		
		action.route=function(){ return '?'; };
		return action;
	};
	
	var createF=function createF(Controller){
		var f=function(controllerName,props){
			/*#if DEV*/if(!S.isString(controllerName)) throw new Error('New Controller: first arg is the name, second is the object containing the methods');/*#/if*/
			var o=C[controllerName]=Object.create(Controller);
			UObj.extend(o,props);
			o.name=controllerName;
			
		};
		f.Controller=Controller;
		f.Action=Action;
		f.extend=function(props){
			var c=Controller.extend.apply(Controller,arguments);
			return createF(UObj.union(props,Controller));
		}
		return f;
	};
	return createF(Controller);
})();
App.Controller.Stop='App.Controller.Stop';