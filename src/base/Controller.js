var Controller = function(app,req,res){
	this.req=req; this.res=res;
	this.H=new S.Helpers(app,this);
};

Controller.prototype={
	beforeDispatch:function(){},
	
	findOne:function(modelName){ return M[modelName].find.one(this.H); },
	
	redirect:function(to, entry, status){
		this.H.redirect(to,entry,status);
	},
	redirectPermanent:function(to, entry) {
		this.redirect(to, entry, 301);
	},
	notFound:function(){ throw HttpException.notFound(); },
	
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
	},
	
	webApp:function(entry){
		var loading=this.H.tC('Loading...'), ielt9=this.req.isIElt9();
		this.res.end('<!DOCTYPE html><html><head>'
			+this.H.metaCharset()+this.H.metaLanguage()
			+'<title>'+Config.projectName+' - '+loading+'</title>'
			+this.H.cssLink('/'+entry)
			+this.H.jsI18n('/'+entry)
			+this.H.jsInline(
				'window.onload=function(){'
					+(ielt9?
						'var s=document.createElement("script");'
						+'s.type="text/javascript";'
						+'s.src="'+this.H.staticUrl('/es5-compat.js')+'";'
						+'document.body.appendChild(s);'
					:'')
					+'var s=document.createElement("script");'
					+'s.type="text/javascript";'
					+'s.src="'+this.H.staticUrl('/'+entry+(ielt9?'.oldIe':'')+'.js')+'";'
					+'document.body.appendChild(s);'
				+'};'
			)
			+'</head><body>'
			+'<div id="container"><div class="startloading"><b>'+Config.projectName+'</b><div id="jsAppLoadingMessage">'+loading+'</div></div></div>'
			+'</body>'
		//HDev::springbokBar();
			+'</html>');
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
