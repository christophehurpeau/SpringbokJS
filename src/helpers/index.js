S.Helpers=function(app,controller){ this.controller=controller; this.req=controller.req;this.res=controller.res;this.router=app.router; };
S.extProto(S.Helpers,{
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
		this.locale=function(){return locale;}
		return locale;
	},
	
	
	
	render:function(template,data,entry){
		entry=entry||this.req.entry;
		if(data==null) data={};
		var layout=false,H=this,req=this.req;
		//TODO : find a way to do it natively
		data.layout=function(title,name){ data.layoutTitle=title; layout=name; };
		data.element=function(template,data){
			/* DEV */ if(!App.views[entry][template]) throw new Error('Element does not exists : '+entry+'..'+template); /* /DEV */
			return App.views[entry][template](H,data);
		};
		/* DEV */ if(!App.views[entry][template]) throw new Error('Element does not exists : '+entry+'..'+template); /* /DEV */
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
	
	t:function(string){ return string; },
	tC:function(string){ return string; },
	tF:function(modelName,string){ return string; }
});
require('./Url'),
require('./Html'),
require('./Menu')
/*global.H=S.extObjs({},require('./Html'));*/
