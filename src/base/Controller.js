var httpException=require('./HttpException.js'),
	helpers=require('../helpers'),
	Controller = function(app,req,res){
		this.req=req; this.res=res;
		this.H=new helpers(req,res);
	};

Controller.prototype={
	direct:function(to, entry, status) {
		this.res.redirect(this.app.url(to, entry), status);
	},
	redirectPermanent:function(to, entry) {
		this.redirect(to, entry, 301);
	},
	notFound:function(){ httpException.notFound(); },
	
	render:function(data,fileName,folderName){
		this.res.setHeader('Content-Type','text/html; charset=UTF-8');
		this._render('views/'+(folderName||this.req.route.controller)+'/'+(fileName||this.req.route.action),data);
	},
	_render:function(template,data){console.log(template);
		if(data==null) data={};
		var layout=false,H=this.H;
		//TODO : find a way to do it natively
		data.layout=function(title,name){ data.layoutTitle=title; layout=name||'default'; };
		data.element=function(template,data){ return App.views[template](H,data) };
		var content=App.views[template](this.H,data);
		if(layout===false) this.res.end(content);
		else{
			data.layoutContent=content;
			this._render('viewsLayouts/'+layout,data);
		}
	}
};

Controller.extend=S.extThis;

module.exports = Controller;
