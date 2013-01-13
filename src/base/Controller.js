var httpException=require('./HttpException.js');
	
var Controller = function(app,req,res){
	this.req=req; this.res=res;
	this.H=new S.Helpers(app,this);
};

Controller.prototype={
	beforeDispatch:function(){},
	
	redirect:function(to, entry, status) {
		this.res.redirect(this.app.url(to, entry), status);
	},
	redirectPermanent:function(to, entry) {
		this.redirect(to, entry, 301);
	},
	notFound:function(){ httpException.notFound(); },
	
	render:function(data,fileName,folderName){
		this.res.setHeader('Content-Type','text/html; charset=UTF-8');
		this.H.render((folderName||this.req.route.controller)+'/'+(fileName||this.req.route.action),data);
	},
	renderText:function(text){
		this.res.setHeader('Content-Type','text/plain; charset=UTF-8');
		this.res.end(text);
	},
	
	table:function(modelName,cols){
		return this.H.Table(modelName,cols);
	}
};

Controller.extend=S.extThis;

module.exports = (function(){
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
