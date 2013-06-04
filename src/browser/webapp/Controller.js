App.Controller = (function(){
	var Controller = function(){
	};
	
	Controller.prototype={
		beforeDispatch:function(){},
		
		redirect:function(to,exit){
			App.load(to);
			if(exit) throw new S.Controller.Stop();
		},
		dispose:function(){
			delete this.methods;
		}
	};
	
	Controller.extend=S.extThis;
	
	var createF=function createF(Controller){
		var f=function(classProps,protoProps){
			if(!protoProps){ protoProps=classProps; classProps=undefined; }
			return Controller.extend(protoProps,classProps);
		};
		f.Controller=Controller;
		f.Action=function(args,route,action){
			if(S.isFunc(args)){ action=args; args={}; }
			else if(S.isFunc(route)){ action=route; route=undefined; }
			
			if(route===undefined) route='/:controller/:action/*';
			
			action.route=function(){ return '?'; };
			
			return action;
		};
		f.extend=function(){
			var c=Controller.extend.apply(Controller,arguments);
			return createF(c);
		}
		return f;
	};
	return createF(Controller);
})();
App.Controller.Stop=function(){};