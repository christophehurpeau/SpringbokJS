/*#if NODE */
var http=require('http');
S.Helpers=function(app,controller){ this.controller=controller; this.req=controller.req;this.res=controller.res;this.router=app.router; };
/*#else*/
S.Helpers=function(router,req){ this.router=router; this.req=req };
/*#/if*/

S.extPrototype(S.Helpers,{
	/*#if NODE */
	
	/* https://github.com/jed/locale/blob/master/src/index.coffee */
	locale:function(){
		var locale,accept=this.req.headers['accept-language'];
		if(accept && (accept=accept.split(','))){
			for(var i,l=accept.length,a;i<l;i++){
				
			}
		}
		
		//locale = Locale.default
		
		for(var l in App.Locales){
			
		}
		
		locale=App.Locales[locale];
		this.locale=function(){return locale;};
		return locale;
	},
	
	
	redirect:function(to,entry,status){
		status=status||302;
		var body,url=this.url(to, entry);
		if(this.req.accepts('html')){
			this.res.setHeader('Content-Type','text/html');
			var escapedUrl=S.escapeUrl(url);
			body='<html><body><p>'+http.STATUS_CODES[status]+'.'
				+'Redirecting to <a href="'+escapedUrl+'">'+escapedUrl+'</a></p></body></html>';
		}else if(this.req.accepts('text')){
			this.res.setHeader('Content-Type','text/plain');
			body=http.STATUS_CODES[status] + '. Redirecting to ' + url;
		}
		this.res.setHeader('Location',url);
		this.res.statusCode = status;
		S.log(body);
		this.res.end(body);
	},
	redirectPermanent:function(to,entry){
		this.redirect(to,entry,301);
	},
	
	render:function(template,data,entry){
		entry=entry||this.req.entry;
		if(data==null) data={};
		var layout=false,H=this,req=this.req;
		//TODO : find a way to do it natively
		data.layout=function(title,name){ data.layoutTitle=title; layout=name; };
		data.element=function(template,data){
			/*#if DEV*/ if(!App.views[entry][template]) throw new Error('ViewElement does not exists : '+entry+'..'+template); /*#/if*/
			return App.views[entry][template](H,data);
		};
		/*#if DEV*/ if(!App.views[entry][template]) throw new Error('ViewElement does not exists : '+entry+'..'+template); /*#/if*/
		var content=App.views[entry][template](H,data);
		if(layout===false) this.res.end(content);
		else{
			data.layoutContent=content;
			this.renderLayout(layout,data);
		}
	},
	renderLayout:function(layout,data){
		console.log('renderLayout:',layout||this.controller.self.layout||(this.req.entry+'/default'),data.layoutContent);
		return this.render(layout||this.controller.self.layout||(this.req.entry+'/default'),data,'layouts');
	},
	
	
	/* translations */
	
	t:function(string){ return this.locale().appTranslations[string] || string; },
	tC:function(string){ return string; },
	tF:function(modelName,string){ return string; },
	
	
	/*#else*/
	redirect:function(to){
		App.load(this.url(to));
		throw App.Controller.Stop;
	},
	
	locale:function(){
		return window.i18n;
	},
	
	/* translations */
	
	t:S.t,
	tC:S.tC,
	tF:S.tF
	
	/*#/if*/
});

includeCore('helpers/Url');
includeCore('helpers/Html');
/*#if NODE */
	includeCore('helpers/HtmlHead');
/*#/if*/
includeCore('helpers/Menu');
/*global.H=S.extObjs({},require('./Html'));*/


'niceDate shortDate compactDate simpleDate completeDate simpleTime niceDateTime compactDateTime simpleDateTime completeDateTime'
	.split(' ').forEach(function(mName){
		var datetime = mName.slice(-8) === 'DateTime';
		var i18nmName = 'format' + (datetime ? 'DateTime' : 'Date')+ UString.ucFirst(mName.slice(0,datetime ? -8 : -4));
		S.Helpers.prototype[mName] = function(date){
			date = UDate.parseDate(date);
			return this.locale()[i18nmName](date);
		};
	});

